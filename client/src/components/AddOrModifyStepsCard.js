import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MaterialTextField from './MaterialTextField';
import ModifiableStep from './ModifiableStep';
import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

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

export default function AddOrModifyStepsCard({
    // testScriptName = "",
    // submittedTestScriptName = "",
    // invalidTestScriptNames = [], // TODO: be careful with this and the above prop
    // testScriptDescription = "",
    // submittedTestScriptDescription = "",
    // testScriptPrimaryWorkstream = "",
    // submittedTestScriptPrimaryWorkstream = "",
    // ownerFirstName = "",
    // submittedOwnerFirstName = "",
    // ownerLastName = "",
    // submittedOwnerLastName = "",
    // ownerEmail = "",
    // submittedOwnerEmail = "",
    existingSteps = [],
    addStep = false,
    addStepButtonDisabled = false,
    goBack = false,
    displayFadingBalls = false
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [addStepButtonColor, setAddStepButtonColor] = React.useState("var(--lunikoBlue)");

    const handleOnChange = (returnedObject) => {
        const objectToReturn = { value: returnedObject.value, field: returnedObject.field };
        const stringFunction = returnedObject.field + "(objectToReturn)";
        eval(stringFunction);
    }

    const handleAddStep = () => {
        addStep(true);
    }

    const handleGoBack = () => {
        goBack(true);
    }

    React.useEffect(() => {
        if (!addStepButtonDisabled) {
            setAddStepButtonColor("var(--lunikoBlue)");
        } else {
            setAddStepButtonColor("#BFBFBF");
        }
    }, [addStepButtonColor]);

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
                    title={<strong>Test Script Steps</strong>}
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
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        {existingSteps.length
                            ? existingSteps.map((val, key) => {
                                return <ModifiableStep
                                    key={key}
                                    stepNumber={val.stepNumber}
                                    stepDescription={val.stepDescription}>
                                </ModifiableStep>
                            })
                            : <div className="no-steps-placeholder">
                                You haven't added any steps yet!
                            </div>}
                        <button
                            className="add-step-button"
                            onClick={handleAddStep}
                            disabled={addStepButtonDisabled}
                            style={{ backgroundColor: addStepButtonColor }}>
                            Add Step
                        </button>
                        <button
                            className="back-button"
                            onClick={handleGoBack}>
                            Back
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}