import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useValidationErrorUpdate } from "../Context/ValidationErrorContext";
import { useNavigate } from "react-router-dom";
import LoadingWrapper from "../wrappers/LoadingWrapper/LoadingWrapper";
import ErrorWrapper from "../wrappers/ErrorWrapper/ErrorWrapper";
import CardWrapper from "../wrappers/CardWrapper/CardWrapper";
import CreateOrModifyTestScriptCard from "../../../components/CreateOrModifyTestScriptCard";
import AddOrModifyStepsCard from "../../../components/AddOrModifyStepsCard";
import EnterTestScriptNameCard from "../../../components/EnterTestScriptNameCard";
import { v4 as uuidv4 } from "uuid";
import Axios from "axios";
import "../../../styles/ModifyExistingTestScript.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/AlertComponents.css";
import "../../../styles/Steps.css";

function ModifyExistingTestScript() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [isValidTestScriptNameEntered, setIsValidTestScriptNameEntered] = useState(false);
    const invalidTestScriptNameError = useValidationErrorUpdate();
    const [isSubmitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const testScriptID = useRef("");
    const [formProps, setFormProps] = useState({
        testScriptName: "",
        testScriptDescription: "",
        testScriptPrimaryWorkstream: "",
        ownerFirstName: "",
        ownerLastName: "",
    });
    const [testScriptSteps, setTestScriptSteps] = useState([]);
    const cardChanged = useRef(false);
    const [isUserModifyingSteps, setIsUserModifyingSteps] = useState(false);
    const [isAddOrModifyStepsButtonDisabled, setIsAddOrModifyStepsButtonDisabled] = useState(false);
    const [isAddStepButtonDisabled, setAddStepButtonDisabled] = useState(false);
    const [isRemoveStepButtonDisabled, setRemoveStepButtonDisabled] = useState(true);
    const [isModifyButtonDisabled, setIsModifyButtonDisabled] = useState(true);
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);
    const async = useRef(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const alertMessage = useRef("Test script successfully submitted!");
    const alertType = useRef("success-alert");

    const testScriptNamesAlreadyInDB = useRef([]);
    const isDataBeingFetched = useRef(false);
    const isTestScriptSubmitted = useRef(false);

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";
    const writeErrorMessage = "Apologies! We've encountered an error. Please attempt to re-submit your test script.";

    const navigate = useNavigate();

    const handleError = useCallback((errorType) => {
        console.log("handling error");
        setIsErrorThrown(true);
        alertType.current = "error-alert";
        errorType === "r"
            ? alertMessage.current = loadErrorMessage
            : alertMessage.current = writeErrorMessage;

        // Delay is set up just in case an error is generated before the is fully-displayed
        // let delay = transitionElementOpacity === "100%" ? 500 : rendering ? 500 : 0;
        let delay = 0; // TODO: test this and amend if necessary

        if (rendering) {
            setRendering(false);
        }

        setTimeout(() => {
            setAlert(true);
        }, delay);
    }, [alertType, rendering]);

    const handleAlertClosed = (alertClosed) => {
        if (alertClosed) {
            setAlert(false);
            navigate("/");
        }
    }

    useEffect(() => {
        const runPrimaryReadAsyncFunctions = async () => {
            isDataBeingFetched.current = true;
            await fetchTestScriptNamesAlreadyInDB();
            setRendering(false);
        }

        const fetchTestScriptNamesAlreadyInDB = async () => {
            console.log("fetching existing test script names");
            try {
                async.current = true;
                await Axios.get("http://localhost:5000/get-test-script-names", {
                })
                    .then(res => {
                        testScriptNamesAlreadyInDB.current = res.data.map(({ name }) => name);
                        console.log(res.data);
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        const runSecondaryReadAsyncFunctions = async (testScriptName) => {
            isDataBeingFetched.current = true;
            await fetchTestScriptInformation(testScriptName);
            console.log(testScriptID.current);
            await fetchTestScriptSteps(testScriptID.current);
            setRendering(false);
        }

        const fetchTestScriptInformation = async (testScriptName) => {
            try {
                async.current = true;
                await Axios.get(`http://localhost:5000/get-test-script/${testScriptName}`, {
                })
                    .then(res => {
                        console.log(res.data);
                        populateTestScriptInformation(res.data);
                    })
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        const populateTestScriptInformation = (testScriptInformation) => {
            setFormProps(
                prev => ({
                    ...prev,
                    "testScriptName": testScriptInformation.name,
                    "testScriptDescription": testScriptInformation.description,
                    "testScriptPrimaryWorkstream": testScriptInformation.primaryWorkstream,
                    "ownerFirstName": testScriptInformation.owner["firstName"],
                    "ownerLastName": testScriptInformation.owner["lastName"],
                })
            );
            // setFormProps({
            //     testScriptName: testScriptInformation.name,
            //     testScriptDescription: testScriptInformation.description,
            //     testScriptPrimaryWorkstream: testScriptInformation.primaryWorkstream,
            //     ownerFirstName: testScriptInformation.owner["firstName"],
            //     ownerLastName: testScriptInformation.owner["lastName"],
            // });
            testScriptID.current = testScriptInformation._id;
            async.current = false;
        }

        const fetchTestScriptSteps = async (testScriptID) => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get(`http://localhost:5000/get-test-script-steps/${testScriptID}`, {
                    })
                        .then(res => {
                            setTestScriptSteps(res.data);
                            async.current = false;
                        })
                } catch (e) {
                    console.log(e);
                    handleError("r");
                }
            }
        }

        if (rendering) { // TODO: go over logic here
            if (!isValidTestScriptNameEntered && !isDataBeingFetched.current) {
                runPrimaryReadAsyncFunctions();
            } else if (isValidTestScriptNameEntered) {
                if (!isUserModifyingSteps && !isDataBeingFetched.current) {
                    runSecondaryReadAsyncFunctions(formProps["testScriptName"]);
                } else if (cardChanged.current) {
                    cardChanged.current = false
                    setRendering(false);
                }
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!isValidTestScriptNameEntered) {
                formProps["testScriptName"].trim().length ? setSubmitButtonDisabled(false) : setSubmitButtonDisabled(true);
            } else {
                if (!isTestScriptSubmitted.current) {
                    (formProps["testScriptName"].trim() !== "" && formProps["testScriptDescription"].trim() !== "" && formProps["testScriptPrimaryWorkstream"].trim() !== ""
                        && formProps["ownerFirstName"].trim() !== "" && formProps["ownerLastName"].trim() !== "" /*&& formProps["ownerEmail"] !== ""*/)
                        ? setIsModifyButtonDisabled(false)
                        : setIsModifyButtonDisabled(true);
                    testScriptSteps.length && !testScriptSteps.slice(-1)[0]["description"].trim().length
                        ? setAddStepButtonDisabled(true)
                        : setAddStepButtonDisabled(false);
                    testScriptSteps.length === 1
                        ? setRemoveStepButtonDisabled(true)
                        : setRemoveStepButtonDisabled(false);
                    // TODO: look into abstracting functions in useEffect hook... can this be done?
                }
            }
        }
    }, [rendering, isDataBeingFetched, cardChanged, isUserModifyingSteps, isValidTestScriptNameEntered, formProps, testScriptSteps, isAddStepButtonDisabled, isModifyButtonDisabled, isTestScriptSubmitted, handleError]);

    const handleChangeCard = () => {
        setRendering(true);
        cardChanged.current = true;
        isUserModifyingSteps
            ? setIsUserModifyingSteps(false)
            : setIsUserModifyingSteps(true);
    }

    const handleAddStep = () => {
        console.log("adding step");
        let stepCount = testScriptSteps.length;
        let uniqueID = uuidv4();
        let newStep = { number: stepCount + 1, description: "", pass: false, uniqueID: uniqueID };
        let tempArray = testScriptSteps;
        tempArray.push(newStep);
        setTestScriptSteps([...tempArray]);
    }

    const handleUpdateStepDescription = (updateInfo) => {
        const stepNumber = updateInfo["number"];
        const updatedDescription = updateInfo["description"];
        let copyOfSteps = testScriptSteps;
        let stepToUpdate = copyOfSteps.filter(obj => {
            return obj["number"] === stepNumber
        });
        stepToUpdate = stepToUpdate[0];
        let indexOfStepToUpdate = copyOfSteps.indexOf(stepToUpdate);
        stepToUpdate["description"] = updatedDescription;
        setTestScriptSteps([...copyOfSteps]);
    }

    const handleRemoveStep = async (stepInfo) => {
        const stepNumber = stepInfo["number"];
        let copyOfSteps = testScriptSteps;
        copyOfSteps = copyOfSteps.filter(obj => {
            return obj["number"] !== stepNumber
        });
        if (testScriptSteps.length) {
            copyOfSteps = await updateStepNumbers(copyOfSteps, stepNumber);
        }
        console.log(copyOfSteps);
        setTestScriptSteps([...copyOfSteps]);
    }

    const updateStepNumbers = (listOfSteps, startingStepNumber) => {
        console.log("updating steps");
        for (let i = startingStepNumber - 1; i < listOfSteps.length; i++) {
            listOfSteps[i]["number"]--;
        }
        return listOfSteps;
    }

    const handleRequestTestscript = () => {
        if (!isValidTestScriptNameEntered) {
            if (validateTestScriptNameEntered()) {
                setIsValidTestScriptNameEntered(true);
                isDataBeingFetched.current = false;
                setRendering(true);
                setSubmitButtonDisabled(true);
            } else {
                invalidTestScriptNameError("Invalid test script name");
            }
        }
    }

    // adapted from https://stackoverflow.com/questions/60440139/check-if-a-string-contains-exact-match
    const validateTestScriptNameEntered = () => {
        for (let i = 0; i < testScriptNamesAlreadyInDB.current.length; i++) {
            let escapeRegExpMatch = formProps["testScriptName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(testScriptNamesAlreadyInDB.current[i])) {
                return true;
            }
        }
        return false;
    }

    const handleUpdate = () => {
        isTestScriptSubmitted.current = true;
        setSubmitButtonDisabled(true);
        setIsAddOrModifyStepsButtonDisabled(true);
        setDisplayFadingBalls(true);
        runWriteAsyncFunctions();
    }

    const runWriteAsyncFunctions = () => {
        updateTestScriptInDB();
        setAlert(true);
    }

    const updateTestScriptInDB = async () => {
        console.log("updating test script");
        async.current = true;
        try {
            removeEmptySteps();
            await Axios.put("http://localhost:5000/update-test-script", {
                testScriptOwner: { firstName: formProps["ownerFirstName"], lastName: formProps["ownerLastName"] },
                testScriptName: formProps["testScriptName"],
                testScriptDescription: formProps["testScriptDescription"],
                testScriptPrimaryWorkstream: formProps["testScriptPrimaryWorkstream"],
                testScriptSteps: testScriptSteps
            })
                .then(res => {
                    console.log(res);
                    async.current = false;
                })
        } catch (e) {
            console.log(e);
            handleError("w");
        }
    }

    const removeEmptySteps = () => {
        if (testScriptSteps.length) {
            if (!testScriptSteps.slice(-1)[0]["description"].trim().length) {
                testScriptSteps.pop();
            }
        }
    }

    return (
        <Fragment>
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transitionElementVisibility}>
            </LoadingWrapper>
            < ErrorWrapper
                alert={alert}
                alertMessage={alertMessage.current}
                handleAlertClosed={handleAlertClosed}
                alertType={alertType.current}>
            </ErrorWrapper>
            {isValidTestScriptNameEntered
                ? <CardWrapper
                    rendering={rendering}
                    isErrorThrown={isErrorThrown}
                    isUserModifyingSteps={isUserModifyingSteps}>
                    {isUserModifyingSteps
                        ? <AddOrModifyStepsCard
                            existingSteps={testScriptSteps}
                            addStep={handleAddStep}
                            isAddStepButtonDisabled={isAddStepButtonDisabled}
                            updateStepDescription={handleUpdateStepDescription}
                            removeStep={handleRemoveStep}
                            isRemoveStepButtonDisabled={isRemoveStepButtonDisabled}
                            goBack={handleChangeCard}>
                        </AddOrModifyStepsCard>
                        : <CreateOrModifyTestScriptCard
                            setFormProps={setFormProps}
                            isModificationCard={true}
                            existingTestScriptName={formProps["testScriptName"]}
                            invalidTestScriptNames={testScriptNamesAlreadyInDB.current}
                            existingTestScriptDescription={formProps["testScriptDescription"]}
                            existingTestScriptPrimaryWorkstream={formProps["testScriptPrimaryWorkstream"]}
                            existingOwnerFirstName={formProps["ownerFirstName"]}
                            existingOwnerLastName={formProps["ownerLastName"]}
                            handleTransitionToStepsPage={handleChangeCard}
                            isAddOrModifyStepsButtonDisabled={isAddOrModifyStepsButtonDisabled}
                            modifyTestScript={handleUpdate}
                            isSubmitOrModifyButtonDisabled={isModifyButtonDisabled}
                            displayFadingBalls={displayFadingBalls}>
                        </CreateOrModifyTestScriptCard>}
                </CardWrapper>
                : <Fragment>
                    {isErrorThrown
                        ? <div></div>
                        : <div className="enter-valid-test-script-name">
                            <div className="enter-valid-test-script-name-container">
                                <div className="page-message">
                                    Retrieve Your Test Script Below:
                                </div>
                                <div className="enter-valid-test-script-name-card">
                                    <EnterTestScriptNameCard
                                        setFormProps={setFormProps}
                                        requestTestScript={handleRequestTestscript}
                                        isSubmitButtonDisabled={isSubmitButtonDisabled}>
                                    </EnterTestScriptNameCard>
                                </div>
                            </div>
                        </div>}
                </Fragment>}
        </Fragment >
    )
};

export default ModifyExistingTestScript;