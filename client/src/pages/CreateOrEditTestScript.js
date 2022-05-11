import React, { Fragment, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/LandingPage.css";
import CreateOrEditTestScriptCard from "../components/CreateOrEditTestScriptCard";
import AddOrModifyStepsCard from "../components/AddOrModifyStepsCard";
import { v4 as uuidv4 } from "uuid";
import "../styles/CreateOrEditTestScript.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";
import "../styles/SelectorComponents.css";
import "../styles/Steps.css";

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
    const [testScriptSteps, setTestScriptSteps] = useState([]);
    const [addOrModifySteps, setAddOrModifySteps] = useState(false);
    const [addStepButtonDisabled, setAddStepButtonDisabled] = useState(false);
    const [removeStepButtonDisabled, setRemoveStepButtonDisabled] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);

    const navigate = useNavigate();

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

    const handleChangeCard = (changeCard) => {
        if (changeCard) {
            setRendering(true);
            addOrModifySteps
                ? setAddOrModifySteps(false)
                : setAddOrModifySteps(true);
        }
    }

    const handleAddStep = (addStep) => {
        if (addStep) {
            console.log("adding step");
            let stepCount = testScriptSteps.length;
            let uniqueID = uuidv4();
            let newStep = { stepNumber: stepCount + 1, stepDescription: "", stepID: uniqueID };
            let tempArray = testScriptSteps;
            tempArray.push(newStep);
            setTestScriptSteps([...tempArray]);
        }
    }

    const handleUpdateStepDescription = (updateInfo) => {
        const stepNumber = updateInfo["stepNumber"];
        const updatedDescription = updateInfo["stepDescription"];
        let copyOfSteps = testScriptSteps;
        let stepToUpdate = copyOfSteps.filter(obj => {
            return obj["stepNumber"] === stepNumber
        });
        stepToUpdate = stepToUpdate[0];
        let indexOfStepToUpdate = copyOfSteps.indexOf(stepToUpdate);
        stepToUpdate["stepDescription"] = updatedDescription;
        setTestScriptSteps([...copyOfSteps]);
    }

    const handleRemoveStep = async (stepInfo) => {
        const stepNumber = stepInfo["stepNumber"];
        let copyOfSteps = testScriptSteps;
        copyOfSteps = copyOfSteps.filter(obj => {
            return obj["stepNumber"] !== stepNumber
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
            listOfSteps[i]["stepNumber"]--;
        }
        return listOfSteps;
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
            (formProps["testScriptName"] !== "" && formProps["testScriptDescription"] !== "" && formProps["testScriptPrimaryWorkstream"] !== ""
                && formProps["ownerFirstName"] !== "" && formProps["ownerLastName"] !== "" && formProps["ownerEmail"] !== "")
                ? setSubmitButtonDisabled(false)
                : setSubmitButtonDisabled(true);
            testScriptSteps.length && !testScriptSteps.slice(-1)[0]["stepDescription"].trim().length
                ? setAddStepButtonDisabled(true)
                : setAddStepButtonDisabled(false);
            testScriptSteps.length === 1
                ? setRemoveStepButtonDisabled(true)
                : setRemoveStepButtonDisabled(false);
            // TODO: look into abstracting functions in useEffect hook... can this be done?
        }
    }, [rendering, formProps, testScriptSteps, addStepButtonDisabled]);
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
                {addOrModifySteps
                    ? <div className="add-or-modify-steps">
                        <div className="page-message">
                            Add/Modify Test Script Steps Below:
                        </div>
                        <div className="add-or-modify-steps-container">
                            <div className="add-or-modify-steps-card">
                                <AddOrModifyStepsCard
                                    existingSteps={testScriptSteps}
                                    addStep={handleAddStep}
                                    addStepButtonDisabled={addStepButtonDisabled}
                                    updateStepDescription={handleUpdateStepDescription}
                                    removeStep={handleRemoveStep}
                                    removeStepDisabled={removeStepButtonDisabled}
                                    goBack={handleChangeCard}>
                                </AddOrModifyStepsCard>
                            </div>
                        </div>
                    </div>
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
                                    addOrModifySteps={handleChangeCard}
                                    submitted={handleSubmit}
                                    submitButtonDisabled={submitButtonDisabled}
                                    displayFadingBalls={displayFadingBalls}>
                                </CreateOrEditTestScriptCard>
                            </div>
                        </div>
                    </div>}
            </Fragment>
    )
};

export default CreateOrEditTestScript;
