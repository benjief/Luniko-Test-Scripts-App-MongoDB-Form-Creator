import { display } from '@mui/system';
import * as React from 'react';
import MaterialTextField from './MaterialTextField';

export default function ModifiableStep({
    stepNumber = -1,
    stepDescription = "",
    // existingStepDescription = "",
    modify = {},
    remove = {},
    removeDisabled = true
}) {
    const [opacity, setOpacity] = React.useState("0%");
    const [height, setHeight] = React.useState(stepNumber === 1 ? "49px" : "0");
    const [marginBottom, setMarginBottom] = React.useState("0");

    const handleOnChange = (returnedObject) => {
        const updatedDescription = returnedObject.value;
        const objectToReturn = { stepNumber: stepNumber, stepDescription: updatedDescription }
        modify(objectToReturn);
    }

    const handleRemove = () => {
        if (!removeDisabled) {
            setOpacity("0%");
            setTimeout(() => {
                setMarginBottom("0");
                setHeight("0");
            }, 500);
            setTimeout(() => {
                remove({ stepNumber: stepNumber });
            }, 1000);
        }
    }

    React.useEffect(() => {
        setHeight("172.91px");
        setMarginBottom("20px");
        setTimeout(() => {
            setOpacity("100%");
        }, 300);
    });

    return (
        <div className="step-container" style={{ opacity: opacity, height: height, marginBottom: marginBottom }}>
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
                <button className="remove-step-button"
                    type="submit"
                    disabled={removeDisabled}
                    onClick={handleRemove}>
                </button>
            </div>
        </div >
    );
}