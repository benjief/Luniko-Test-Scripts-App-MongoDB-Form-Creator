import * as React from 'react';
import PropTypes from 'prop-types';
import MaterialTextField from './MaterialTextField';

function ModifiableStep({
    stepNumber,
    stepDescription,
    stepDataInputtedByUser,
    modifyStepInfo,
    removeStep,
    removeDisabled,
    isNewlyAdded,
}) {
    const [opacity, setOpacity] = React.useState(isNewlyAdded ? "0" : "100%");
    const [height, setHeight] = React.useState(isNewlyAdded ? stepNumber === 1 ? "49px" : "0" : "432px");
    const [padding, setPadding] = React.useState("10px");
    const [marginBottom, setMarginBottom] = React.useState(isNewlyAdded ? "0" : "30px");
    const [overflow, setOverflow] = React.useState("auto");
    const [isRemoved, setIsRemoved] = React.useState(false);
    const stepRef = React.useRef(null);

    const handleModifyStepInfo = (returnedObject) => {
        let updatedStep = { number: stepNumber };
        if (returnedObject.field === "description") {
            updatedStep["description"] = returnedObject["value"];
            updatedStep["dataInputtedByUser"] = stepDataInputtedByUser;
        } else {
            updatedStep["dataInputtedByUser"] = returnedObject["value"];
            updatedStep["description"] = stepDescription;
        }
        modifyStepInfo(updatedStep);
    }

    const handleRemoveStep = () => {
        setHeight(stepRef.current?.clientHeight + "px");
        setIsRemoved(true);
        if (!removeDisabled) {
            setOpacity("0%");
            setTimeout(() => {
                setMarginBottom("0");
                setHeight("0");
                setPadding("0");
                setOverflow("hidden");
            }, 400);
            setTimeout(() => {
                removeStep({ number: stepNumber });
            }, 600); // this seems to be the magic number so that the animation for removing a step remains smooth
        }
    }

    React.useEffect(() => {
        if (!isRemoved && isNewlyAdded) {
            setHeight("432px");
            setMarginBottom("30px");
            setTimeout(() => {
                setOpacity("100%");
                setHeight("auto");
            }, 300);
        }
    }, [isRemoved, isNewlyAdded]);

    return (
        <div className="step-container"
            ref={stepRef}
            style={{
                opacity: opacity,
                height: height,
                padding: padding,
                marginBottom: marginBottom,
                overflow: overflow
            }}>
            <div className="step-number">
                Step {stepNumber}
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
                    required={true}
                    showCharCounter={true}>
                </MaterialTextField>
            </div>
            <div className="step-data-inputted-by-user">
                <MaterialTextField
                    field="dataInputtedByUser"
                    label="Data Inputted by User"
                    characterLimit={1000}
                    defaultValue={stepDataInputtedByUser}
                    placeholder="Data Inputted By User"
                    inputValue={handleModifyStepInfo}
                    multiline={true}
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
    stepDataInputtedByUser: PropTypes.string,
    modifyStepInfo: PropTypes.func,
    removeStep: PropTypes.func,
    removeDisabled: PropTypes.bool,
    isNewlyAdded: PropTypes.bool,
}

ModifiableStep.defaultProps = {
    stepNumber: -1,
    stepDescription: "",
    stepDataInputtedByUser: "",
    modifyStepInfo: () => { },
    removeStep: () => { },
    removeDisabled: true,
    isNewlyAdded: true,
}

export default ModifiableStep;
