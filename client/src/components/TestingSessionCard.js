import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
function TestingSessionCard({
    testingSessionID,
    submitter,
    completed,
    terminatedAtStep,
    result,
    failedSteps,
    responses,
    submissionDate,

}) {
    const word = failedSteps.length > 1 ? "steps" : "step";

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
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    title={<strong>Testing Session {testingSessionID}</strong>}
                />
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph className="testing-session-submitter">
                            <strong>Submitter</strong><br />
                            {submitter.firstName + " " + submitter.lastName}
                        </Typography>
                        <Typography paragraph className="testing-session-result">
                            <strong>Result</strong><br />
                            <span id="testing-session-result-main-contents">
                                {result ? completed ? "pass" : "incomplete" : completed ? "fail" : "fail, incomplete"}
                                <img src={result ? completed ? require("../img/checkmark_icon_green.png") : require("../img/checkmark_icon_orange.png") : require("../img/x_icon_red.png")} alt={result ? completed ? "incomplete" : "pass" : "fail"} /> {/*TODO: check this*/}
                            </span>
                            {result ? completed ? "" : `terminated at step ${terminatedAtStep}` : completed ? `failed at ${word} ${failedSteps.join(', ')}` : [`failed at ${word} ${failedSteps.join(', ')}; `, `terminated at step ${terminatedAtStep}`]}

                        </Typography>
                        <Typography component={"div"} variant={"body2"} className="testing-session-comments">
                            <strong>Comments</strong><br />
                            {responses.length
                                ? responses.map((response) => {
                                    return <p
                                        key={response._id}>
                                        Step {response.step}:<br />{response.comments}
                                    </p>
                                })
                                : <p>none</p>}
                        </Typography>
                        <Typography paragraph className="testing-session-submission-date">
                            <strong>Date Submitted</strong><br />
                            {submissionDate.toString()}
                        </Typography>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}

TestingSessionCard.propTypes = {
    testingSessionID: PropTypes.string,
    submitter: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        _id: PropTypes.string
    }),
    completed: PropTypes.bool,
    terminatedAtStep: PropTypes.number,
    result: PropTypes.bool,
    failedSteps: PropTypes.array,
    responses: PropTypes.array,
    submissionDate: PropTypes.instanceOf(Date),
}

TestingSessionCard.defaultProps = {
    testingSessionID: "",
    submitter: {
        firstName: "",
        lastName: "",
        _id: ""
    },
    completed: false,
    terminatedAtStep: -1,
    result: false,
    failedSteps: [],
    responses: [],
    submissionDate: new Date(),

}

export default TestingSessionCard;
