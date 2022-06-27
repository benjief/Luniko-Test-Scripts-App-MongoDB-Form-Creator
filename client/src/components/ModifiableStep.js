import * as React from 'react';
import PropTypes from 'prop-types';
import MaterialTextField from './MaterialTextField';

function ModifiableStep({
    stepNumber,
    stepDescription,
    modifyStepDescription,
    removeStep,
    removeDisabled,
    isNewlyAdded,
}) {
    const [opacity, setOpacity] = React.useState(isNewlyAdded ? "0" : "100%");
    const [height, setHeight] = React.useState(isNewlyAdded ? stepNumber === 1 ? "49px" : "0" : "172.91px");
    const [marginBottom, setMarginBottom] = React.useState(isNewlyAdded ? "0" : "15px");
    const [removed, setRemoved] = React.useState(false);

    const handleModifyStepDescription = (returnedObject) => {
        const updatedStepDescription = returnedObject.value;
        const updatedStep = { number: stepNumber, description: updatedStepDescription }
        modifyStepDescription(updatedStep);
    }

    const handleRemoveStep = () => {
        setRemoved(true);
        if (!removeDisabled) {
            setOpacity("0%");
            setTimeout(() => {
                setMarginBottom("0");
                setHeight("0");
            }, 300);
            setTimeout(() => {
                removeStep({ number: stepNumber });
            }, 1000);
        }
    }

    React.useEffect(() => {
        if (!removed && isNewlyAdded) {
            setHeight("172.91px");
            setMarginBottom("20px");
            setTimeout(() => {
                setOpacity("100%");
            }, 300);
        } 
    }, [removed, isNewlyAdded]);

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
                    inputValue={handleModifyStepDescription}
                    multiline={true}
                    required={true}
                    showCharCounter={true}>
                </MaterialTextField>
            </div>
            <div className="remove-step">
                <button className="remove-step-button"
                    type="submit"
                    disabled={removeDisabled}
                    onClick={handleRemoveStep}>
                </button>
            </div>
        </div >
    );
}

ModifiableStep.propTypes = {
    stepNumber: PropTypes.number,
    stepDescription: PropTypes.string,
    modifyStepDescription: PropTypes.func,
    removeStep: PropTypes.func,
    removeDisabled: PropTypes.bool,
    isNewlyAdded: PropTypes.bool,
}

ModifiableStep.defaultProps = {
    stepNumber: -1,
    stepDescription: "",
    modifyStepDescription: () => { },
    removeStep: () => { },
    removeDisabled: true,
    isNewlyAdded: true,
}

export default ModifiableStep;
