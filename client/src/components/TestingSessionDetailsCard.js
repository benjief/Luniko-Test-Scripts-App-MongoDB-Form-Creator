import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
// import MaterialSingleSelect from './MaterialSingleSelect';
// import MaterialSingleSelectFreeSolo from './MaterialSingleSelectFreeSolo';
// import MaterialTextField from './MaterialTextField';
// import MaterialRadioButton from './MaterialRadioButton';
// import MaterialMultiSelect from './MaterialMultiSelect';
// import MaterialMultiSelectFreeSolo from './MaterialMultiSelectFreeSolo';
// import MaterialCheckBox from './MaterialCheckBox';
// import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

// const ExpandMore = styled((props) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//     transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//         duration: theme.transitions.duration.shortest,
//     }),
// }));

function TestingSessionDetailsCard({
    changeStep,
    testScriptName,
    stepDescription,
    stepComments,
    stepNumber,
    stepResult,
    isLastStep,
}) {    
    // const expanded = true;
    const [areButtonsDisabled, setAreButtonsDisabled] = React.useState(false);
    // const isStepResponseSaveable = React.useRef(false);

    const navigate = useNavigate();

    // React.useEffect(() => {
    //     console.log(testScriptName);
    // }, [testScriptName]);

    // const handleOnChange = (returnedObject) => {
    //     // const objectToReturn = { value: returnedObject.value, field: returnedObject.field };
    //     // const stringFunction = returnedObject.field + "(objectToReturn)";
    //     // eval(stringFunction);
    //     if (returnedObject["field"] === "radio button value") {
    //         returnedObject["field"] = "pass";
    //         returnedObject["value"] = returnedObject["value"] === "true";
    //     }
    //     setCurrentStepResponseProps(
    //         prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
    //     );
    // }

    // const setStepID = (newStepNumber) => {
    //     setCurrentStepResponseProps(
    //         prev => ({ ...prev, stepID: stepID })
    //     );
    // }

    const handleChangeStep = (direction) => {
        setAreButtonsDisabled(true);
        direction === "increment"
            ? handleOnClickNextStep(stepNumber + 1)
            : handleOnClickPreviousStep(stepNumber - 1);
    }

    const handleOnClickNextStep = () => {
        changeStep(stepNumber + 1);
    }

    const handleOnClickPreviousStep = () => {
        changeStep(stepNumber - 1);
    }

    // const handleBeginTesting = () => {
    //     setIsTestingInProgress(true);
    // }

    // const handleSubmit = () => {
    //     setIsTestScriptSubmitted(true);
    // }

    return (
        <Card
            sx={{
                // minWidth: 1,
                // maxWidth: 1,
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
                    // subheaderTypographyProps={{ color: "rgba(0, 0, 0, 0.7)", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    // avatar={
                    //     <Avatar sx={{
                    //         bgcolor: "var(--lunikoBlue)"
                    //     }}
                    //         aria-label="status">
                    //         {statusAbbreviation}
                    //     </Avatar>
                    // }
                    title={<strong>Step {stepNumber}</strong>}
                />
                {/* < CardActions
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
            </CardActions > */}
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <CardContent>
                        {/* <Typography
                        paragraph>
                        <strong>Updatable Fields</strong>
                    </Typography> */}
                        <Typography paragraph className="step-description">
                            <strong>Step Description</strong><br />
                            {stepDescription}
                        </Typography>
                        <Typography paragraph className="step-comments">
                            <strong>Comments</strong><br />
                            {stepComments}
                        </Typography>
                        <Typography paragraph className="step-result">
                            <strong>Result</strong><br />
                            <span id="step-result-contents">
                                {stepResult ? "pass" : "fail"}
                                <img src={stepResult ? require("../img/checkmark_icon_green.png") : require("../img/x_icon_red.png")} alt={stepResult ? "pass" : "fail"} />
                            </span>
                        </Typography>
                        <button
                            className="previous-step-button"
                            onClick={() => handleChangeStep()}
                            disabled={stepNumber === 1 || areButtonsDisabled}>
                            Previous Step
                        </button>
                        <button
                            className="next-step-button"
                            onClick={() => handleChangeStep("increment")}
                            disabled={isLastStep || areButtonsDisabled}>
                            Next Step
                        </button>
                        <button
                            className="back-button"
                            onClick={() => navigate(`/retrieve-test-script-testing-sessions/${testScriptName}`)}
                            disabled={areButtonsDisabled}>
                            Back
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}

TestingSessionDetailsCard.propTypes = {
    changeStep: PropTypes.func,
    testScriptName: PropTypes.string,
    stepDescription: PropTypes.string,
    stepComments: PropTypes.string,
    stepResult: PropTypes.bool,
    stepNumber: PropTypes.number,
    isLastStep: PropTypes.bool,
}

TestingSessionDetailsCard.defaultProps = {
    changeStep: () => { },
    testScriptName: "",
    stepDescription: "",
    stepComments: "",
    stepResult: false,
    stepNumber: 0,
    isLastStep: false,
}

export default TestingSessionDetailsCard;
