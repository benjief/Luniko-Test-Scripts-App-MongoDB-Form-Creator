import * as React from 'react';
import PropTypes from 'prop-types';
import MaterialTextField from './MaterialTextField';

function ModifiableStep({
    stepNumber,
    stepDescription,
    stepDataInputtedByUser,
    modifyStepInfo,
    addOrRemoveStep,
    removeDisabled,
}) {

    const handleModifyStepInfo = React.useCallback((returnedObject) => { // without useCallback, get new function every time the component re-renders
        let updatedStep = { number: stepNumber };
        if (returnedObject.field === "description") {
            updatedStep["description"] = returnedObject["value"];
        } else {
            updatedStep["dataInputtedByUser"] = returnedObject["value"];
        }
        modifyStepInfo(updatedStep);
    }, [modifyStepInfo, stepNumber]) // function will only be re-created when one of these dependent variables changes

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
