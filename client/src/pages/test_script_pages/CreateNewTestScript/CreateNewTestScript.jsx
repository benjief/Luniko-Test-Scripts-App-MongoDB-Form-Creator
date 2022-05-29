import React, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import CreateOrModifyTestScriptCard from "../components/CreateOrModifyTestScriptCard";
import AddOrModifyStepsCard from "../components/AddOrModifyStepsCard";
import MaterialAlert from "../components/MaterialAlert";
import { v4 as uuidv4 } from "uuid";
import Axios from "axios";
import "../styles/CreateNewTestScript.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";
import "../styles/SelectorComponents.css";
import "../styles/AlertComponents.css";
import "../styles/Steps.css";

function CreateNewTestScript() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [formProps, setFormProps] = useState({
        testScriptName: "",
        testScriptDescription: "",
        testScriptPrimaryWorkstream: "",
        ownerFirstName: "",
        ownerLastName: "",
        // ownerEmail: "",
    });
    const [testScriptSteps, setTestScriptSteps] = useState([]);
    const [addOrModifySteps, setAddOrModifySteps] = useState(false);
    const [isAddOrModifyStepsButtonDisabled, setIsAddOrModifyStepsButtonDisabled] = useState(false);
    const [isAddStepButtonDisabled, setAddStepButtonDisabled] = useState(false);
    const [isRemoveStepButtonDisabled, setRemoveStepButtonDisabled] = useState(true);
    const [isSubmitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);
    const async = useRef(false);
    const activeError = useRef(false);
    const [alert, setAlert] = useState(false);
    const alertMessage = useRef("Test script successfully updated!");
    const alertType = useRef("success-alert");

    const testScriptNamesAlreadyInDB = useRef([]);
    const isInitialDataFetched = useRef(false);
    const isTestScriptSubmitted = useRef(false);

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";
    const writeErrorMessage = "Apologies! We've encountered an error. Please attempt to re-submit your test script.";

    const navigate = useNavigate();

    const runReadAsyncFunctions = async () => {
        isInitialDataFetched.current = true;
        await fetchTestScriptNamesAlreadyInDB();
        // await deleteTestScript("Test 1");
        setRendering(false);
    }

    const fetchTestScriptNamesAlreadyInDB = async () => {
        console.log("fetching existing test script names");
        try {
            async.current = true;
            await Axios.get("http://localhost:5000/get-test-script-names", {
            })
                .then(res => {
                    console.log(res["data"]);
                    testScriptNamesAlreadyInDB.current = res.data.map((}) => name.toLowerCase());
    console.log(testScriptNamesAlreadyInDB.current);
    async.current = false;
});
        } catch (e) {
    console.log(e);
    handleError("r");
}
    }

// const deleteTestScript = async (testScriptName) => {
//     if (!async.current) {
//         console.log("deleting test script");
//         try {
//             console.log(testScriptName);
//             async.current = true;
//             await Axios.delete(`http://localhost:5000/delete-test-script/${testScriptName}`, {
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
        let newStep = { number: stepCount + 1, description: "", pass: false, id: uniqueID };
        let tempArray = testScriptSteps;
        tempArray.push(newStep);
        setTestScriptSteps([...tempArray]);
    }
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

