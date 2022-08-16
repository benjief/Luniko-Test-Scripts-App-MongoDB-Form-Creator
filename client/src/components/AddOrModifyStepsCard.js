import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import ModifiableStep from './ModifiableStep';

const expanded = true;
function AddOrModifyStepsCard({
    existingSteps,
    // addStep,
    // isAddStepButtonDisabled,
    isRemoveStepButtonDisabled,
    modifyStepInfo,
    addOrRemoveStep,
    // removeStep,
    setCardScrollPosition,
    cardScrollPosition,
    goBack,
}) {
    const cardRef = React.useRef(null);

    React.useEffect(() => {
        // console.log(cardRef.current.scrollTop);
        cardRef.current.scrollTop = cardScrollPosition;
    }, [cardRef, cardScrollPosition])

    const handleOnScroll = () => {
        setCardScrollPosition(cardRef.current.scrollTop);
    }

    const handleGoBack = () => {
        setCardScrollPosition(cardRef.current.scrollTop);
        goBack();
    }

    return (
        <div>
            <Card
                onScroll={handleOnScroll}
                ref={cardRef}
                sx={{
                    maxHeight: "calc(100vh - 216.52px)",
                    overflowY: "scroll",
                    borderRadius: "10px",
                    boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                    transition: "0.5s",
                    backgroundColor: "var(--lunikoMidGrey)",
                    marginBottom: "20px",
                }}>
                <div className="card-content">
                    <CardHeader
                        titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif" }}
                        title={<strong>Test Script Steps</strong>}
                    />
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            {existingSteps.length
                                ? existingSteps.map((step) => {
                                    // console.log(step);
                                    return <ModifiableStep
                                        key={step.number}
                                        stepNumber={step.number}
                                        stepDescription={step.description}
                                        stepDataInputtedByUser={step.dataInputtedByUser}
                                        modifyStepInfo={modifyStepInfo}
                                        addOrRemoveStep={addOrRemoveStep}
                                        // removeStep={removeStep}
                                        removeDisabled={isRemoveStepButtonDisabled}
                                    /*isNewlyAdded={step.isNewlyAdded}*/>
                                    </ModifiableStep>
                                })
                                : <div className="no-steps-placeholder">
                                    You haven't added any steps yet!
                                </div>}
                            {/* <button
                            className="add-step-button"
                            onClick={addStep}
                            disabled={isAddStepButtonDisabled}>
                            Add Step
                        </button> */}
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            <button
                className="back-button"
                onClick={handleGoBack}>
                Back
            </button>
        </div>
    );
}

AddOrModifyStepsCard.propTypes = {
    existingSteps: PropTypes.array, // TODO: make this more specific (see CardWrapper.jsx)
    addStep: PropTypes.func,
    // isAddStepButtonDisabled: PropTypes.bool,
    isRemoveStepButtonDisabled: PropTypes.bool,
    modifyStepInfo: PropTypes.func,
    addOrRemoveStep: PropTypes.func,
    // removeStep: PropTypes.func,
    setCardScrollPosition: PropTypes.func,
    cardScrollPosition: PropTypes.number,
    goBack: PropTypes.func,
}

AddOrModifyStepsCard.defaultProps = {
    existingSteps: [],
    addStep: () => { },
    // isAddStepButtonDisabled: true,
    isRemoveStepButtonDisabled: false,
    modifyStepInfo: () => { },
    addOrRemoveStep: () => { },
    // removeStep: () => { },
    setCardScrollPosition: () => { },
    cardScrollPosition: 0,
    goBack: () => { },
}

export default AddOrModifyStepsCard;
