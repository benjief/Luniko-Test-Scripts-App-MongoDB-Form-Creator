import * as React from 'react';
import PropTypes from 'prop-types';
import MaterialTextField from './MaterialTextField';

/**
 * Individual modifiable step that houses all necessary test script step information.
 * @returns said modifiable step.
 */
function ModifiableStep({
    stepNumber, // number of the step in the test script
    stepDescription, // step's description
    stepDataInputtedByUser, // step's data to be input by the user
    modifyStepInfo, // function to handle step information modification (in the parent component)
    addOrRemoveStep, // function to handle adding/removing a step (in the parent component)
    removeDisabled, // whether or not the remove button for a step is disabled (this button is only disabled if this step is the last one remaining in a test script's set of steps)
}) {

    /**
     * Sends changes to a step field back to the parent component, so that these changes can be written to this step (since its information is stored there... I'm not sure how much sense this makes, but that's how things are at the moment). 
     * @param {object} returnedObject -  object containing the step's updated information. Only one field can be updated at a time, and so only that field is present in this object.
     */
    const handleModifyStepInfo = React.useCallback((returnedObject) => {
        let updatedStep = { number: stepNumber };
        if (returnedObject.field === "description") {
            updatedStep["description"] = returnedObject["value"];
        } else {
            updatedStep["dataInputtedByUser"] = returnedObject["value"];
        }
        modifyStepInfo(updatedStep);
    }, [modifyStepInfo, stepNumber])

    /**
     * Calls the addOrRemoveStep function provided by the parent component, with the operation specified by the button the user clicked on, and the step number.
     * @param {string} operation - "add" or "remove" depending on what button has been clicked on.
     */
    const handleAddOrRemoveStep = (operation) => {
        operation === "add" ? addOrRemoveStep({ number: stepNumber }, "add") : addOrRemoveStep({ number: stepNumber }, "remove");
    }

    return (
        <div className="step-container">
            <div className="step-title">
                <div className="step-number">
                    Step {stepNumber}
                </div>
                <button className="remove-step-button"
                    type="submit"
                    disabled={removeDisabled}
                    onClick={() => handleAddOrRemoveStep("remove")}>
                </button>
            </div>
            <div className="step-description">
                <MaterialTextField
                    field="description"
                    label="Description"
                    characterLimit={1000}
                    defaultValue={stepDescription}
                    placeholder="Description"
                    inputValue={handleModifyStepInfo}
                    multiline={true}
                    showCharCounter={true}>
                </MaterialTextField>
            </div>
            <div className="step-data-inputted-by-user">
                <MaterialTextField
                    field="dataInputtedByUser"
                    label="Data Inputted by User"
                    characterLimit={500}
                    defaultValue={stepDataInputtedByUser}
                    placeholder="Data Inputted By User"
                    inputValue={handleModifyStepInfo}
                    multiline={true}
                    showCharCounter={true}>
                </MaterialTextField>
            </div>
            <div className="add-step">
                <button className="add-step-button"
                    type="submit"
                    onClick={() => handleAddOrRemoveStep("add")}>
                </button>
            </div>
        </div >
    );
}

ModifiableStep.propTypes = {
    stepNumber: PropTypes.number,
    stepDescription: PropTypes.string,
    stepDataInputtedByUser: PropTypes.string,
    modifyStepInfo: PropTypes.func,
    addOrRemoveStep: PropTypes.func,
    removeDisabled: PropTypes.bool,
}

ModifiableStep.defaultProps = {
    stepNumber: -1,
    stepDescription: "",
    stepDataInputtedByUser: "",
    modifyStepInfo: () => { },
    addOrRemoveStep: () => { },
    removeDisabled: true,
}

export default ModifiableStep;
