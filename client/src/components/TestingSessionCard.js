import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import MaterialImageDialog from './MaterialImageDialog';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));
function TestingSessionCard({
    testingSessionID,
    submitter,
    completed,
    terminatedAtStep,
    result,
    failedSteps,
    stepsWithMinorIssues,
    responses,
    submissionDate,
    deleteTestingSession,
}) {
    const [expanded, setExpanded] = React.useState(false);
    const word = failedSteps.length > 1 ? "steps" : "step";
    const testingSessionRef = React.useRef(null);
    const [opacity, setOpacity] = React.useState("100%");
    const [height, setHeight] = React.useState(testingSessionRef.current?.clientHeight + "px");
    const [marginBottom, setMarginBottom] = React.useState("20px");

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDeleteTestingSession = () => {
        // setTimeout(() => {
        setHeight(testingSessionRef.current?.clientHeight + "px");
        setOpacity("0%");
        // }, 0);
        setTimeout(() => {
            setMarginBottom("0");
            setHeight("0");
        }, 10);
        setTimeout(() => {
            deleteTestingSession(testingSessionID);
        }, 500);
    }

    return (
        <Card
            ref={testingSessionRef}
            sx={{
                opacity: opacity,
                height: height,
                maxHeight: "calc(100vh - 166.52px)",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "1s",
                backgroundColor: "var(--lunikoDarkGrey)",
                marginBottom: marginBottom
            }}>
            <div className="card-content">
                <CardHeader
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    title={<strong>Testing Session {testingSessionID}</strong>}>
                </CardHeader>
                <Typography paragraph className="testing-session-result">
                    <span id="testing-session-result-header">
                        <strong>Result</strong>
                        <img src={result ? completed ? require("../img/checkmark_icon_green.png") : require("../img/checkmark_icon_yellow.png") : require("../img/x_icon_red.png")} alt={result ? completed ? "incomplete" : "pass" : "fail"} /> {/*TODO: check this*/}
                    </span>
                    <span id="testing-session-result-main-contents">
                        {result ? completed ? "pass" : "incomplete" : completed ? "fail" : "fail, incomplete"}
                    </span>
                    {stepsWithMinorIssues && stepsWithMinorIssues.length ? <span>steps with minor issues: {stepsWithMinorIssues.join(', ')}<br /></span> : ""}
                    {result ? completed ? "" : `terminated at step ${terminatedAtStep}` : completed ? `failed at ${word} ${failedSteps.join(', ')}` : [`failed at ${word} ${failedSteps.join(', ')}; `, `terminated at step ${terminatedAtStep}`]}
                </Typography>
                < CardActions
                    disableSpacing
                    style={{ justifyContent: "center", height: "40px", padding: 0, paddingBottom: "10px" }}>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                        style={{ marginLeft: 0 }}
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions >
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph className="testing-session-submitter">
                            <strong>Submitter</strong><br />
                            {submitter.firstName + " " + submitter.lastName}
                        </Typography>
                        <Typography component={"div"} variant={"body2"} className="testing-session-comments">
                            <strong>Comments</strong><br />
                            {responses.length
                                ? responses.map((response) => {
                                    return <p
                                        key={response._id}>
                                        <span id="test-span">
                                            <u>Step {response.step}</u>
                                            {response.uploadedImage
                                                ? <MaterialImageDialog
                                                    imageSource={response.uploadedImage["imageURL"]}
                                                    buttonText={"uploaded image"}>
                                                </MaterialImageDialog>
                                                : ""}<br />
                                        </span>
                                        {response.comments}
                                    </p>
                                })
                                : <p>none</p>}
                        </Typography>
                        <Typography paragraph className="testing-session-submission-date">
                            <strong>Date Submitted</strong><br />
                            {submissionDate.toString()}
                        </Typography>
                        <button
                            className="delete-testing-session-button"
                            onClick={handleDeleteTestingSession}>
                            Delete
                        </button>
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
    stepsWithMinorIssues: PropTypes.array,
    responses: PropTypes.array,
    submissionDate: PropTypes.instanceOf(Date),
    deleteTestingSession: PropTypes.func,
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
    stepsWithMinorIssues: [],
    responses: [],
    submissionDate: new Date(),
    deleteTestingSession: () => { },
}

export default TestingSessionCard;
