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
// import MaterialSingleSelect from './MaterialSingleSelect';
// import MaterialSingleSelectFreeSolo from './MaterialSingleSelectFreeSolo';
import MaterialTextField from './MaterialTextField';
// import MaterialMultiSelect from './MaterialMultiSelect';
// import MaterialMultiSelectFreeSolo from './MaterialMultiSelectFreeSolo';
// import MaterialCheckBox from './MaterialCheckBox';
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

export default function CreateOrEditTestScriptCard({
    testScriptName = "",
    submittedTestScriptName = "",
    invalidTestScriptNames = [], // TODO: be careful with this and the above prop
    testScriptDescription = "",
    submittedTestScriptDescription = "",
    testScriptPrimaryWorkstream = "",
    submittedTestScriptPrimaryWorkstream = "",
    ownerFirstName = "",
    submittedOwnerFirstName = "",
    ownerLastName = "",
    submittedOwnerLastName = "",
    ownerEmail = "",
    submittedOwnerEmail = "",
    submitted = false,
    submitButtonDisabled = true,
    displayFadingBalls = false
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [submitButtonColor, setSubmitButtonColor] = React.useState("#BFBFBF");

    const handleOnChange = (returnedObject) => {
        const objectToReturn = { value: returnedObject.value, field: returnedObject.field };
        const stringFunction = returnedObject.field + "(objectToReturn)";
        eval(stringFunction);
    }

    const handleSubmit = () => {
        submitted(true);
    }

    React.useEffect(() => {
        if (!submitButtonDisabled) {
            setSubmitButtonColor("var(--lunikoBlue)");
        } else {
            setSubmitButtonColor("#BFBFBF");
        }
    }, [submitButtonDisabled]);

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
                backgroundColor: "var(--lunikoOrange)",
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
                    title={<strong>Test Script Form</strong>}
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
                        {/* <Typography
                        paragraph>
                        <strong>Updatable Fields</strong>
                    </Typography> */}
                        <MaterialTextField
                            label="Test Script Name"
                            characterLimit={100}
                            placeholder="Test Script Name"
                            inputValue={handleOnChange} // TODO
                            multiline={false}
                            required={true}
                            showCharCounter={true}
                            requiresValidation={true}
                            invalidInputs={invalidTestScriptNames}
                            invalidInputMsg="Test script name already exists"
                            field="testScriptName" >
                        </MaterialTextField>
                        <MaterialTextField
                            className="test-script-description"
                            label="Test Script Description"
                            characterLimit={1000}
                            placeholder="Test Script Description"
                            inputValue={handleOnChange}
                            multiline={true}
                            required={true}
                            showCharCounter={true}
                            field="testScriptDescription" >
                        </MaterialTextField>
                        <MaterialTextField
                            label="Primary Workstream"
                            characterLimit={100}
                            placeholder="Primary Workstream"
                            inputValue={handleOnChange}
                            multiline={false}
                            required={true}
                            showCharCounter={true}
                            field="testScriptPrimaryWorkstream" >
                        </MaterialTextField>
                        <MaterialTextField
                            label="Owner First Name"
                            placeholder="Owner First Name"
                            inputValue={handleOnChange}
                            multiline={false}
                            required={true}
                            showCharCounter={false}
                            field="ownerFirstName" >
                        </MaterialTextField>
                        <MaterialTextField
                            label="Owner Last Name"
                            placeholder="Owner Last Name"
                            inputValue={handleOnChange}
                            multiline={false}
                            required={true}
                            showCharCounter={false}
                            field="ownerLastName" >
                        </MaterialTextField>
                        <MaterialTextField
                            label="Email"
                            placeholder="Owner Email"
                            type="email"
                            inputValue={handleOnChange}
                            multiline={false}
                            required={true}
                            showCharCounter={false}
                            field="ownerEmail" >
                        </MaterialTextField>
                        <button
                            className="submit-test-script-button"
                            onClick={handleSubmit}
                            disabled={submitButtonDisabled}
                            style={{ backgroundColor: submitButtonColor }}>
                            {displayFadingBalls ?
                                <div className="fading-balls-container">
                                    <FadingBalls
                                        className="spinner"
                                        color="white"
                                        width="7px"
                                        height="7px"
                                        duration="0.5s"
                                    />
                                </div> :
                                <p>Submit</p>}
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}