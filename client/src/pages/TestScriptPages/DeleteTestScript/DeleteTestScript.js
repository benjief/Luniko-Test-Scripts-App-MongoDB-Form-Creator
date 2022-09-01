import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useValidationErrorUpdate } from "../Context/ValidationErrorContext";
import Axios from "axios";
import LoadingWrapper from "../wrappers/LoadingWrapper";
import AlertWrapper from "../wrappers/AlertWrapper";
import CardWrapper from "../wrappers/CardWrapper";
import EnterTestScriptNameCard from "../../../components/EnterTestScriptNameCard"
import "../../../styles/DeleteTestScript.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/AlertComponents.css";

/**
 * This page allows users to delete test scripts from the database. Doing so will also delete any associated steps and testing sessions. Images in Google Firebase Cloud Storage that are attached to any of the testing sessions being deleted will also be removed.
 * @returns a page housing all of the components needed to implement the above functionality.
 */
function DeleteTestScript() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const invalidTestScriptNameError = useValidationErrorUpdate();
    const [isDeleteTestScriptButtonDisabled, setIsDeleteTestScriptButtonDisabled] = useState(true);
    const [formProps, setFormProps] = useState({
        testScriptName: "",
    });
    const [isValidTestScriptNameEntered, setIsValidTestScriptNameEntered] = useState(false);
    const testScriptID = useRef("");
    const testingSessions = useRef([]);
    // const [testingSessions, setTestingSessions] = useState([]);
    const async = useRef(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const alertMessage = useRef("Test script successfully deleted!");
    const alertType = useRef("success-alert");
    const testScriptNamesAlreadyInDB = useRef([]);
    const isDataBeingFetched = useRef(false);
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";
    const deleteErrorMessage = "Apologies! We were unable to remove the requested test script. Please try again.";

    const navigate = useNavigate();

    /**
     * Displays an alert with the correct type of error. 
     * @param {string} errorType  
     */
    const handleError = useCallback((errorType) => {
        setIsErrorThrown(true);
        alertType.current = "error-alert";
        errorType === "r"
            ? alertMessage.current = loadErrorMessage
            : alertMessage.current = deleteErrorMessage;

        if (rendering) {
            setRendering(false);
        }

        setAlert(true);
    }, [alertType, rendering]);

    /**
     * Closes an alert that is on display and redirects the user to the app homepage.
     */
    const handleAlertClosed = () => {
        console.log("closing alert");
        navigate("/");
        setIsErrorThrown(false); // TODO: test this... is it needed anymore?
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

        if (rendering) {
            // runs fetch/write functions, depending on the page's state
            if (!isValidTestScriptNameEntered && !isDataBeingFetched.current) {
                runPrimaryReadAsyncFunctions();
            }
        } else {
            // makes page visible
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!isValidTestScriptNameEntered) {
                formProps["testScriptName"].trim().length ? setIsDeleteTestScriptButtonDisabled(false) : setIsDeleteTestScriptButtonDisabled(true);
            }
        }
    }, [rendering, isDataBeingFetched, formProps, isValidTestScriptNameEntered, testScriptID, handleError]);

    /**
     * When the user requests to delete a test script that has previously been written to the database, that test script's name is validated (through a call to validateTestScriptNameEntered). If the test script name entered is indeed valid, setValidTestScriptName is set to true, and functions are called to delete the test script and its associated testing sessions, before a successful deletion alert is displayed. If the test script name entered isn't valid, an error message is displayed.
     */
    const handleDeleteTestScript = async () => {
        if (!isValidTestScriptNameEntered) {
            if (validateTestScriptNameEntered()) {
                setIsValidTestScriptNameEntered(true);
                isDataBeingFetched.current = false;
                setIsDeleteTestScriptButtonDisabled(true);
                setDisplayFadingBalls(true);
                await runSecondaryReadAsyncFunctions(formProps["testScriptName"]);
                for (let i = 0; i < testingSessions.current.length; i++) {
                    await deleteTestingSession(testingSessions.current[i]._id);
                }
                await deleteTestScript(testScriptID.current);
                setAlert(true);
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
     * Calls functions that fetch and write information required for deleting a test script from the database. 
     * @param {string} testScriptName - the test script name corresponding to the test script being deleted.
     */
    const runSecondaryReadAsyncFunctions = async (testScriptName) => {
        isDataBeingFetched.current = true;
        await fetchAndWriteTestScriptID(testScriptName);
        await fetchAndWriteTestScriptTestingSessions();
    }

    /**
     * Fetches the ID of the test script to be deleted and writes it to testScriptID.
     * @param {string} testScriptName - the test script name corresponding to the test script being deleted.
     */
    const fetchAndWriteTestScriptID = async (testScriptName) => {
        try {
            async.current = true;
            await Axios.get(`https://test-scripts-app-creator.herokuapp.com/get-test-script/${testScriptName}`, {
                timeout: 5000
            })
                .then(res => {
                    testScriptID.current = res.data._id;
                    async.current = false;
                })
        } catch (e) {
            console.log(e);
            handleError("r");
        }
    }

    /**
     * Fetches testing sessions attached to the test script to be deleted (using its previously-fetched and written ID) and writes them to testingSessions.
     */
    const fetchAndWriteTestScriptTestingSessions = async () => {
        try {
            async.current = true;
            await Axios.get(`https://test-scripts-app-creator.herokuapp.com/get-test-script-testing-sessions/${testScriptID.current}`, {
                timeout: 5000
            })
                .then(res => {
                    testingSessions.current = res.data;
                    async.current = false;
                })
        } catch (e) {
            console.log(e);
            handleError("r");
        }
    }

    /**
     * Deletes the specified testing session from the database.
     * @param {string} testingSessionID - ID of the testing session to be deleted.
     */
    const deleteTestingSession = async (testingSessionID) => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.delete(`https://test-scripts-app-creator.herokuapp.com/delete-testing-session/${testingSessionID}`, {
                    timeout: 5000
                })
                    .then(res => {
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
                handleError("d");
            }
        }
    }

    /**
     * Deletes the test script specified by the user from the database.
     */
    const deleteTestScript = async () => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.delete(`https://test-scripts-app-creator.herokuapp.com/delete-test-script/${testScriptID.current}`, {
                    timeout: 5000
                })
                    .then(res => {
                        console.log(res);
                        async.current = false;
                    })
            } catch (e) {
                console.log(e);
                handleError("d");
            }
        }
    }

    return (
        <Fragment>
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transtitionElementVisibility}>
            </LoadingWrapper>
            <AlertWrapper
                alert={alert}
                alertMessage={alertMessage.current}
                handleAlertClosed={handleAlertClosed}
                alertType={alertType.current}> {/* TODO: change alertType hook to useState? */}
            </AlertWrapper>
            <CardWrapper
                rendering={rendering}
                alert={alert}
                isErrorThrown={isErrorThrown}
                isUserDeletingTestScript={true}>
                <EnterTestScriptNameCard
                    setFormProps={setFormProps}
                    requestTestScript={handleDeleteTestScript}
                    isSubmitButtonDisabled={isDeleteTestScriptButtonDisabled}
                    isDeletionForm={true}
                    displayFadingBalls={displayFadingBalls}>
                </EnterTestScriptNameCard>
            </CardWrapper>
        </Fragment >
    )
};

export default DeleteTestScript;
