import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import TestingSessionCard from './TestingSessionCard';

/**
 * Card that displays all testing sessions submitted for a particular test script.
 * @returns said card.
 */
function ViewTestingSessionsCard({
    testingSessions, // array containing all submitted testing sessions
    async, // whether or not an asynchronous call is being made by the parent component
    deleteTestingSession, // function that handles deletion of a testing session and all of its content (i.e. stored images)
    setCardScrollPosition, // function used to set the card's vertical scroll position
    cardScrollPosition, // number specifying the card's current vertical scroll position
}) {
    const expanded = true;
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
     * Redirects the user to the test script name entry form if the card's back button is clicked.
     */
    const handleGoBack = () => {
        window.location.reload();
    }

    return (
        <div>
            <Card
                ref={cardRef}
                onScroll={handleOnScroll}
                className="view-testing-sessions-card"
                sx={{
                    maxHeight: "calc(100vh - 216.52px)",
                    overflowY: "scroll",
                    borderRadius: "10px",
                    boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                    transition: "0.5s",
                    backgroundColor: "var(--lunikoMidGrey)",
                    marginBottom: "20px"
                }}>
                <div className="card-content">
                    <CardHeader
                        titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif" }}
                        title={<strong>Submitted Testing Sessions</strong>}
                    />
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            {/* Testing session information is mapped to TestingSessionCard components. */}
                            {testingSessions.length
                                ? testingSessions.map((testingSession) => {
                                    return <div className="testing-session-card" key={new Date(testingSession.updatedAt)}>
                                        <TestingSessionCard
                                            testingSessionID={testingSession._id}
                                            submitter={testingSession.tester}
                                            completed={testingSession.complete}
                                            terminatedAtStep={testingSession.stoppedTestingAtStep}
                                            result={testingSession.pass}
                                            failedSteps={testingSession.failedSteps}
                                            stepsWithMinorIssues={testingSession.stepsWithMinorIssues}
                                            responsesWithAttachedContent={testingSession.responses}
                                            submissionDate={new Date(testingSession.updatedAt)}
                                            deleteTestingSession={deleteTestingSession}
                                            isDeleteButtonDisabled={async}>
                                        </TestingSessionCard>
                                    </div>
                                })
                                : <div></div>}
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

ViewTestingSessionsCard.propTypes = {
    testingSessions: PropTypes.array,
    async: PropTypes.bool,
    deleteTestingSession: PropTypes.func,
    setCardScrollPosition: PropTypes.func,
    cardScrollPosition: PropTypes.number,
}

ViewTestingSessionsCard.defaultProps = {
    testingSessions: [],
    async: false,
    deleteTestingSession: () => { },
    setCardScrollPosition: () => { },
    cardScrollPosition: 0,
}

export default ViewTestingSessionsCard;
