import * as React from 'react';
import PropTypes from 'prop-types';
import { useValidationErrorUpdate } from '../pages/test_script_pages/Context/ValidationErrorContext';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import MaterialTextField from './MaterialTextField';
import SubmitButton from './SubmitButton';
import MaterialDialog from './MaterialDialog';
function EnterTestScriptNameCard({
    setFormProps,
    requestTestScript,
    isSubmitButtonDisabled,
    isDeletionForm,
    displayFadingBalls,
}) {
    const expanded = true;
    const invalidTestScriptNameError = useValidationErrorUpdate();

    const handleOnChange = (returnedObject) => {
        invalidTestScriptNameError("");
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value.trim().toLowerCase() })
        );
    }

    return (
        <div>
            <Card
                sx={{
                    minHeight: "150px",
                    overflowY: "scroll",
                    borderRadius: "10px",
                    boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                    transition: "0.5s",
                    backgroundColor: "var(--lunikoMidGrey)",
                    marginBottom: "20px"
                }}>

                <div>
                    <CardHeader
                        titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", textAlign: "center" }}
                        title={<strong>Please enter a valid test script name</strong>} />
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <MaterialTextField
                                className="test-script-name"
                                label="Test Script Name"
                                inputValue={handleOnChange}
                                type="text"
                                authenticationField={true}
                                field={"testScriptName"}>
                            </MaterialTextField>
                            {/* <SubmitButton
                            className={isDeletionForm ? "delete-test-script-button" : "submit-test-script-name-button"}
                            submitButtonText={isDeletionForm ? "Delete" : "Submit"}
                            isSubmitButtonDisabled={isSubmitButtonDisabled}
                            displayFadingBalls={displayFadingBalls}
                            handleOnClick={true}
                            handleOnClickFunction={requestTestScript}>
                        </SubmitButton> */}
                            {/* <button
                            className={isDeletionForm ? "delete-test-script-button" : "submit-test-script-name-button"}
                            onClick={requestTestScript}
                            disabled={isSubmitButtonDisabled}>
                            {displayFadingBalls
                                ? <div className="fading-balls-container">
                                    <FadingBalls
                                        className="spinner"
                                        color="white"
                                        width="9px"
                                        height="9px"
                                        duration="0.5s"
                                    />
                                </div>
                                : isDeletionForm
                                    ? "Delete"
                                    : "Submit"}
                        </button> */}
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            {isDeletionForm
                ? <MaterialDialog
                    className="material-dialog-delete"
                    isDialogDisabled={isSubmitButtonDisabled}
                    exteriorButton={
                        <SubmitButton
                            className={isDeletionForm ? "delete-test-script-button" : "submit-test-script-name-button"}
                            submitButtonText={isDeletionForm ? "Delete" : "Submit"}
                            isSubmitButtonDisabled={isSubmitButtonDisabled}
                            displayFadingBalls={displayFadingBalls}
                                        /*handleOnClick={true}
                                        handleOnClickFunction={requestTestScript}*/>
                        </SubmitButton>
                    }
                    inactiveButtonText="Cancel"
                    displayActiveButton={true}
                    activeButtonFunction={requestTestScript}
                    activeButtonText="Delete"
                    dialogDescription={<p>Are you sure you want to permanently delete this test script? This action cannot be undone.</p>}>
                </MaterialDialog>
                : <SubmitButton
                    className="submit-test-script-name-button"
                    submitButtonText="Submit"
                    isSubmitButtonDisabled={isSubmitButtonDisabled}
                    displayFadingBalls={displayFadingBalls}
                    handleOnClick={true}
                    handleOnClickFunction={requestTestScript}>
                </SubmitButton>}
        </div>
    );
}

EnterTestScriptNameCard.propTypes = {
    setFormProps: PropTypes.func,
    requestTestScript: PropTypes.func,
    isSubmitButtonDisabled: PropTypes.bool,
    isDeletionForm: PropTypes.bool,
    displayFadingBalls: PropTypes.bool,
}

EnterTestScriptNameCard.defaultProps = {
    setFormProps: () => { },
    requestTestScript: () => { },
    isSubmitButtonDisabled: true,
    isDeletionForm: false,
    displayFadingBalls: false,
}

export default EnterTestScriptNameCard;
