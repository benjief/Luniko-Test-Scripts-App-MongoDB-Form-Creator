import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import ModifiableStep from './ModifiableStep';

const expanded = true;

/**
 * Card that houses all of the fields required to create or modify test script steps.
 * @returns said card.
 */
function AddOrModifyStepsCard({
    existingSteps, // array of existing test script steps
    isRemoveStepButtonDisabled, // whether or not the remove step step button is disabled
    modifyStepInfo, // function to modify the information associated with a step
    addOrRemoveStep, // function used to add/remove steps
    setCardScrollPosition, // function used to set the card's vertical scroll position
    cardScrollPosition, // number specifying the card's current vertical scroll position
    goBack, // function that handles redirecting the user back to where they came from (less intuitive here, since we're switching cards as opposed to moving between pages)
}) {
    const cardRef = React.useRef(null); // used to get/set the card's vertical scroll position (see useEffect hook below)

    React.useEffect(() => {
        cardRef.current.scrollTop = cardScrollPosition;
    }, [cardRef, cardScrollPosition])

    /**
     * Sets the cardScrollPosition prop in the parent component when the user scrolls up or down.
     */
    const handleOnScroll = () => {
        setCardScrollPosition(cardRef.current.scrollTop);
    }

    /**
     * Sets the cardScrollPosition prop in the parent component and calls goBack (in this case, switching between cards).
     */
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
                                    return <ModifiableStep
                                        key={step.number}
                                        stepNumber={step.number}
                                        stepDescription={step.description}
                                        stepDataInputtedByUser={step.dataInputtedByUser}
                                        modifyStepInfo={modifyStepInfo}
                                        addOrRemoveStep={addOrRemoveStep}
                                        removeDisabled={isRemoveStepButtonDisabled}>
                                    </ModifiableStep>
                                })
                                : <div className="no-steps-placeholder">
                                    You haven't added any steps yet!
                                </div>}
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
    existingSteps: PropTypes.array,
    addStep: PropTypes.func,
    isRemoveStepButtonDisabled: PropTypes.bool,
    modifyStepInfo: PropTypes.func,
    addOrRemoveStep: PropTypes.func,
    setCardScrollPosition: PropTypes.func,
    cardScrollPosition: PropTypes.number,
    goBack: PropTypes.func,
}

AddOrModifyStepsCard.defaultProps = {
    existingSteps: [],
    addStep: () => { },
    isRemoveStepButtonDisabled: false,
    modifyStepInfo: () => { },
    addOrRemoveStep: () => { },
    setCardScrollPosition: () => { },
    cardScrollPosition: 0,
    goBack: () => { },
}

export default AddOrModifyStepsCard;
