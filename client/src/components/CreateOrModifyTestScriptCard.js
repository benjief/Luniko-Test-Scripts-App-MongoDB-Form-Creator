import * as React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import MaterialTextField from './MaterialTextField';
import SubmitButton from './SubmitButton';
function CreateOrModifyTestScriptCard({
    setFormProps,
    isModificationCard,
    existingTestScriptName,
    invalidTestScriptNames,
    existingTestScriptDescription,
    existingTestScriptPrimaryWorkstream,
    existingOwnerFirstName,
    existingOwnerLastName,
    handleTransitionToStepsPage,
    isAddOrModifyStepsButtonDisabled,
    submitOrModifyTestScript,
    isSubmitOrModifyButtonDisabled,
    isCancelButtonDisabled,
    displayFadingBalls,
}) {

    const handleOnChange = (returnedObject) => {
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
    }

    return (
        <div>
            <Card
                sx={{
                    height: "calc(100vh - 336.52px)",
                    overflowY: "scroll",
                    borderRadius: "10px",
                    boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                    transition: "0.5s",
                    backgroundColor: "var(--lunikoMidGrey)",
                    marginBottom: "20px"
                }}>
                <div className="card-content">
                    <CardHeader
                        titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", textAlign: "center" }}
                        title={<strong>Test Script Form</strong>} />
                    <Collapse in={true} timeout="auto" unmountOnExit>
                        <CardContent>
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
                                isTextValidationCaseSensitive={false}
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
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            <button
                className="add-or-modify-steps-button"
                onClick={handleTransitionToStepsPage}
                disabled={isAddOrModifyStepsButtonDisabled}>
                Add/Modify Steps
            </button>
            <SubmitButton
                className={"submit-or-update-test-script-button"}
                submitButtonText={isModificationCard ? "Update" : "Submit"}
                displayFadingBalls={displayFadingBalls}
                handleOnClick={true}
                handleOnClickFunction={submitOrModifyTestScript}
                isSubmitButtonDisabled={isSubmitOrModifyButtonDisabled}>
            </SubmitButton>
            <Link to={`/`}>
                <button
                    className="cancel-button"
                    disabled={isCancelButtonDisabled}>
                    Cancel
                </button>
            </Link>
        </div>
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
    submitOrModifyTestScript: PropTypes.func,
    isSubmitOrModifyButtonDisabled: PropTypes.bool,
    isCancelButtonDisabled: PropTypes.bool,
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
    submitOrModifyTestScript: () => { },
    isSubmitOrModifyButtonDisabled: true,
    isCancelButtonDisabled: false,
    displayFadingBalls: false,
}

export default CreateOrModifyTestScriptCard;
