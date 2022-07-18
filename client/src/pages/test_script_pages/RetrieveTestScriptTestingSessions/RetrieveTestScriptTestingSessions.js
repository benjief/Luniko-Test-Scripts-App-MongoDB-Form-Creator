import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useValidationErrorUpdate } from "../Context/ValidationErrorContext";
import Axios from "axios";
import LoadingWrapper from "../wrappers/LoadingWrapper";
import ErrorWrapper from "../wrappers/ErrorWrapper";
import CardWrapper from "../wrappers/CardWrapper";
import EnterTestScriptNameCard from "../../../components/EnterTestScriptNameCard"
import TestingSessionCard from "../../../components/TestingSessionCard";
import "../../../styles/RetrieveTestScriptResults.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/AlertComponents.css";
import "../../../styles/DialogComponents.css";

function RetrieveTestScriptTestingSessions() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const invalidTestScriptNameError = useValidationErrorUpdate();
    const [isRequestTestScriptButtonDisabled, setIsRequestTestScriptButtonDisabled] = useState(true);
    const [formProps, setFormProps] = useState({ // TODO: rename this so you can actually use it here without it looking weird (e.g. testScriptProps)
        testScriptName: "",
    });
    const [isValidTestScriptNameEntered, setIsValidTestScriptNameEntered] = useState(false);
    const testScriptID = useRef("");
    const [testingSessions, setTestingSessions] = useState([]);
    const async = useRef(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const alertMessage = useRef("Test script results successfully submitted!");
    const alertType = useRef("success-alert");
    const testScriptNamesAlreadyInDB = useRef([]);
    const isDataBeingFetched = useRef(false);
    const [pageMessageOpacity, setPageMessageOpacity] = useState("100%");

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";

    const handleError = useCallback(() => {
        setIsErrorThrown(true);
        alertType.current = "error-alert";
        alertMessage.current = loadErrorMessage;

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

    const handleAlertClosed = () => {
        console.log("closing alert");
        window.location.reload();
        setIsErrorThrown(false); // TODO: test this... is it needed anymore?
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
                    timeout: 5000
                })
                    .then(res => {
                        testScriptNamesAlreadyInDB.current = res.data.map(({ name }) => name);
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
                handleError();
            }
        }

        const runSecondaryReadAsyncFunctions = async (testScriptName) => {
            isDataBeingFetched.current = true;
            await fetchTestScriptID(testScriptName);
            await fetchTestScriptTestingSessions();
            setRendering(false);
        }

        const fetchTestScriptID = async (testScriptName) => {
            try {
                async.current = true;
                await Axios.get(`http://localhost:5000/get-test-script/${testScriptName}`, {
                    timeout: 5000
                })
                    .then(res => {
                        testScriptID.current = res.data._id;
                    })
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        const fetchTestScriptTestingSessions = async () => {
            try {
                async.current = true;
                await Axios.get(`http://localhost:5000/get-test-script-testing-sessions/${testScriptID.current}`, {
                    timeout: 5000
                })
                    .then(res => {
                        // console.log(res.data);
                        async.current = false;
                        setTestingSessions(res.data);
                    })
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        if (rendering) {
            if (!isValidTestScriptNameEntered && !isDataBeingFetched.current) {
                runPrimaryReadAsyncFunctions();
            } else if (isValidTestScriptNameEntered) {
                if (!isDataBeingFetched.current) {
                    runSecondaryReadAsyncFunctions(formProps["testScriptName"]);
                }
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!isValidTestScriptNameEntered) {
                formProps["testScriptName"].trim().length ? setIsRequestTestScriptButtonDisabled(false) : setIsRequestTestScriptButtonDisabled(true);
            }
            if (testScriptID.current.length && !testingSessions.length) {
                setTimeout(() => {
                    window.location.reload();
                }, 3000)
            }
        }
    }, [rendering, isDataBeingFetched, formProps, isValidTestScriptNameEntered, testScriptID, testingSessions.length, handleError]);

    const handleRequestTestScript = () => { // TODO: make this more direct
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
    const validateTestScriptNameEntered = () => {
        for (let i = 0; i < testScriptNamesAlreadyInDB.current.length; i++) {
            let escapeRegExpMatch = formProps["testScriptName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(testScriptNamesAlreadyInDB.current[i])) {
                return true;
            }
        }
        return false;
    }

    const deleteTestingSession = async (testingSessionID) => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.delete(`http://localhost:5000/delete-testing-session/${testingSessionID}`, {
                    timeout: 5000
                })
                    .then(res => {
                        console.log(res); 
                        updateTestingSessionsAfterRemoval(testingSessionID);
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
            }
        }
    }

    const updateTestingSessionsAfterRemoval = (testingSessionID) => {
        if (testingSessions.length <= 1) {
            setPageMessageOpacity("0%");
           setTimeout(() => {
                setTestingSessions(testingSessions.filter((val) => {
                    return val._id !== testingSessionID;
                }));
            }, 500);
            setTimeout(() => {
                setPageMessageOpacity("100%");
            }, 500);
        } else {
            setTestingSessions(testingSessions.filter((val) => {
                return val._id !== testingSessionID;
            }));
        }
    }

    return (
        <Fragment>
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transtitionElementVisibility}>
            </LoadingWrapper>
            <ErrorWrapper
                alert={alert}
                alertMessage={alertMessage.current}
                handleAlertClosed={handleAlertClosed}
                alertType={alertType.current}> {/* TODO: change alertType hook to useState? */}
            </ErrorWrapper>
            {isValidTestScriptNameEntered
                ? <CardWrapper
                    rendering={rendering}
                    isErrorThrown={isErrorThrown}
                    isUserRetrievingTestingSessions={true}
                    doTestingSessionsExist={testingSessions.length ? true : false}
                    pageMessageOpacity={pageMessageOpacity}>
                    {testingSessions.length
                        ? testingSessions.map((testingSession) => {
                            return <TestingSessionCard
                                key={new Date(testingSession.updatedAt)}
                                testingSessionID={testingSession._id}
                                submitter={testingSession.tester}
                                completed={testingSession.complete}
                                terminatedAtStep={testingSession.stoppedTestingAtStep}
                                result={testingSession.pass}
                                failedSteps={testingSession.failedSteps}
                                responses={testingSession.responses}
                                submissionDate={new Date(testingSession.updatedAt)}
                                deleteTestingSession={deleteTestingSession}>
                            </TestingSessionCard>
                        })
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
