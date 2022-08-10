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
    const [padding, setPadding] = React.useState(isNewlyAdded ? "0" : "10px");
    const [marginBottom, setMarginBottom] = React.useState(isNewlyAdded ? "0" : "30px");
    // const [overflow, setOverflow] = React.useState("auto");
    // const [isRemoved, setIsRemoved] = React.useState(false);
    const stepRef = React.useRef(null);

    const handleModifyStepInfo = React.useCallback((returnedObject) => { // without useCallback, get new function every time the component re-renders
        let updatedStep = { number: stepNumber };
        if (returnedObject.field === "description") {
            updatedStep["description"] = returnedObject["value"];
            updatedStep["dataInputtedByUser"] = stepDataInputtedByUser;
        } else {
            updatedStep["dataInputtedByUser"] = returnedObject["value"];
            updatedStep["description"] = stepDescription;
        }
        modifyStepInfo(updatedStep);
    }, [modifyStepInfo, stepDataInputtedByUser, stepDescription, stepNumber]) // function will only be re-created when one of these dependent variables changes

    const handleRemoveStep = () => {
        // setHeight(stepRef.current?.clientHeight + "px");
        // setIsRemoved(true);
        // if (!removeDisabled) {
        //     setOpacity("0%");
        //     setTimeout(() => {
        //         setOverflow("hidden");
        //         setMarginBottom("0");
        //         setPadding("0");
        //         setHeight("0");
        //     }, 400);
        // setTimeout(() => {
        removeStep({ number: stepNumber });
        // }, 800); // this seems to be the magic number so that the animation for removing a step remains smooth
        // }
    }

    React.useEffect(() => {
        if (isNewlyAdded) {
            setHeight("432px");
            setMarginBottom("30px");
            setPadding("10px");
            setTimeout(() => {
                setOpacity("100%");
                setHeight("auto");
            }, 400);
        }
    }, [isNewlyAdded]);

    return (
        <div className="step-container"
            ref={stepRef}
            style={{
                opacity: opacity,
                height: height,
                padding: padding,
                marginBottom: marginBottom,
                // overflow: overflow
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
                    characterLimit={500}
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
