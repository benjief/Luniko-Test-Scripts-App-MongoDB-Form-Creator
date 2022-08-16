import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import TestingSessionCard from './TestingSessionCard';
function ViewTestingSessionsCard({
    testingSessions,
    async,
    deleteTestingSession,
}) {
    const expanded = true;

    // React.useEffect(() => {
    //     console.log(existingSteps);
    // }, [existingSteps])

    const goBack = () => {
        window.location.reload();
    }

    return (
        <div>
            <Card
            className="view-testing-sessions-card"
                sx={{
                    height: "calc(100vh - 216.52px)",
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
                            {testingSessions.length
                                ? testingSessions.map((testingSession) => {
                                    return <div className="testing-session-card" key={new Date(testingSession.updatedAt)}>
                                        <TestingSessionCard
                                            // key={new Date(testingSession.updatedAt)}
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
                onClick={goBack}>
                Back
            </button>
        </div>
    );
}

ViewTestingSessionsCard.propTypes = {
    testingSessions: PropTypes.array,
    async: PropTypes.bool,
    deleteTestingSession: PropTypes.func,
}

ViewTestingSessionsCard.defaultProps = {
    testingSessions: [],
    async: false,
    deleteTestingSession: () => { },
}

export default ViewTestingSessionsCard;
