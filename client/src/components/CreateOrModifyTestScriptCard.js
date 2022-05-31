import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
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

function CreateOrModifyTestScriptCard({
    setFormProps,
    isModificationCard,
    existingTestScriptName,
    invalidTestScriptNames, // TODO: be careful with this and the above prop
    existingTestScriptDescription,
    existingTestScriptPrimaryWorkstream,
    existingOwnerFirstName,
    existingOwnerLastName,
    // ownerEmail = "",
    // submittedOwnerEmail = "",
    handleTransitionToStepsPage,
    isAddOrModifyStepsButtonDisabled,
    modifyTestScript,
    submitTestScript,
    isSubmitOrModifyButtonDisabled,
    displayFadingBalls,
}) {
    // const [expanded, setExpanded] = React.useState(true);
    // const [submitButtonColor, setSubmitButtonColor] = React.useState("#BFBFBF");

    const handleOnChange = (returnedObject) => {
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
    }

    React.useEffect(() => {
        console.log(invalidTestScriptNames);
    }, [invalidTestScriptNames]);

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
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <CardContent>
                        {/* <Typography
                        paragraph>
                        <strong>Updatable Fields</strong>
                    </Typography> */}
                        <MaterialTextField
                            label="Test Script Name"
                            disabled={isModificationCard}
                            characterLimit={100}
                            placeholder="Test Script Name"
                            defaultValue={existingTestScriptName}
                            inputValue={handleOnChange}
                            multiline={false}
                            required={true}
                            showCharCounter={isModificationCard ? false : true}
                            requiresTextValidation={true}
                            isValidationCaseSensitive={false}
                            invalidInputs={invalidTestScriptNames}
                            invalidInputMsg="Test script name already exists"
                            field="testScriptName" >
                        </MaterialTextField>
                        <MaterialTextField
                            className="test-script-description"
                            label="Test Script Description"
                            characterLimit={1000}
                            placeholder="Test Script Description"
                            defaultValue={existingTestScriptDescription}
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
                            defaultValue={existingTestScriptPrimaryWorkstream}
                            inputValue={handleOnChange}
                            multiline={false}
                            required={true}
                            showCharCounter={true}
                            field="testScriptPrimaryWorkstream" >
                        </MaterialTextField>
                        <MaterialTextField
                            label="Owner First Name"
                            placeholder="Owner First Name"
                            defaultValue={existingOwnerFirstName}
                            inputValue={handleOnChange}
                            multiline={false}
                            required={true}
                            showCharCounter={false}
                            field="ownerFirstName" >
                        </MaterialTextField>
                        <MaterialTextField
                            label="Owner Last Name"
                            placeholder="Owner Last Name"
                            defaultValue={existingOwnerLastName}
                            inputValue={handleOnChange}
                            multiline={false}
                            required={true}
                            showCharCounter={false}
                            field="ownerLastName" >
                        </MaterialTextField>
                        {/* <MaterialTextField
                            label="Email"
                            placeholder="Owner Email"
                            type="email"
                            inputValue={handleOnChange}
                            multiline={false}
                            required={true}
                            showCharCounter={false}
                            field="ownerEmail" >
                        </MaterialTextField> */}
                        <button
                            className="add-or-modify-steps-button"
                            onClick={handleTransitionToStepsPage}
                            disabled={isAddOrModifyStepsButtonDisabled}>
                            Add/Modify Steps
                        </button>
                        <button
                            className="submit-or-update-test-script-button"
                            onClick={isModificationCard ? modifyTestScript : submitTestScript}
                            disabled={isSubmitOrModifyButtonDisabled}
                            /*style={{ backgroundColor: submitButtonColor }}*/>
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
                                <p>{isModificationCard ? "Update" : "Submit"}</p>}
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}

CreateOrModifyTestScriptCard.propTypes = {
    setFormProps: PropTypes.func,
    isModificationCard: PropTypes.bool,
    existingTestScriptName: PropTypes.string,
    invalidTestScriptNames: PropTypes.array,
    existingTestScriptDescription: PropTypes.string,
    existingTestScriptPrimaryWorkstream: PropTypes.string,
    existingOwnerFirstName: PropTypes.string,
    existingOwnerLastName: PropTypes.string,
    handleTransitionToStepsPage: PropTypes.func,
    isAddOrModifyStepsButtonDisabled: PropTypes.bool,
    modifyTestScript: PropTypes.func,
    submitTestScript: PropTypes.func,
    isSubmitOrModifyButtonDisabled: PropTypes.bool,
    displayFadingBalls: PropTypes.bool,
}

CreateOrModifyTestScriptCard.defaultProps = {
    setFormProps: () => { },
    isModificationCard: false,
    existingTestScriptName: "",
    invalidTestScriptNames: [],
    existingTestScriptDescription: "",
    existingTestScriptPrimaryWorkstream: "",
    existingOwnerFirstName: "",
    existingOwnerLastName: "",
    handleTransitionToStepsPage: () => { },
    isAddOrModifyStepsButtonDisabled: false,
    modifyTestScript: () => { },
    submitTestScript: () => { },
    isSubmitOrModifyButtonDisabled: true,
    displayFadingBalls: false,
}

export default CreateOrModifyTestScriptCard;
