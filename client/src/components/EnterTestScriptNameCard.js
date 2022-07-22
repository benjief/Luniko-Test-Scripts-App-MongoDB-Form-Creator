import * as React from 'react';
import PropTypes from 'prop-types';
import { useValidationErrorUpdate } from '../pages/test_script_pages/Context/ValidationErrorContext';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import MaterialTextField from './MaterialTextField';
import SubmitButton from './SubmitButton';
import FadingBalls from 'react-cssfx-loading/lib/FadingBalls';
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
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value.trim() })
        );
    }

    return (
        <Card
            sx={{
                minHeight: "150px",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: "var(--lunikoDarkGrey)",
                marginBottom: "20px"
            }}>
            <div className="load-sheet-name-card-content">
                <CardHeader
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    title={<strong>Please enter a valid test script name</strong>} />
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <MaterialTextField
                            className="test-script-name"
                            label="Test Script Name"
                            inputValue={handleOnChange}
                            multiline={false}
                            required={false}
                            type="text"
                            authenticationField={true}
                            field={"testScriptName"}>
                        </MaterialTextField>
                        <SubmitButton
                        className={isDeletionForm ? "delete-test-script-button" : "submit-test-script-name-button"}
                       submitButtonText={isDeletionForm ? "Delete" : "Submit"}
                        isSubmitButtonDisabled={isSubmitButtonDisabled}
                        displayFadingBalls={displayFadingBalls}
                        handleOnClick={true}
                        handleOnClickFunction={requestTestScript}>   
                        </SubmitButton>
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
