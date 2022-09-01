import * as React from 'react';
import PropTypes from 'prop-types';
import { useValidationErrorUpdate } from '../pages/TestScriptPages/Context/ValidationErrorContext';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import MaterialTextField from './MaterialTextField';
import SubmitButton from './SubmitButton';
import MaterialDialog from './MaterialDialog';

/**
 * Card that allows users to retrieve checklist information from the database by entering a valid load sheet name. Note that the validity of a load sheet name is determined by the page that contains this card.
 * @returns said card.
 */
function EnterTestScriptNameCard({
    setFormProps, // function to handle setting form props
    requestTestScript, // function to handle the user requesting a test script
    isSubmitButtonDisabled, // whether or not the submit button is disabled
    isDeletionForm, // whether or not this card is being used in a test script deletion form
    displayFadingBalls, // whether or not fading balls are displayed (to indicate that the page is writing checklist information)
}) {
    const expanded = true;
    const invalidTestScriptNameError = useValidationErrorUpdate(); // context variable

    /**
     * Handles changes to a card field (form prop). The corresponding field (form prop) in the page housing this card is updated with the value entered. Note that because we're dealing with test script names here, we need to eliminate any white space from the user-entered string and make it lower case. This allows the string to be properly compared to test script names that already exist in the database on the page containing this card (i.e. all the strings being compared to are lower case and don't contain any outside white space).
     * @param {object} returnedObject - the object containing the field to be updated and the value to which that field should be updated.
     */
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
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            {/* This component uses a Material Dialog if it is being used in a deletion form. This is to warn users that deletion is irreversible. */}
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
