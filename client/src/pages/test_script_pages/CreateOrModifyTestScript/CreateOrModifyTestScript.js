import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useValidationErrorUpdate } from "../Context/ValidationErrorContext";
import { useNavigate, useParams } from "react-router-dom";
import LoadingWrapper from "../wrappers/LoadingWrapper/LoadingWrapper";
import AlertWrapper from "../wrappers/AlertWrapper/AlertWrapper";
import CardWrapper from "../wrappers/CardWrapper/CardWrapper";
import CreateOrModifyTestScriptCard from "../../../components/CreateOrModifyTestScriptCard";
import AddOrModifyStepsCard from "../../../components/AddOrModifyStepsCard";
import EnterTestScriptNameCard from "../../../components/EnterTestScriptNameCard";
// import { v4 as uuidv4 } from "uuid";
import Axios from "axios";
// import { Beforeunload } from "react-beforeunload";
import "../../../styles/CreateOrModifyNewTestScript.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/AlertComponents.css";
import "../../../styles/Steps.css";

function CreateOrModifyTestScript() {
    const [rendering, setRendering] = useState(true);
    const { pageFunctionality } = useParams();
    const [isValidTestScriptNameEntered, setIsValidTestScriptNameEntered] = useState(false);
    const invalidTestScriptNameError = useValidationErrorUpdate();
    const [isRequestTestScriptButtonDisabled, setIsRequestTestScriptButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [formProps, setFormProps] = useState({
        testScriptName: "",
        testScriptDescription: "",
        testScriptPrimaryWorkstream: "",
        ownerFirstName: "",
        ownerLastName: "",
    });
    // const [testScriptSteps, setTestScriptSteps] = useState([]);
    const testScriptSteps = useRef([{ number: 1, description: "", dataInputtedByUser: "" }]);
    const [numStepsInTestScript, setNumStepsInTestScript] = useState(testScriptSteps.current.length);
    const cardChanged = useRef(false);
    const [cardScrollPosition, setCardScrollPosition] = useState(0);
    const [isUserModifyingSteps, setIsUserModifyingSteps] = useState(false);
    const [isAddOrModifyStepsButtonDisabled, setIsAddOrModifyStepsButtonDisabled] = useState(false);
    // const [isAddStepButtonDisabled, setIsAddStepButtonDisabled] = useState(false);
    const [isRemoveStepButtonDisabled, setIsRemoveStepButtonDisabled] = useState(true);
    const [isSubmitOrModifyButtonDisabled, setIsSubmitOrModifyButtonDisabled] = useState(true);
    const testScriptID = useRef("");
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);
    const async = useRef(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const wordForAlertMessage = useRef(pageFunctionality === "create" ? "submitted" : "updated");
    const alertMessage = useRef(`Test script successfully ${wordForAlertMessage.current}!`);
    const alertType = useRef("success-alert");

    const testScriptNamesAlreadyInDB = useRef([]);
    const isDataBeingFetched = useRef(false);
    const [isStepBeingAddedOrRemoved, setIsStepBeingAddedOrRemoved] = useState(false);
    const [pageContentOpacity, setPageContentOpacity] = useState("100%");
    const isTestScriptSubmitted = useRef(false);
    const wordForWriteErrorMessage = useRef(pageFunctionality === "create" ? "submit" : "update");

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";
    const writeErrorMessage = `Apologies! We've encountered an error. Please attempt to re-${wordForWriteErrorMessage.current} your test script.`;

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
    }, [alertType, rendering, loadErrorMessage, writeErrorMessage]);

    const handleAlertClosed = () => {
        setAlert(false);
        navigate("/");
    }

    // const setIsNewlyAddedToFalseForExistingSteps = useCallback((steps) => {
    //     steps = steps.map(obj => ({ ...obj, isNewlyAdded: false }));
    //     return steps;
    // }, [])

    useEffect(() => {
        const runPrimaryReadAsyncFunctions = async () => {
            isDataBeingFetched.current = true;
            await fetchTestScriptNamesAlreadyInDB();
            // await deleteTestScript("62bdd1bb2e74fb0276522634"); // TODO: here to test deletion functions in server side code
            setRendering(false);
        }

        // const deleteTestScript = async (idOfTestScriptToDelete) => {
        //     if (!async.current) {
        //         try {
        //             async.current = true;
        //             await Axios.delete(`https://test-scripts-app-creator.herokuapp.com/delete-test-script/${idOfTestScriptToDelete}`, {
        //                 timeout: 5000
        //             })
        //                 .then(res => {
        //                     console.log("test script deleted");
        //                     console.log(res);
        //                 });
        //         } catch (e) {
        //             console.log(e);
        //         }
        //     }
        // }

        const fetchTestScriptNamesAlreadyInDB = async () => {
            console.log("fetching existing test script names");
            try {
                async.current = true;
                await Axios.get("https://test-scripts-app-creator.herokuapp.com/get-test-script-names", {
                    timeout: 5000
                })
                    .then(res => {
                        testScriptNamesAlreadyInDB.current = res.data.map(({ name_lowercase }) => name_lowercase);
                        async.current = false;
                        // console.log(testScriptNamesAlreadyInDB.current);
                    });
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        const runSecondaryReadAsyncFunctions = async (testScriptName) => {
            isDataBeingFetched.current = true;
            await fetchTestScriptInformation(testScriptName);
            await fetchTestScriptSteps(testScriptID.current);
            setRendering(false);
        }

        const fetchTestScriptInformation = async (testScriptName) => {
            try {
                async.current = true;
                await Axios.get(`https://test-scripts-app-creator.herokuapp.com/get-test-script/${testScriptName}`, {
                    timeout: 5000
                })
                    .then(res => {
                        populateTestScriptInformation(res.data);
                    })
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        const populateTestScriptInformation = (testScriptInformation) => {
            if (testScriptInformation) {
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
                testScriptID.current = testScriptInformation._id;
                async.current = false;
            } else {
                handleError("r");
            }
        }

        const fetchTestScriptSteps = async (testScriptID) => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get(`https://test-scripts-app-creator.herokuapp.com/get-test-script-steps/${testScriptID}`, {
                        timeout: 5000
                    })
                        .then(res => {
                            // res.data = setIsNewlyAddedToFalseForExistingSteps(res.data);
                            // setTestScriptSteps([...res.data]);
                            testScriptSteps.current = [...res.data];
                            setNumStepsInTestScript(testScriptSteps.current.length);
                            async.current = false;
                        })
                } catch (e) {
                    console.log(e);
                    handleError("r");
                }
            }
        }

        if (rendering) {
            if ((pageFunctionality === "create" && !isDataBeingFetched.current)
                || (pageFunctionality === "modify" && !isValidTestScriptNameEntered && !isDataBeingFetched.current)) {
                runPrimaryReadAsyncFunctions();
            } else if (pageFunctionality === "modify" && isValidTestScriptNameEntered) {
                if (!isUserModifyingSteps && !isDataBeingFetched.current) {
                    runSecondaryReadAsyncFunctions(formProps["testScriptName"]);
                }
            }
            if (cardChanged.current) {
                // setTestScriptSteps(updatedSteps.current);
                cardChanged.current = false;
                setRendering(false);
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            // console.log("updated steps:", updatedSteps.current);
            // console.log(testScriptSteps);
            if (pageFunctionality === "modify" && !isValidTestScriptNameEntered) {
                formProps["testScriptName"].trim().length ? setIsRequestTestScriptButtonDisabled(false) : setIsRequestTestScriptButtonDisabled(true);
            } else if (!isTestScriptSubmitted.current) {
                if (formProps["testScriptName"].trim() !== "" && formProps["testScriptDescription"].trim() !== "" && formProps["testScriptPrimaryWorkstream"].trim() !== ""
                    && formProps["ownerFirstName"].trim() !== "" && formProps["ownerLastName"].trim() !== "") {
                    setIsAddOrModifyStepsButtonDisabled(false);
                    setIsSubmitOrModifyButtonDisabled(false);
                } else {
                    pageFunctionality === "modify" ? setIsAddOrModifyStepsButtonDisabled(false) : setIsAddOrModifyStepsButtonDisabled(true);
                    setIsSubmitOrModifyButtonDisabled(true);
                }
                // testScriptSteps.length && !testScriptSteps.slice(-1)[0]["description"].trim().length
                //     ? setIsAddStepButtonDisabled(true)
                //     : setIsAddStepButtonDisabled(false);
                // testScriptSteps.length === 1
                numStepsInTestScript === 1
                    ? setIsRemoveStepButtonDisabled(true)
                    : setIsRemoveStepButtonDisabled(false);
                // TODO: look into abstracting functions in useEffect hook... can this be done?
            }
        }
    }, [rendering, pageFunctionality, isDataBeingFetched, cardChanged, isUserModifyingSteps, isValidTestScriptNameEntered,
        formProps, /*testScriptSteps.length,*/ testScriptSteps, numStepsInTestScript, /*isAddStepButtonDisabled,*/ isSubmitOrModifyButtonDisabled, isTestScriptSubmitted,
        handleError, /*setIsNewlyAddedToFalseForExistingSteps*/]
    );

    const handleChangeCard = () => {
        setRendering(true);
        cardChanged.current = true;
        if (isUserModifyingSteps) {
            // setTestScriptSteps(prevTestScriptSteps => {
            // let copyOfSteps = [...updatedSteps.current];
            // let properlyFormattedSteps = setIsNewlyAddedToFalseForExistingSteps(copyOfSteps);
            // updatedSteps.current = properlyFormattedSteps;
            // })
            // console.log("updated steps when changing cards:", updatedSteps.current);
            // setTestScriptSteps([...updatedSteps.current]);
            setIsUserModifyingSteps(false);
        } else {
            setIsUserModifyingSteps(true);
        }
    }

    // const handleAddStep = useCallback((stepInfo) => {
    //     setPageContentOpacity("0%");
    //     setTimeout(() => { 
    //         setIsStepBeingAddedOrRemoved(true);
    //         setPageContentOpacity("100%");
    //         const insertedAtIndex = stepInfo["number"];
    //         setTimeout(() => {
    //             addTestScriptStep(insertedAtIndex);
    //             setPageContentOpacity("0%");
    //             setTimeout(() => {
    //                 setIsStepBeingAddedOrRemoved(false);
    //                 setTimeout(() => {
    //                     setPageContentOpacity("100%");
    //                 }, 400);
    //             }, 300);
    //         }, 500);
    //     }, 300);
    //     // // console.log("adding step");
    //     // let stepCount = testScriptSteps.length;
    //     // // let uniqueID = uuidv4();
    //     // let newStep = { number: stepCount + 1, description: "", isNewlyAdded: true };
    //     // let copyOfSteps = [...testScriptSteps];
    //     // copyOfSteps.push(newStep);
    //     // // let tempArray = testScriptSteps;
    //     // // tempArray.push(newStep);
    //     // setTestScriptSteps([...copyOfSteps]);
    //     // updatedSteps.current = copyOfSteps;
    // })

    const handleUpdateStepInfo = useCallback((updateInfo) => {
        // console.log("update info:", updateInfo)
        const stepNumber = updateInfo["number"];
        // const updatedDescription = updateInfo["description"];
        // const updatedDataInputtedByUser = updateInfo["dataInputtedByUser"];
        // setTestScriptSteps(prevTestScriptSteps => {
        //     // if (something === 1) return prevTestScriptSteps - use this if you don't want to re-render a component (will just return original)
        let copyOfSteps = [...testScriptSteps.current];
        let indexOfStepToUpdate = copyOfSteps.findIndex(obj => { // original step
            return obj["number"] === stepNumber
        });
        const originalStep = copyOfSteps[indexOfStepToUpdate];
        const updatedStep = { // new object - no risk of screwing up original object (functional programming - no updating something outside of fcn)
            ...originalStep,
            description: updateInfo["description"] ? updateInfo["description"] : originalStep["description"],
            dataInputtedByUser: updateInfo["dataInputtedByUser"] ? updateInfo["dataInputtedByUser"] : originalStep["dataInputtedByUser"]
        };
        testScriptSteps.current.splice(indexOfStepToUpdate, 1, updatedStep);
        // setTestScriptSteps([...updatedSteps.current]);
        // console.log("inside function:", updatedSteps.current);
        //     copyOfSteps.splice(indexOfStepToUpdate, 1, updatedStep); // updates array in place (doesn't return a new array - code on copy)
        //     return copyOfSteps;
        // });
    }, [])

    // useEffect(() => {
    //     if (testScriptSteps.length) //state
    //         setTestScriptSteps([1]) //setter
    // }, [testScriptSteps])

    const updateStepNumbers = (listOfSteps, newStartingIndex) => {
        // console.log("updating steps:", listOfSteps);
        console.log("updating step numbers");
        for (let i = 0; i < listOfSteps.length; i++) {
            listOfSteps[i]["number"] = newStartingIndex++;
        }
        console.log("step numbers updated");
        return listOfSteps;
    }

    const addTestScriptStep = useCallback((insertedAtStep) => {
        // setTestScriptSteps(prevTestScriptSteps => {
        let copyOfSteps = [...testScriptSteps.current];
        let unchangedSteps = copyOfSteps.slice(0, insertedAtStep);
        // console.log("unchanged steps before:", unchangedSteps);
        let newStep = { number: insertedAtStep + 1, description: "", dataInputtedByUser: "" };
        unchangedSteps.push(newStep);
        // console.log("unchanged steps after:", unchangedSteps);
        let stepsToReturn;
        let stepsToBeUpdated = copyOfSteps.slice(insertedAtStep);
        let stepsWithUpdatedNumbers = updateStepNumbers(stepsToBeUpdated, insertedAtStep + 2);
        stepsToReturn = unchangedSteps.concat(stepsWithUpdatedNumbers);
        testScriptSteps.current = [...stepsToReturn];
        setCardScrollPosition(cardScrollPosition + 480);
        console.log("updated steps after add:", testScriptSteps.current);
        // return stepsToReturn;
        // });
    }, [cardScrollPosition])

    const removeTestScriptStep = useCallback((startingIndex) => {
        // setTestScriptSteps(prevTestScriptSteps => {
        let copyOfSteps = [...testScriptSteps.current];
        let stepsToKeep = copyOfSteps.slice(0, startingIndex - 1);
        let stepsToReturn;
        if (startingIndex < copyOfSteps.length) {
            let stepsToBeUpdated = copyOfSteps.slice(startingIndex);
            let stepsWithUpdatedNumbers = updateStepNumbers(stepsToBeUpdated, startingIndex);
            stepsToReturn = stepsToKeep.concat(stepsWithUpdatedNumbers);
        } else {
            stepsToReturn = stepsToKeep;
        }
        testScriptSteps.current = [...stepsToReturn];
        // return stepsToReturn;
        // });
    }, [])

    const handleAddOrRemoveStep = useCallback((stepInfo, operation) => {
        setPageContentOpacity("0%");
        setTimeout(() => {
            setIsStepBeingAddedOrRemoved(true);
            setPageContentOpacity("100%");
            const stepIndex = stepInfo["number"];
            setTimeout(() => {
                operation === "add" ? addTestScriptStep(stepIndex) : removeTestScriptStep(stepIndex);
                setNumStepsInTestScript(testScriptSteps.current.length);
                setPageContentOpacity("0%");
                setTimeout(() => {
                    setIsStepBeingAddedOrRemoved(false);
                    setPageContentOpacity("100%");
                }, 300);
            }, 300);
        }, 300);
    }, [addTestScriptStep, removeTestScriptStep, setNumStepsInTestScript])

    // const handleRemoveStep = useCallback((stepInfo) => {
    //     setPageContentOpacity("0%");
    //     setTimeout(() => {
    //         setIsStepBeingAddedOrRemoved(true);
    //         setPageContentOpacity("100%");
    //         const indexOfFirstStepToBeUpdated = stepInfo["number"];
    //         setTimeout(() => {
    //             removeTestScriptStep(indexOfFirstStepToBeUpdated);
    //             setPageContentOpacity("0%");
    //             setTimeout(() => {
    //                 setIsStepBeingAddedOrRemoved(false);
    //                 setTimeout(() => {
    //                     setPageContentOpacity("100%");
    //                 }, 400);
    //             }, 300);
    //         }, 500);
    //     }, 300);
    // }, [removeTestScriptStep])

    const handleRequestTestscript = () => {
        if (!isValidTestScriptNameEntered) {
            if (validateTestScriptNameEntered()) {
                setIsValidTestScriptNameEntered(true);
                isDataBeingFetched.current = false;
                setRendering(true);
                setIsSubmitOrModifyButtonDisabled(true);
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

    const handleSubmitOrUpdate = () => {
        isTestScriptSubmitted.current = true;
        setIsSubmitOrModifyButtonDisabled(true);
        setIsAddOrModifyStepsButtonDisabled(true);
        setDisplayFadingBalls(true);
        runWriteAsyncFunctions();
    }

    const runWriteAsyncFunctions = async () => {
        pageFunctionality === "create"
            ? await addTestScriptToDB()
            : await updateTestScriptInDB();
        setAlert(true);
    }

    const addTestScriptToDB = async () => {
        // console.log("adding test script to database");
        // setTestScriptSteps(updatedSteps.current);
        async.current = true;
        try {
            // removeStepsWithoutADescription();
            await Axios.post("https://test-scripts-app-creator.herokuapp.com/add-test-script", {
                testScriptOwner: { firstName: formProps["ownerFirstName"], lastName: formProps["ownerLastName"] },
                testScriptName: formProps["testScriptName"],
                testScriptDescription: formProps["testScriptDescription"],
                testScriptPrimaryWorkstream: formProps["testScriptPrimaryWorkstream"],
                testScriptSteps: testScriptSteps.current
            }, { timeout: 5000 })
                .then(res => {
                    console.log(res);
                    async.current = false;
                })
        } catch (e) {
            console.log(e);
            handleError("w");
        }
    }

    const updateTestScriptInDB = async () => {
        // console.log("updating test script");
        // setTestScriptSteps(updatedSteps.current);
        async.current = true;
        try {
            // removeStepsWithoutADescription();
            await Axios.put("https://test-scripts-app-creator.herokuapp.com/update-test-script", {
                testScriptOwner: { firstName: formProps["ownerFirstName"], lastName: formProps["ownerLastName"] },
                testScriptName: formProps["testScriptName"],
                testScriptDescription: formProps["testScriptDescription"],
                testScriptPrimaryWorkstream: formProps["testScriptPrimaryWorkstream"],
                testScriptSteps: testScriptSteps.current
            }, { timeout: 5000 })
                .then(res => {
                    console.log(res);
                    async.current = false;
                })
        } catch (e) {
            console.log(e);
            handleError("w");
        }
    }

    // const removeStepsWithoutADescription = () => {
    //     if (testScriptSteps.length) {
    //         if (!testScriptSteps.slice(-1)[0]["description"].trim().length) {
    //             testScriptSteps.pop();
    //         }
    //     }
    // }

    return (
        // <Beforeunload onBeforeunload={() => setTestScriptSteps(updatedSteps.current)}>
        <Fragment>
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transitionElementVisibility}>
            </LoadingWrapper>
            < AlertWrapper
                alert={alert}
                alertMessage={alertMessage.current}
                handleAlertClosed={handleAlertClosed}
                alertType={alertType.current}>
            </AlertWrapper>
            {pageFunctionality === "create" || (pageFunctionality === "modify" && isValidTestScriptNameEntered)
                ? <CardWrapper
                    rendering={rendering}
                    alert={alert}
                    isErrorThrown={isErrorThrown}
                    isUserModifyingSteps={isUserModifyingSteps}
                    pageContentOpacity={pageContentOpacity}
                    isStepBeingAddedOrRemoved={isStepBeingAddedOrRemoved}>
                    {isUserModifyingSteps
                        ? <AddOrModifyStepsCard
                            existingSteps={testScriptSteps.current}
                            // isAddStepButtonDisabled={isAddStepButtonDisabled}
                            modifyStepInfo={handleUpdateStepInfo}
                            addOrRemoveStep={handleAddOrRemoveStep}
                            // removeStep={handleAddOrRemoveStep}
                            isRemoveStepButtonDisabled={isRemoveStepButtonDisabled}
                            setCardScrollPosition={setCardScrollPosition}
                            cardScrollPosition={cardScrollPosition}
                            goBack={handleChangeCard}>
                        </AddOrModifyStepsCard>
                        : <CreateOrModifyTestScriptCard
                            setFormProps={setFormProps}
                            isModificationCard={pageFunctionality === "create" ? false : true}
                            existingTestScriptName={formProps["testScriptName"]}
                            invalidTestScriptNames={testScriptNamesAlreadyInDB.current}
                            existingTestScriptDescription={formProps["testScriptDescription"]}
                            existingTestScriptPrimaryWorkstream={formProps["testScriptPrimaryWorkstream"]}
                            existingOwnerFirstName={formProps["ownerFirstName"]}
                            existingOwnerLastName={formProps["ownerLastName"]}
                            handleTransitionToStepsPage={handleChangeCard}
                            isAddOrModifyStepsButtonDisabled={isAddOrModifyStepsButtonDisabled}
                            submitOrModifyTestScript={handleSubmitOrUpdate}
                            isSubmitOrModifyButtonDisabled={isSubmitOrModifyButtonDisabled}
                            isCancelButtonDisabled={async.current}
                            testScriptSteps={testScriptSteps.current}
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
                                        isSubmitButtonDisabled={isRequestTestScriptButtonDisabled}>
                                    </EnterTestScriptNameCard>
                                </div>
                            </div>
                        </div>}
                </Fragment>
            }
        </Fragment >
        // </Beforeunload>
    )
};

export default CreateOrModifyTestScript;

