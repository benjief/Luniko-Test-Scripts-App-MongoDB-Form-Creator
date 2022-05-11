import { display } from '@mui/system';
import * as React from 'react';
import MaterialTextField from './MaterialTextField';

export default function ModifiableStep({
    stepNumber = -1,
    stepDescription = "",
    // existingStepDescription = "",
    modify = {},
    remove = {},
    removeDisabled = false
}) {
    const [removeButtonImg, setRemoveButtonImg] = React.useState("remove_icon_active.png");

    const handleOnChange = (returnedObject) => {
        const updatedDescription = returnedObject.value;
        const objectToReturn = { stepNumber: stepNumber, stepDescription: updatedDescription }
        modify(objectToReturn);
    }

    const handleRemove = () => {
        if (!removeDisabled) {
            remove({ stepNumber: stepNumber });

        }
    }

    React.useEffect(() => {
        if (!removeDisabled) {
            setRemoveButtonImg("remove_icon_active.png");
        } else {
            setRemoveButtonImg("remove_icon_disabled.png");
        }
    }, [removeDisabled, removeButtonImg]);

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
                <img src={require("../img/" + removeButtonImg)}
                    alt="Remove Step"
                    onClick={handleRemove}>
                </img>
            </div>
        </div >
    );
}