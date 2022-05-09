import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/LandingPage.css";
import CreateOrEditTestScriptCard from "../components/CreateOrEditTestScriptCard";
import "../styles/CreateOrEditTestScript.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";
import "../styles/SelectorComponents.css";

function CreateOrEditTestScript() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [invalidTestScriptNames, setInvalidTestScriptNames] = useState([]);
    const [formProps, setFormProps] = useState({
        testScriptName: "",
        testScriptDescription: "",
        testScriptPrimaryWorkstream: "",
        ownerFirstName: "",
        ownerLastName: "",
        ownerEmail: "",
    });
    const [addTestScriptSteps, setAddTestScriptSteps] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);

    const handleFormCallback = (returnedObject) => {
        const field = returnedObject.field;
        const value = returnedObject.value;

        setFormPropsForFieldAndValue(field, value);
    }

    const setFormPropsForFieldAndValue = (field, value) => {
        setFormProps((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }

    const handleSubmit = (submitted) => {
        if (submitted) {
            setDisplayFadingBalls(true);
            console.log("submitted!");
        }
    }

    useEffect(() => {
        if (rendering) {
            setRendering(false);
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (formProps["testScriptName"] !== "" && formProps["testScriptDescription"] !== "" && formProps["testScriptPrimaryWorkstream"] !== ""
                && formProps["ownerFirstName"] !== "" && formProps["ownerLastName"] !== "" && formProps["ownerEmail"] !== "") {
                setSubmitButtonDisabled(false);
            } else {
                setSubmitButtonDisabled(true);
            }
        }
    }, [rendering, formProps]);

    return (
        rendering
            ? <div className="loading-spinner">
                <Hypnosis
                    className="spinner"
                    color="var(--lunikoOrange)"
                    width="100px"
                    height="100px"
                    duration="1.5s" />
            </div>
            : <Fragment>
                <div
                    className="transition-element"
                    style={{
                        opacity: transitionElementOpacity,
                        visibility: transtitionElementVisibility
                    }}>
                </div>
                <NavBar>
                </NavBar>
                {
                    addTestScriptSteps
                        ? <div>STEPS</div>
                        : <div className="create-or-edit-test-script">
                            <div className="page-message">
                                Please Fill Out/Modify the Fields Below:
                            </div>
                            <div className="create-or-edit-test-script-container">
                                <div className="create-or-edit-test-script-card">
                                    <CreateOrEditTestScriptCard
                                        testScriptName={handleFormCallback}
                                        submittedTestScriptName={formProps["testScriptName"]}
                                        invalidTestScriptNames={invalidTestScriptNames}
                                        testScriptDescription={handleFormCallback}
                                        submittedTestScriptDescription={formProps["testScriptDescription"]}
                                        testScriptPrimaryWorkstream={handleFormCallback}
                                        submittedTestScriptPrimaryWorkstream={formProps["testScriptPrimaryWorkstream"]}
                                        ownerFirstName={handleFormCallback}
                                        submittedOwnerFirstName={formProps["ownerFirstName"]}
                                        ownerLastName={handleFormCallback}
                                        submittedOwnerLastName={formProps["ownerLastName"]}
                                        ownerEmail={handleFormCallback}
                                        submittedOwnerEmail={formProps["ownerEmail"]}
                                        submitted={handleSubmit}
                                        submitButtonDisabled={submitButtonDisabled}
                                        displayFadingBalls={displayFadingBalls}
                                    >
                                    </CreateOrEditTestScriptCard>
                                </div>
                            </div>
                        </div>
                }
            </Fragment>
    )
};

export default CreateOrEditTestScript;
