import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useValidationErrorUpdate } from "../Context/ValidationErrorContext";
import Axios from "axios";
import LoadingWrapper from "../wrappers/LoadingWrapper";
import AlertWrapper from "../wrappers/AlertWrapper";
// import CardWrapper from "../wrappers/CardWrapper";
import EnterTestScriptNameCard from "../../../components/EnterTestScriptNameCard"
// import TestingSessionCard from "../../../components/TestingSessionCard";
import "../../../styles/DeleteTestScript.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/AlertComponents.css";
import CardWrapper from "../wrappers/CardWrapper/CardWrapper";
// import "../../../styles/DialogComponents.css";

function DeleteTestScript() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const invalidTestScriptNameError = useValidationErrorUpdate();
    const [isDeleteTestScriptButtonDisabled, setIsDeleteTestScriptButtonDisabled] = useState(true);
    const [formProps, setFormProps] = useState({ // TODO: rename this so you can actually use it here without it looking weird (e.g. testScriptProps)
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

    const handleError = useCallback((errorType) => {
        setIsErrorThrown(true);
        alertType.current = "error-alert";
        errorType === "r"
            ? alertMessage.current = loadErrorMessage
            : alertMessage.current = deleteErrorMessage;

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
                        testScriptNamesAlreadyInDB.current = res.data.map(({ name_lowercase }) => name_lowercase);
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
                handleError("r");
            }
        }

        if (rendering) {
            if (!isValidTestScriptNameEntered && !isDataBeingFetched.current) {
                runPrimaryReadAsyncFunctions();
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!isValidTestScriptNameEntered) {
                formProps["testScriptName"].trim().length ? setIsDeleteTestScriptButtonDisabled(false) : setIsDeleteTestScriptButtonDisabled(true);
            }
        }
    }, [rendering, isDataBeingFetched, formProps, isValidTestScriptNameEntered, testScriptID, handleError]);

    const handleDeleteTestScript = async () => { // TODO: make this more direct
        if (!isValidTestScriptNameEntered) {
            if (validateTestScriptNameEntered()) {
                setIsValidTestScriptNameEntered(true);
                isDataBeingFetched.current = false;
                // setRendering(true);
                setIsDeleteTestScriptButtonDisabled(true);
                setDisplayFadingBalls(true);
                await runSecondaryReadAsyncFunctions(formProps["testScriptName"])
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
    const validateTestScriptNameEntered = () => {
        for (let i = 0; i < testScriptNamesAlreadyInDB.current.length; i++) {
            let escapeRegExpMatch = formProps["testScriptName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(testScriptNamesAlreadyInDB.current[i])) {
                return true;
            }
        }
        return false;
    }

    const runSecondaryReadAsyncFunctions = async (testScriptName) => {
        isDataBeingFetched.current = true;
        await fetchTestScriptID(testScriptName);
        await fetchTestScriptTestingSessions();
    }

    const fetchTestScriptID = async (testScriptName) => {
        try {
            async.current = true;
            await Axios.get(`http://localhost:5000/get-test-script/${testScriptName}`, {
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

    const fetchTestScriptTestingSessions = async () => {
        try {
            async.current = true;
            await Axios.get(`http://localhost:5000/get-test-script-testing-sessions/${testScriptID.current}`, {
                timeout: 5000
            })
                .then(res => {
                    // console.log(res.data);
                    testingSessions.current = res.data;
                    async.current = false;
                })
        } catch (e) {
            console.log(e);
            handleError("r");
        }
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
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
                handleError("d");
            }
        }
    }

    const deleteTestScript = async () => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.delete(`http://localhost:5000/delete-test-script/${testScriptID.current}`, {
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
            {/* {isErrorThrown
                ? <div></div>
                : <div className="enter-valid-test-script-name">
                    <div className="enter-valid-test-script-name-container">
                        <div className="page-message">
                            Enter the Name of the Test Script to Delete Below:
                        </div>
                        <div className="enter-valid-test-script-name-card">
                            <EnterTestScriptNameCard
                                setFormProps={setFormProps}
                                requestTestScript={handleDeleteTestScript}
                                isSubmitButtonDisabled={isDeleteTestScriptButtonDisabled}
                                isDeletionForm={true}
                                displayFadingBalls={displayFadingBalls}>
                            </EnterTestScriptNameCard>
                        </div>
                    </div>
                </div>} */}
        </Fragment >
    )
};

export default DeleteTestScript;
