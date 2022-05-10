import * as React from 'react';
import MaterialTextField from './MaterialTextField';

export default function ModifiableStep({
    stepNumber = -1,
    stepDescription = "",
    // existingStepDescription = "",
    modify = {},
    remove = {}
}) {
    const handleOnChange = (returnedObject) => {
        const newStepDescription = returnedObject.value;
        const objectToReturn = { stepNumber: stepNumber, stepDescription: newStepDescription }
        modify(objectToReturn);
    }

    const handleRemove = () => {
        remove({ stepNumber: stepNumber });
    }

    return (
        <div className="step-container">
            <div className="step-number">
                Step {stepNumber}
            </div>
            <div className="step-description">
                <MaterialTextField
                    label="Description"
                    characterLimit={1000}
                    defaultValue={stepDescription}
                    placeholder="Description"
                    inputValue={handleOnChange}
                    multiline={true}
                    required={true}
                    showCharCounter={true}>
                </MaterialTextField>
            </div>
            <div className="remove-step">
                <img src={require("../img/remove_icon_active.png")} alt="Remove Step"></img>
            </div>
        </div>
    );
}