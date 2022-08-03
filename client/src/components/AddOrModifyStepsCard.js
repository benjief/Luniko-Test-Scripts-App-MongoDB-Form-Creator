import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import ModifiableStep from './ModifiableStep';
function AddOrModifyStepsCard({
    existingSteps,
    addStep,
    isAddStepButtonDisabled,
    modifyStepInfo,
    removeStep,
    isRemoveStepButtonDisabled,
    goBack,
}) {
    const expanded = true;

    // React.useEffect(() => {
    //     console.log(existingSteps);
    // }, [existingSteps])

    return (
        <Card
            sx={{
                maxHeight: "calc(100vh - 166.52px)",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: "var(--lunikoDarkGrey)",
                marginBottom: "20px"
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
                                return <ModifiableStep
                                    key={step.uniqueID ? step.uniqueID : step._id}
                                    stepNumber={step.number}
                                    stepDescription={step.description}
                                    stepDataInputtedByUser={step.dataInputtedByUser}
                                    modifyStepInfo={modifyStepInfo}
                                    removeStep={removeStep}
                                    removeDisabled={isRemoveStepButtonDisabled}
                                    isNewlyAdded={step.isNewlyAdded}>
                                </ModifiableStep>
                            })
                            : <div className="no-steps-placeholder">
                                You haven't added any steps yet!
                            </div>}
                        <button
                            className="add-step-button"
                            onClick={addStep}
                            disabled={isAddStepButtonDisabled}>
                            Add Step
                        </button>
                        <button
                            className="back-button"
                            onClick={goBack}>
                            Back
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}

AddOrModifyStepsCard.propTypes = {
    existingSteps: PropTypes.array, // TODO: make this more specific (see CardWrapper.jsx)
    addStep: PropTypes.func,
    isAddStepButtonDisabled: PropTypes.bool,
    isRemoveStepButtonDisabled: PropTypes.bool,
    modifyStepInfo: PropTypes.func,
    removeStep: PropTypes.func,
    goBack: PropTypes.func,
}

AddOrModifyStepsCard.defaultProps = {
    existingSteps: [],
    addStep: () => { },
    isAddStepButtonDisabled: true,
    isRemoveStepButtonDisabled: false,
    modifyStepInfo: () => { },
    removeStep: () => { },
    goBack: () => { },
}

export default AddOrModifyStepsCard;
