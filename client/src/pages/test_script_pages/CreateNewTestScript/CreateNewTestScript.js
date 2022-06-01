import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LoadingWrapper from "../wrappers/LoadingWrapper/LoadingWrapper";
import ErrorWrapper from "../wrappers/ErrorWrapper/ErrorWrapper";
import CardWrapper from "../wrappers/CardWrapper/CardWrapper";
// import NavBar from "../../components/Navbar";
// import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import CreateOrModifyTestScriptCard from "../../../components/CreateOrModifyTestScriptCard";
import AddOrModifyStepsCard from "../../../components/AddOrModifyStepsCard";
// import MaterialAlert from "../../components/MaterialAlert";
import { v4 as uuidv4 } from "uuid";
import Axios from "axios";
import "../../../styles/CreateNewTestScript.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/AlertComponents.css";
import "../../../styles/Steps.css";

function CreateNewTestScript() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [formProps, setFormProps] = useState({
        testScriptName: "",
        testScriptDescription: "",
        testScriptPrimaryWorkstream: "",
        ownerFirstName: "",
        ownerLastName: "",
        // ownerEmail: "",
    });
    const [testScriptSteps, setTestScriptSteps] = useState([]);
    const cardChanged = useRef(false);
    const [isUserModifyingSteps, setIsUserModifyingSteps] = useState(false);
    const [isAddOrModifyStepsButtonDisabled, setIsAddOrModifyStepsButtonDisabled] = useState(false);
    const [isAddStepButtonDisabled, setAddStepButtonDisabled] = useState(false);
    const [isRemoveStepButtonDisabled, setRemoveStepButtonDisabled] = useState(true);
    const [isSubmitButtonDisabled, setSubmitButtonDisabled] = useState(true);
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
        const runReadAsyncFunctions = async () => {
            isDataBeingFetched.current = true;
            await fetchTestScriptNamesAlreadyInDB();
            // await deleteTestScript("629669df8f74d1f0b25fe514");
            setRendering(false);
        }

        const fetchTestScriptNamesAlreadyInDB = async () => {
            console.log("fetching existing test script names");
            try {
                async.current = true;
                await Axios.get("http://localhost:5000/get-test-script-names", {
                })
                    .then(res => {
                        testScriptNamesAlreadyInDB.current = res.data.map(({ name }) => name.toLowerCase());
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        if (rendering) {
            if (!isUserModifyingSteps && !isDataBeingFetched.current) {
                runReadAsyncFunctions();
            } else if (isUserModifyingSteps || !isUserModifyingSteps) {
                setRendering(false);
            } else if (cardChanged.current) {
                cardChanged.current = false;
                setRendering(false);
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!isTestScriptSubmitted.current) {
                (formProps["testScriptName"].trim() !== "" && formProps["testScriptDescription"].trim() !== "" && formProps["testScriptPrimaryWorkstream"].trim() !== ""
                    && formProps["ownerFirstName"].trim() !== "" && formProps["ownerLastName"].trim() !== "" /*&& formProps["ownerEmail"] !== ""*/)
                    ? setSubmitButtonDisabled(false)
                    : setSubmitButtonDisabled(true);
                testScriptSteps.length && !testScriptSteps.slice(-1)[0]["description"].trim().length
                    ? setAddStepButtonDisabled(true)
                    : setAddStepButtonDisabled(false);
                testScriptSteps.length === 1
                    ? setRemoveStepButtonDisabled(true)
                    : setRemoveStepButtonDisabled(false);
                // TODO: look into abstracting functions in useEffect hook... can this be done?
            }
        }
    }, [rendering, formProps, isUserModifyingSteps, testScriptSteps, isAddStepButtonDisabled, isSubmitButtonDisabled, isTestScriptSubmitted, handleError]);

    // const deleteTestScript = async (testScriptID) => {
    //     if (!async.current) {
    //         console.log("deleting test script");
    //         try {
    //             console.log(testScriptID);
    //             async.current = true;
    //             await Axios.delete(`http://localhost:5000/delete-test-script/${testScriptID}`, {
    //             })
    //                 .then(res => {
    //                     console.log(res);
    //                     async.current = false;
    //                 });
    //         } catch (e) {
    //             console.log(e);
    //             handleError("r");
    //         }
    //     }
    // }

    // const handleFormCallback = (returnedObject) => {
    //     const field = returnedObject.field;
    //     const value = returnedObject.value;

    //     setFormPropsForFieldAndValue(field, value);
    // }

    // const setFormPropsForFieldAndValue = (field, value) => {
    //     setFormProps((prevState) => ({
    //         ...prevState,
    //         [field]: value,
    //     }));
    // }

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
        let newStep = { number: stepCount + 1, description: "", pass: false, id: uniqueID };
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
        setTestScriptSteps([...copyOfSteps]);
    }

    const updateStepNumbers = (listOfSteps, startingStepNumber) => {
        for (let i = startingStepNumber - 1; i < listOfSteps.length; i++) {
            listOfSteps[i]["number"]--;
        }
        return listOfSteps;
    }

    const handleSubmit = () => {
        isTestScriptSubmitted.current = true;
        setSubmitButtonDisabled(true);
        setIsAddOrModifyStepsButtonDisabled(true);
        setDisplayFadingBalls(true);
        runWriteAsyncFunctions();
    }

    const runWriteAsyncFunctions = () => {
        addTestScriptToDB();
        setAlert(true);
    }

    const addTestScriptToDB = async () => {
        console.log("adding test script to database");
        async.current = true;
        try {
            removeEmptySteps();
            await Axios.post("http://localhost:5000/add-test-script", {
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
            <CardWrapper
                rendering={rendering}
                isErrorThrown={isErrorThrown}
                isUserModifyingSteps={isUserModifyingSteps}>
                {isUserModifyingSteps
                    ? <AddOrModifyStepsCard
                        existingSteps={testScriptSteps}
                        addStep={handleAddStep}
                        isAddStepButtonDisabled={isAddStepButtonDisabled}
                        modifyStepDescription={handleUpdateStepDescription}
                        removeStep={handleRemoveStep}
                        isRemoveStepButtonDisabled={isRemoveStepButtonDisabled}
                        goBack={handleChangeCard}>
                    </AddOrModifyStepsCard>
                    : <CreateOrModifyTestScriptCard
                        setFormProps={setFormProps}
                        existingTestScriptName={formProps["testScriptName"]}
                        invalidTestScriptNames={testScriptNamesAlreadyInDB.current}
                        existingTestScriptDescription={formProps["testScriptDescription"]}
                        existingTestScriptPrimaryWorkstream={formProps["testScriptPrimaryWorkstream"]}
                        existingOwnerFirstName={formProps["ownerFirstName"]}
                        existingOwnerLastName={formProps["ownerLastName"]}
                        handleTransitionToStepsPage={handleChangeCard}
                        isAddOrModifyStepsButtonDisabled={isAddOrModifyStepsButtonDisabled}
                        submitTestScript={handleSubmit}
                        isSubmitOrModifyButtonDisabled={isSubmitButtonDisabled}
                        displayFadingBalls={displayFadingBalls}>
                    </CreateOrModifyTestScriptCard>}
            </CardWrapper>
        </Fragment >
    )
};

export default CreateNewTestScript;
