import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useValidationErrorUpdate } from "../Context/ValidationErrorContext";
import Axios from "axios";
import LoadingWrapper from "../wrappers/LoadingWrapper";
import AlertWrapper from "../wrappers/AlertWrapper";
import CardWrapper from "../wrappers/CardWrapper";
import EnterTestScriptNameCard from "../../../components/EnterTestScriptNameCard"
import ViewTestingSessionsCard from "../../../components/ViewTestingSessionsCard";
import "../../../styles/RetrieveTestScriptResults.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/AlertComponents.css";
import "../../../styles/DialogComponents.css";

/**
 * This page allows users to view details pertaining to all of the testing sessions submitted for a test script stored in the database. If no testing sessions have yet been submitted for a particular test script, a message stating this will be displayed before the user is redirected back to the application landing page.
 * @returns a page housing all of the components needed to implement the above functionality.
 */
function RetrieveTestScriptTestingSessions() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const invalidTestScriptNameError = useValidationErrorUpdate();
    const [isRequestTestScriptButtonDisabled, setIsRequestTestScriptButtonDisabled] = useState(true);
    const [formProps, setFormProps] = useState({
        testScriptName: "",
    });
    const [isValidTestScriptNameEntered, setIsValidTestScriptNameEntered] = useState(false);
    const [cardScrollPosition, setCardScrollPosition] = useState(0);
    const testScriptID = useRef("");
    const testingSessions = useRef([]);
    const [numTestingSessions, setNumTestingSessions] = useState(testingSessions.current.length);
    const async = useRef(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const alertMessage = useRef("alert message placeholder");
    const alertType = useRef("error-alert");
    const testScriptNamesAlreadyInDB = useRef([]);
    const isDataBeingFetched = useRef(false);
    const [pageMessageOpacity, setPageMessageOpacity] = useState("100%");
    const [pageContentOpacity, setPageContentOpacity] = useState("100%");

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";
    const deleteErrorMessage = "Apologies! We were unable to remove the requested testing session. Please try again.";

    const navigate = useNavigate();

    /**
     * Displays an alert with the correct type of error. 
     * @param {string} errorType 
     */
    const handleError = useCallback((errorType) => {
        setIsErrorThrown(true);
        alertMessage.current = loadErrorMessage;
        errorType === "r"
            ? alertMessage.current = loadErrorMessage // read error message
            : alertMessage.current = deleteErrorMessage; // deletion error message

        if (rendering) {
            setRendering(false);
        }

        setAlert(true);
    }, [rendering]);

    const handleAlertClosed = () => {
        console.log("closing alert");
        navigate("/");
        setIsErrorThrown(false);
    }

    useEffect(() => {
        /**
         * Calls functions that gather information required for the initial page load. Once all required information is gathered, rendering is set to false and the page is displayed.
         */
        const runPrimaryReadAsyncFunctions = async () => {
            isDataBeingFetched.current = true;
            await fetchAndWriteTestScriptNamesAlreadyInDB();
            setRendering(false);
        }

        /**
         * Fetches test script names that are already stored in the database and writes them to testScriptNamesAlreadyInDB.
         */
        const fetchAndWriteTestScriptNamesAlreadyInDB = async () => { // TODO: abstract this function
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
         * Calls functions that fetch and write information required for displaying testing sessions associated with a test script.
         * @param {string} testScriptName - the test script name corresponding to the test script for which testing session information is being fetched.
         */
        const runSecondaryReadAsyncFunctions = async (testScriptName) => {
            isDataBeingFetched.current = true;
            await fetchAndWriteTestScriptNameAndID(testScriptName);
            await fetchAndWriteTestScriptTestingSessions();
            setRendering(false);
        }

        /**
         * Fetches the ID and properly-capitalized name of the test script for which testing session information is being retrieved and writes it to testScriptID. Test scripts are stored in the database with a lowercase name attribute and a properly-capitalized name attribute ("properly capitalized" meaning exactly how the user entered the name).
         * @param {string} testScriptName - the (all lowercase) test script name corresponding to the test script for which testing session information is being retrieved.
         */
        const fetchAndWriteTestScriptNameAndID = async (testScriptName) => {
            try {
                async.current = true;
                await Axios.get(`https://test-scripts-app-creator.herokuapp.com/get-test-script/${testScriptName}`, {
                    timeout: 5000
                })
                    .then(res => {
                        setFormProps(
                            prev => ({
                                ...prev,
                                "testScriptName": res.data.name
                            })
                        );
                        testScriptID.current = res.data._id;
                    })
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        /**
         * Fetches testing sessions associated with the currently-loaded test script from the database and writes them to testingSessions. numTestingSessions is then set to the number of sessions fetched. This prop is used to determine when to redirect the user back to the application landing page (i.e. if no testing sessions are available to view for a particular test script).
         * @param {string} testScriptID - ID of the currently-loaded test script.
         */
        const fetchAndWriteTestScriptTestingSessions = async () => {
            try {
                async.current = true;
                await Axios.get(`https://test-scripts-app-creator.herokuapp.com/get-test-script-testing-sessions/${testScriptID.current}`, {
                    timeout: 5000
                })
                    .then(res => {
                        async.current = false;
                        testingSessions.current = [...res.data];
                        setNumTestingSessions(testingSessions.current.length);
                    })
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        if (rendering) {
            // runs fetch/write functions, depending on the page's state
            if (!isValidTestScriptNameEntered && !isDataBeingFetched.current) {
                runPrimaryReadAsyncFunctions();
            } else if (isValidTestScriptNameEntered) {
                if (!isDataBeingFetched.current) {
                    runSecondaryReadAsyncFunctions(formProps["testScriptName"]);
                }
            }
        } else {
            // makes page visible
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!isValidTestScriptNameEntered) {
                formProps["testScriptName"].trim().length ? setIsRequestTestScriptButtonDisabled(false) : setIsRequestTestScriptButtonDisabled(true);
            }
            if (testScriptID.current.length && !numTestingSessions) {
                setTimeout(() => {
                    navigate("/");
                }, 1000)
            }
        }
    }, [rendering, isDataBeingFetched, formProps, isValidTestScriptNameEntered, testScriptID, numTestingSessions, navigate, handleError]);

    /**
     * When the user requests a test script name that has previously been written to the database, that test script name is validated (through a call to validateTestScriptNameEntered). If the test script name entered is indeed valid, isValidTestScriptNameEntered is set to true, as is rendering, and the "request test script" button is disabled. Then, the useEffect hook carries out secondary read async functions to fetch/write all of the necessary testing session information to the page. If the test script name entered isn't valid, an error message is displayed.
     */
    const handleRequestTestScript = () => {
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
     * Deletes the specified testing session from the database. A series of timeouts are set to animate a loading screen when a testing session is being removed. A call to updateTestingSessionsAfterRemoval is made once a testing session has been deleted.
     * @param {string} testingSessionID - ID of the testing session to be deleted.
     */
    const deleteTestingSession = (testingSessionID) => {
        if (!async.current) {
            try {
                setPageContentOpacity("0%");
                setTimeout(async () => {
                    async.current = true;
                    setPageContentOpacity("100%");
                    await Axios.delete(`https://test-scripts-app-creator.herokuapp.com/delete-testing-session/${testingSessionID}`, {
                        timeout: 5000
                    })
                        .then(res => {
                            updateTestingSessionsAfterRemoval(testingSessionID);
                        })
                        .catch(e => {
                            console.log("error caught:", e)
                            handleError("d");
                        });
                    // updateTestingSessionsAfterRemoval(testingSessionID);
                }, 300);
            } catch (e) {
                console.log(e);
                handleError("d");
            }
        }
    }

    /**
     * Removes a testing session from the testingSessions array.
     * @param {string} testingSessionID - ID of the testing session to be removed from the testingSessions array.
     */
    const filterTestingSessions = (testingSessionID) => {
        let copyOfTestingSessions = testingSessions.current.filter((val) => {
            return val._id !== testingSessionID;
        });
        testingSessions.current = copyOfTestingSessions;
        setNumTestingSessions(testingSessions.current.length);
    }

    /**
     * Coordinates removal of the deleted testing session with an animated message housed at the top of the page. If no more testing sessions are available to view for the currently-loaded test script (i.e. the user has deleted all of them), a message is displayed informing the user of this, and they are redirected back to the application landing page. This function is responsible for fading the page message in and out at intervals that make the transition look somewhat presentable.
     * @param {string} testingSessionID - ID of the testing session that has been deleted from the database (through a previous call to deleteTestingSession).
     */
    const updateTestingSessionsAfterRemoval = useCallback((testingSessionID) => {
        setTimeout(() => {
            setPageContentOpacity("0%");
            if (numTestingSessions <= 1) {
                setPageMessageOpacity("0%");
                setTimeout(() => {
                    filterTestingSessions(testingSessionID);
                }, 300);
                setTimeout(() => {
                    setPageMessageOpacity("100%");
                }, 300);
            } else {
                filterTestingSessions(testingSessionID);
            }
            setTimeout(() => {
                async.current = false;
                setPageContentOpacity("100%");
            }, 300);
        }, 500);
    }, [numTestingSessions])

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
            {isValidTestScriptNameEntered
                ? <CardWrapper
                    rendering={rendering}
                    isErrorThrown={isErrorThrown}
                    isUserRetrievingTestingSessions={true}
                    doTestingSessionsExist={numTestingSessions ? true : false}
                    pageMessageOpacity={pageMessageOpacity}
                    pageContentOpacity={pageContentOpacity}
                    testScriptName={formProps["testScriptName"]}
                    isTestingSessionBeingDeleted={async.current}>
                    {numTestingSessions
                        ? <ViewTestingSessionsCard
                            testingSessions={testingSessions.current}
                            async={async.current}
                            deleteTestingSession={deleteTestingSession}
                            setCardScrollPosition={setCardScrollPosition}
                            cardScrollPosition={cardScrollPosition}
                        >
                        </ViewTestingSessionsCard>
                        : <div></div>}
                </CardWrapper >
                : <div className="enter-valid-test-script-name">
                    <div className="enter-valid-test-script-name-container">
                        <div className="page-message">
                            Retrieve Your Test Script Below:
                        </div>
                        <div className="enter-valid-test-script-name-card">
                            <EnterTestScriptNameCard
                                setFormProps={setFormProps}
                                requestTestScript={handleRequestTestScript}
                                isSubmitButtonDisabled={isRequestTestScriptButtonDisabled}>
                            </EnterTestScriptNameCard>
                        </div>
                    </div>
                </div>
            }
        </Fragment >
    )
};

export default RetrieveTestScriptTestingSessions;
