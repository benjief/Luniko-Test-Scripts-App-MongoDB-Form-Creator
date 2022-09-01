import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useValidationErrorUpdate } from "../Context/ValidationErrorContext";
import { useNavigate, useParams } from "react-router-dom";
import LoadingWrapper from "../wrappers/LoadingWrapper/LoadingWrapper";
import AlertWrapper from "../wrappers/AlertWrapper/AlertWrapper";
import CardWrapper from "../wrappers/CardWrapper/CardWrapper";
import CreateOrModifyTestScriptCard from "../../../components/CreateOrModifyTestScriptCard";
import AddOrModifyStepsCard from "../../../components/AddOrModifyStepsCard";
import EnterTestScriptNameCard from "../../../components/EnterTestScriptNameCard";
import Axios from "axios";
import "../../../styles/CreateOrModifyTestScript.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/AlertComponents.css";
import "../../../styles/Steps.css";

/**
 * This page allows users to create or modify test scripts. Test script names must be different than any other test script name already written to the database.
 * @returns a page housing all of the components needed to implement the above functionality.
 */
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
    const testScriptSteps = useRef([{ number: 1, description: "", dataInputtedByUser: "" }]);
    const [numStepsInTestScript, setNumStepsInTestScript] = useState(testScriptSteps.current.length);
    const cardChanged = useRef(false);
    const [cardScrollPosition, setCardScrollPosition] = useState(0);
    const [isUserModifyingSteps, setIsUserModifyingSteps] = useState(false);
    const [isAddOrModifyStepsButtonDisabled, setIsAddOrModifyStepsButtonDisabled] = useState(false);
    const [isRemoveStepButtonDisabled, setIsRemoveStepButtonDisabled] = useState(true);
    const [isSubmitOrUpdateButtonDisabled, setIsSubmitOrUpdateButtonDisabled] = useState(true);
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

    /**
     * Displays an alert with the correct type of error. 
     * @param {string} errorType 
     */
    const handleError = useCallback((errorType) => {
        setIsErrorThrown(true);
        alertType.current = "error-alert";
        errorType === "r"
            ? alertMessage.current = loadErrorMessage // read error message
            : alertMessage.current = writeErrorMessage; // write error message

        if (rendering) {
            setRendering(false);
        }

        setAlert(true);

    }, [setIsErrorThrown, rendering, writeErrorMessage]);

    /**
     * Closes an alert that is on display and redirects the user to the app homepage.
     */
    const handleAlertClosed = () => {
        setAlert(false);
        navigate("/");
    }

    useEffect(() => {
        /**
         * Calls functions that gather information required for the initial page load. Once all required information is gathered, rendering is set to false and the page is displayed.
         */
        const runPrimaryReadAsyncFunctions = async () => {
            isDataBeingFetched.current = true;
            await fetchTestScriptNamesAlreadyInDB();
            setRendering(false);
        }

        /**
         * Fetches test script names that are already stored in the database and writes them to testScriptNamesAlreadyInDB.
         */
        const fetchTestScriptNamesAlreadyInDB = async () => { // TODO: abstract this function
            try {
                async.current = true;
                await Axios.get("https://test-scripts-app-creator.herokuapp.com/get-test-script-names", {
                    timeout: 5000
                })
                    .then(res => {
                        testScriptNamesAlreadyInDB.current = res.data.map(({ name_lowercase }) => name_lowercase);
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        /**
         * Calls functions that fetch and write information required for displaying a previously-submitted test script.
         * @param {string} testScriptName - the test script name corresponding to the test script for which information is being fetched.
         */
        const runSecondaryReadAsyncFunctions = async (testScriptName) => {
            isDataBeingFetched.current = true;
            await fetchTestScriptInformation(testScriptName);
            await fetchAndWriteTestScriptSteps(testScriptID.current);
            setRendering(false);
        }

        /**
         * Fetches test script information from the database.
         * @param {string} testScriptName - the test script name corresponding to the test script for which information is being fetched.
         */
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

        /**
         * Writes test script information to formProps, in addition to writing the loaded test script's ID to the testScriptID prop.
         * @param {object} testScriptInformation - test script information object returned by Axios from the database.
         */
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

        /**
         * Fetches steps associated with the currently-loaded test script from the database and writes them to testScriptSteps. numStepsInTestScript is then set to the number of steps fetched.
         * @param {string} testScriptID - ID of the currently-loaded test script.
         */
        const fetchAndWriteTestScriptSteps = async (testScriptID) => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get(`https://test-scripts-app-creator.herokuapp.com/get-test-script-steps/${testScriptID}`, {
                        timeout: 5000
                    })
                        .then(res => {
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
            // runs fetch/write functions, depending on the page's state
            if ((pageFunctionality === "create" && !isDataBeingFetched.current)
                || (pageFunctionality === "modify" && !isValidTestScriptNameEntered && !isDataBeingFetched.current)) {
                runPrimaryReadAsyncFunctions();
            } else if (pageFunctionality === "modify" && isValidTestScriptNameEntered) {
                if (!isUserModifyingSteps && !isDataBeingFetched.current) {
                    runSecondaryReadAsyncFunctions(formProps["testScriptName"]);
                }
            }
            if (cardChanged.current) {
                cardChanged.current = false;
                setRendering(false);
            }
        } else {
            // makes page visible
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (pageFunctionality === "modify" && !isValidTestScriptNameEntered) {
                formProps["testScriptName"].trim().length ? setIsRequestTestScriptButtonDisabled(false) : setIsRequestTestScriptButtonDisabled(true);
            } else if (!isTestScriptSubmitted.current) {
                if (formProps["testScriptName"].trim() !== "" && formProps["testScriptDescription"].trim() !== "" && formProps["testScriptPrimaryWorkstream"].trim() !== ""
                    && formProps["ownerFirstName"].trim() !== "" && formProps["ownerLastName"].trim() !== "") {
                    setIsAddOrModifyStepsButtonDisabled(false);
                    setIsSubmitOrUpdateButtonDisabled(false);
                } else {
                    pageFunctionality === "modify" ? setIsAddOrModifyStepsButtonDisabled(false) : setIsAddOrModifyStepsButtonDisabled(true);
                    setIsSubmitOrUpdateButtonDisabled(true);
                }
                numStepsInTestScript === 1
                    ? setIsRemoveStepButtonDisabled(true)
                    : setIsRemoveStepButtonDisabled(false);
            }
        }
    }, [rendering, pageFunctionality, isDataBeingFetched, cardChanged, isUserModifyingSteps, isValidTestScriptNameEntered,
        formProps, testScriptSteps, numStepsInTestScript, isSubmitOrUpdateButtonDisabled, isTestScriptSubmitted, handleError]
    );

    /**
     * Handles the card change when a user flips back and forth between manipulating steps and other test script information. A brief period of rendering is forced in between each card to make the application appear more consistent.
     */
    const handleChangeCard = () => {
        setRendering(true);
        cardChanged.current = true;
        if (isUserModifyingSteps) {
            setIsUserModifyingSteps(false);
        } else {
            setIsUserModifyingSteps(true);
        }
    }

    /**
     * Updates step information when the user changes said step's properties (namely, its "Description" or "Data Inputted by User" fields).
     * @param {object} updateInfo - object containing the step's updated information. Only one field can be updated at a time, and so only that field is present in this object (that comes the MaterialTextField.js component via AddOrModifyStepsCard.js).
     */
    const handleUpdateStepInfo = useCallback((updateInfo) => {
        // console.log("update info:", updateInfo)
        const stepNumber = updateInfo["number"];
        let copyOfSteps = [...testScriptSteps.current];
        let indexOfStepToUpdate = copyOfSteps.findIndex(obj => { // original step
            return obj["number"] === stepNumber
        });
        const originalStep = copyOfSteps[indexOfStepToUpdate];
        const updatedStep = { // new object - no risk of messing up original object (functional programming - no updating something outside of function)
            ...originalStep,
            description: updateInfo["description"] ? updateInfo["description"] : originalStep["description"],
            dataInputtedByUser: updateInfo["dataInputtedByUser"] ? updateInfo["dataInputtedByUser"] : originalStep["dataInputtedByUser"]
        };
        testScriptSteps.current.splice(indexOfStepToUpdate, 1, updatedStep);
    }, [])

    /**
     * Updates step numbers for a test script's steps when a step is added or removed.
     * @param {array} listOfSteps - the array of steps for which step numbers need to be updated.
     * @param {*} newStartingIndex - the index at which the set of steps should start after the function has run. This increases by one after each iteration of the for loop.
     * @returns the list of steps with updated step numbers.
     */
    const updateStepNumbers = (listOfSteps, newStartingIndex) => {
        console.log("updating step numbers");
        for (let i = 0; i < listOfSteps.length; i++) {
            listOfSteps[i]["number"] = newStartingIndex++;
        }
        console.log("step numbers updated");
        return listOfSteps;
    }

    /**
     * Adds a new step to the test script's collection of steps. Note that the page's vertical scroll position is modified after the addition of a new step.
     * @param {number} insertedAtStep - the step number after which the new step is to be inserted.
     */
    const addTestScriptStep = useCallback((insertedAtStep) => {
        let copyOfSteps = [...testScriptSteps.current];
        let unchangedSteps = copyOfSteps.slice(0, insertedAtStep);
        let newStep = { number: insertedAtStep + 1, description: "", dataInputtedByUser: "" };
        unchangedSteps.push(newStep);
        let stepsToReturn;
        let stepsToBeUpdated = copyOfSteps.slice(insertedAtStep);
        let stepsWithUpdatedNumbers = updateStepNumbers(stepsToBeUpdated, insertedAtStep + 2);
        stepsToReturn = unchangedSteps.concat(stepsWithUpdatedNumbers);
        testScriptSteps.current = [...stepsToReturn];
        setCardScrollPosition(cardScrollPosition + 480);
        // console.log("updated steps after add:", testScriptSteps.current);
    }, [cardScrollPosition])

    /**
     *
     * Removes a step from the test script's collection of steps. Note that the page's vertical scroll position is modified after the removal of a step.
     * @param {number} startingIndex - the index of the step after the step being removed.
     */
    const removeTestScriptStep = useCallback((startingIndex) => {
        let copyOfSteps = [...testScriptSteps.current];
        let stepsToKeep = copyOfSteps.slice(0, startingIndex - 1); // steps before the step to be removed should remain untouched
        let stepsToReturn;
        if (startingIndex < copyOfSteps.length) {
            let stepsToBeUpdated = copyOfSteps.slice(startingIndex);
            let stepsWithUpdatedNumbers = updateStepNumbers(stepsToBeUpdated, startingIndex);
            stepsToReturn = stepsToKeep.concat(stepsWithUpdatedNumbers);
        } else {
            stepsToReturn = stepsToKeep;
        }
        testScriptSteps.current = [...stepsToReturn];
    }, [])

    /**
     * This function is mostly here to animate a loading screen when a step is being added or removed. It is quite convoluted, but I haven't yet thought of a better way to handle this. However, it is also responsible for coordinating the calling of the specific add/remove step functions (above) with the correct indices.
     * @param {object} stepInfo - object containing step information for the step to be removed, or the step before the step to be added (since the step to be added doesn't yet exist).
     * @param {string} operation - "add" or "remove" depending on what operation is to be carried out by this function.
     */
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

    /**
     * When the user requests a test script name that has previously been written to the database, that test script name is validated (through a call to validateTestScriptNameEntered). If the test script name entered is indeed valid, setValidTestScriptName is set to true, as is rendering, and the "request test script" button is disabled. Then, the useEffect hook carries out secondary read async functions to fetch/write all of the necessary test script information to the page. If the test script name entered isn't valid, an error message is displayed.
     */
    const handleRequestTestscript = () => {
        if (!isValidTestScriptNameEntered) {
            if (validateTestScriptNameEntered()) {
                setIsValidTestScriptNameEntered(true);
                isDataBeingFetched.current = false;
                setRendering(true);
                setIsRequestTestScriptButtonDisabled(true);
            } else {
                invalidTestScriptNameError("Invalid test script name");
            }
        }
    }

    // adapted from https://stackoverflow.com/questions/60440139/check-if-a-string-contains-exact-match
    /**
     * Compares the test script name entered by the user to test script names obtained by the page's primary read functions. If the entered test script name is matched against the set of valid test script names, the function returns true. If not, it returns false.
     * @returns true if the entered test script name is matched against the set of valid test script names, false otherwise.
     */
    const validateTestScriptNameEntered = () => { // TODO: abstract this function
        for (let i = 0; i < testScriptNamesAlreadyInDB.current.length; i++) {
            let escapeRegExpMatch = formProps["testScriptName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(testScriptNamesAlreadyInDB.current[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * When the user clicks on the submit (or update) button, the isTestScriptSubmitted prop is set to true, and said button is disabled (to prevent multiple submission clicks). A set of fading balls is then displayed (to indicate that the page is working on a request), and the page's write functions are triggered through runWriteAysncFunctions.
     */
    const handleSubmitOrUpdate = () => {
        isTestScriptSubmitted.current = true;
        setIsSubmitOrUpdateButtonDisabled(true);
        setIsAddOrModifyStepsButtonDisabled(true);
        setDisplayFadingBalls(true);
        runWriteAsyncFunctions();
    }

    /**
     * Runs functions that either write a new test script to the database, or update an existing test script (if the user is updating an already-existing test script). An alert is displayed once all of the called functions have run.
     */
    const runWriteAsyncFunctions = async () => {
        pageFunctionality === "create"
            ? await addTestScriptToDB()
            : await updateTestScriptInDB();
        setAlert(true);
    }

    /**
     * Creates a new record by writing submitted test script information to the database.
     */
    const addTestScriptToDB = async () => {
        async.current = true;
        try {
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

    /**
     * Updates a test script record in the database with newly-submitted information. Note that all information is overwritten, even if a particular field hasn't actually been changed.
     */
    const updateTestScriptInDB = async () => {
        async.current = true;
        try {
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

    return (
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
                            modifyStepInfo={handleUpdateStepInfo}
                            addOrRemoveStep={handleAddOrRemoveStep}
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
                            submitOrUpdateTestScript={handleSubmitOrUpdate}
                            isSubmitOrUpdateButtonDisabled={isSubmitOrUpdateButtonDisabled}
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
                </Fragment>}
        </Fragment >
        // </Beforeunload>
    )
};

export default CreateOrModifyTestScript;