const handleSubmit = (submitted) => {
    if (submitted) {
        isTestScriptSubmitted.current = true;
        setSubmitButtonDisabled(true);
        setIsAddOrModifyStepsButtonDisabled(true);
        setDisplayFadingBalls(true);
        runWriteAsyncFunctions();
    }
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

const handleError = (errorType) => {
    activeError.current = true;
    alertType.current = "error-alert";
    errorType === "r"
        ? alertMessage.current = loadErrorMessage
        : alertMessage.current = writeErrorMessage;

    // Delay is set up just in case an error is generated before the is fully-displayed
    let delay = transitionElementOpacity === "100%" ? 500 : rendering ? 500 : 0;

    if (rendering) {
        setRendering(false);
    }

    setTimeout(() => {
        setAlert(true);
    }, delay);
}

const handleAlertClosed = (alertClosed) => {
    if (alertClosed) {
        setAlert(false);
        navigate("/");
    }
}

useEffect(() => {
    if (rendering) {
        if (!addOrModifySteps && !isInitialDataFetched.current) {
            runReadAsyncFunctions();
        } else if (addOrModifySteps) {
            setRendering(false);
        } else {
            setRendering(false);
        }
    } else {
        console.log(formProps);
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
}, [rendering, formProps, testScriptSteps, isAddStepButtonDisabled, isSubmitButtonDisabled, isTestScriptSubmitted]);

return (
    rendering
        ? <div className="loading-spinner"> // TODO: make one component
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
                    opacity: transitionElementOpacity, // TODO: change this to use a boolean
                    visibility: transtitionElementVisibility
                }}>
            </div>
            <NavBar>
            </NavBar>
            {activeError.current
                ? alert
                    ? <div className="alert-container">
                        <MaterialAlert
                            message={alertMessage.current}
                            closed={handleAlertClosed}
                            className={alertType.current}>
                        </MaterialAlert>
                        <div className="error-div"></div>
                    </div>
                    : <div></div>
                : alert
                    ? <div className="alert-container">
                        <MaterialAlert
                            message={alertMessage.current}
                            closed={handleAlertClosed}
                            className={alertType.current}>
                        </MaterialAlert>
                    </div>
                    : <div></div>
            }
            <Fragment>
                {addOrModifySteps
                    ? <div className={`${addOrModifySteps ? 'add' : 'create'}-or-modify-steps`}>
                        <div className="page-message">
                            Add/Modify Test Script Steps Below:
                        </div>
                        <div className="add-or-modify-steps-container">
                            <div className="add-or-modify-steps-card">
                                <AddOrModifyStepsCard
                                    existingSteps={testScriptSteps}
                                    addStep={handleAddStep}
                                    isAddStepButtonDisabled={isAddStepButtonDisabled}
                                    updateStepDescription={handleUpdateStepDescription}
                                    removeStep={handleRemoveStep}
                                    isRemoveStepButtonDisabled={isRemoveStepButtonDisabled}
                                    goBack={handleChangeCard}>
                                </AddOrModifyStepsCard>
                            </div>
                        </div>
                    </div >
                    : <div className="create-or-modify-test-script">
                        <div className="page-message">
                            Please Fill Out/Modify the Fields Below:
                        </div>
                        <div className="create-or-modify-test-script-container">
                            <div className="create-or-modify-test-script-card">
                                <CreateOrModifyTestScriptCard
                                    testScriptName={handleFormCallback}
                                    existingTestScriptName={formProps["testScriptName"]}
                                    invalidTestScriptNames={testScriptNamesAlreadyInDB.current}
                                    testScriptDescription={handleFormCallback}
                                    existingTestScriptDescription={formProps["testScriptDescription"]}
                                    testScriptPrimaryWorkstream={handleFormCallback}
                                    existingTestScriptPrimaryWorkstream={formProps["testScriptPrimaryWorkstream"]}
                                    ownerFirstName={handleFormCallback}
                                    existingOwnerFirstName={formProps["ownerFirstName"]}
                                    ownerLastName={handleFormCallback}
                                    existingOwnerLastName={formProps["ownerLastName"]}
                                    // ownerEmail={handleFormCallback}
                                    // submittedOwnerEmail={formProps["ownerEmail"]}
                                    addOrModifySteps={handleChangeCard}
                                    isAddOrModifyStepsButtonDisabled={isAddOrModifyStepsButtonDisabled}
                                    submitted={handleSubmit}
                                    isSubmitOrModifyButtonDisabled={isSubmitButtonDisabled}
                                    displayFadingBalls={displayFadingBalls}>
                                </CreateOrModifyTestScriptCard>
                            </div>
                        </div>
                    </div>}
            </Fragment>
        </Fragment>
)
};

export default CreateNewTestScript;
