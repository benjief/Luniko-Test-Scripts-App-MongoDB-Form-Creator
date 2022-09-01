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
// import SubmitButton from './SubmitButton';
import MaterialDialog from './MaterialDialog';

/** 
 * Function used to expand the card (comes pre-packaged with this component).
 * @params props 
 */
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

/**
 * Card that displays fields of interest corresponding to a user's testing session for a particular test script. 
 * @returns said card.
 */
function TestingSessionCard({
    testingSessionID, // ID of the testing session
    submitter, // object containing the details of the tester
    completed, // whether or not all steps in the testing session were completed by the tester
    terminatedAtStep, // the last step completed in the testing session
    result, // whether the test script passed or failed
    failedSteps, // array containing any steps marked as failed by the user during the testing session
    stepsWithMinorIssues, // array containing any steps marked as containing minor issues by the user during the testing session
    responsesWithAttachedContent, // array of steps to which the user attached comments or images
    submissionDate, // date the testing session was submitted
    deleteTestingSession, // function that handles deletion of a testing session and all of its content (i.e. stored images)
    isDeleteButtonDisabled, // whether or not the "delete testing session" button is disabled
}) {
    const [expanded, setExpanded] = React.useState(false);
    const word = failedSteps.length > 1 ? "steps" : "step";
    const testingSessionRef = React.useRef(null);

    /**
     * Handles expansion/contraction of the card.
     */
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card
            ref={testingSessionRef}
            sx={{
                opacity: "100%",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "1s",
                backgroundColor: "var(--lunikoLightGrey)",
                marginBottom: "20px",
            }}>
            <div className="card-content">
                <div className="testing-session-title">
                    <CardHeader
                        titleTypographyProps={{ color: "rgba(0, 0, 0, 0.7)", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", textAlign: "center" }}
                        title={"Testing Session " + testingSessionID}>
                    </CardHeader>
                    <MaterialDialog
                        className="material-dialog-delete"
                        isDialogDisabled={isDeleteButtonDisabled}
                        exteriorButton={
                            <button className="delete-testing-session-button"
                                type="submit"
                                disabled={isDeleteButtonDisabled}>
                            </button>
                        }
                        inactiveButtonText="Cancel"
                        displayActiveButton={true}
                        activeButtonFunction={() => deleteTestingSession(testingSessionID)}
                        activeButtonText="Delete"
                        dialogDescription={<p>Are you sure you want to permanently delete this testing session? This action cannot be undone.</p>}>
                    </MaterialDialog>
                </div>
                <Typography paragraph className="testing-session-result">
                    <span id="testing-session-result-header">
                        <strong>Result</strong>
                        <img src={result ? completed ? require("../img/checkmark_icon_green.png") : require("../img/checkmark_icon_green_hollow.png") : require("../img/x_icon_red.png")} alt={result ? completed ? "incomplete" : "pass" : "fail"} /> {/*TODO: check this*/}
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
                            <strong>Step Overview</strong><br />
                            {responsesWithAttachedContent.length
                                ? responsesWithAttachedContent.map((response) => {
                                    return response.comments || response.uploadedImage
                                        ? <p key={response._id}>
                                            <span id="step-header-span">
                                                {response.comments || response.uploadedImage
                                                    ? <span><u>Step {response.step}</u>
                                                        {response.uploadedImage
                                                            ? <MaterialImageDialog
                                                                imageSource={response.uploadedImage["imageURL"]}
                                                                buttonText={"uploaded image"}>
                                                            </MaterialImageDialog>
                                                            : ""}<br /></span>
                                                    : <span />}
                                            </span>
                                            {response.comments}
                                        </p>
                                        : ""
                                })
                                : <p>no attached images or comments</p>}
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
    stepsWithMinorIssues: PropTypes.array,
    responsesWithAttachedContent: PropTypes.array,
    submissionDate: PropTypes.instanceOf(Date),
    deleteTestingSession: PropTypes.func,
    isDeleteButtonDisabled: PropTypes.bool,
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
    responsesWithAttachedContent: [],
    submissionDate: new Date(),
    deleteTestingSession: () => { },
    isDeleteButtonDisabled: false,
}

export default TestingSessionCard;
