import * as React from 'react';
import { useValidationError } from '../pages/test_script_pages/Context/ValidationErrorContext';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function MaterialTextField({
  field,
  className,
  label,
  helperText,
  characterLimit,
  placeholder,
  defaultValue,
  inputValue,
  multiline,
  type,
  required,
  showCharCounter,
  requiresTextValidation,
  isTextValidationCaseSensitive,
  invalidInputs,
  invalidInputMsg,
  authenticationField,
  minValue,
  maxValue,
  negativeNumbersAllowed,
  zerosAllowed,
  fractionsAllowed,
  disabled = false,
}) {
  const [value, setValue] = React.useState(defaultValue);
  const [errorEnabled, setErrorEnabled] = React.useState(false);
  const [displayedHelperText, setDisplayedHelperText] = React.useState(helperText);
  const [inputLength, setInputLength] = React.useState(type !== "number" ? defaultValue.length : 0);
  const authenticationError = useValidationError();

  const handleOnChange = (value) => {
    if (value.trim() !== "") {
      if (type === "text" && requiresTextValidation) {
        checkTextInputValidity(value);
      } else if (type === "email") {
        checkEmailValidity(value);
      } else if (type === "password" && requiresTextValidation) {
        checkPasswordValidity(value);
      } else if (type === "number") {
        checkNumberValidity(parseInt(value));
      } else {
        handleValidValue(value);
      }
    } else {
      if (required) {
        setDisplayedHelperText("Required Field");
      }
      handleEmptyValue(value);
    }
  }

  const handleOnBlur = () => {
    if (required && value === "") {
      setErrorEnabled(true);
      setDisplayedHelperText("Required Field");
    }
  }

  const checkTextInputValidity = (input) => {
    input = isTextValidationCaseSensitive ? input : input.toLowerCase();
    if (invalidInputs.includes(input)) {
      invalidInputMsg === ""
        ? setDisplayedHelperText("Invalid input")
        : setDisplayedHelperText(invalidInputMsg);
      handleEmptyValue(input);
    } else {
      handleValidValue(input);
    }
  }

  const checkEmailValidity = (email) => {
    if (email.match(/[^@]+@[^@]+\.+[^@]/)) {
      handleValidValue(email);
    } else {
      setDisplayedHelperText("Please enter a valid email address");
      handleEmptyValue(email);
    }
  }

  const checkPasswordValidity = (password) => {
    if (password.length > 5) {
      handleValidValue(password);
    } else {
      setDisplayedHelperText("Passwords must be at least 6 characters long");
      handleEmptyValue(password);
    }
  }

  const checkNumberValidity = (number) => {
    if (!negativeNumbersAllowed && number < 0) {
      handleInvalidNumber(number, "Negative numbers aren't allowed");
    } else if (number === 0 && !zerosAllowed) {
      handleInvalidNumber(number, "Number must be > 0");
    } else if (number > maxValue) {
      handleInvalidNumber(number, "Number too high");
    } else if (number < minValue) {
      handleInvalidNumber(number, "Number too low");
    } else {
      handleValidValue(number);
    }
  }

  const handleInvalidNumber = (number, helperText) => {
    setValue(number);
    inputValue({ field: field, value: number });
    setDisplayedHelperText(helperText);
    setErrorEnabled(true);
  }

  const handleEmptyValue = (value) => {
    setValue(value);
    inputValue({ field: field, value: "" });
    // if (showCharCounter && value) {
    setInputLength(0); // TODO: test this - seems to work in specific data inputted by user scenario, but not sure about other text fields
    // }
    if (required) {
      setErrorEnabled(true);
    }
  }

  const handleValidValue = (value) => {
    setValue(value);
    inputValue({ field: field, value: value });
    if (showCharCounter) {
      setInputLength(value.length);
    }
    setErrorEnabled(false);
    setDisplayedHelperText(helperText);
  }

  React.useEffect(() => {
    if (authenticationField) {
      if (authenticationError.length) {
        setErrorEnabled(true);
        setDisplayedHelperText(authenticationError);
      } else {
        setErrorEnabled(false);
        setDisplayedHelperText("");
        // }
      }
    }
  }, [authenticationField, authenticationError, errorEnabled, value]) // TODO: check need for firstRender

  return (
    <Box
      onSubmit={event => { event.preventDefault(); }}
      className={className}
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off">
      <div className="material-text-field">
        <TextField
          onKeyDown={(evt) => { // TODO: make this a separate function
            if (type === "number") {
              if (["e", "E"].includes(evt.key)) {
                evt.preventDefault();
              }
              if (!fractionsAllowed) {
                if (["."].includes(evt.key)) {
                  evt.preventDefault();
                }
              }
            }
          }}
          label={label}
          defaultValue={defaultValue}
          type={type}
          onChange={(event) => handleOnChange(event.target.value)}
          onBlur={(event) => handleOnBlur(event.target.value)}
          multiline={multiline}
          error={errorEnabled}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          inputProps={{
            maxLength: characterLimit
          }}
          helperText={showCharCounter ? !errorEnabled ? displayedHelperText !== ""
            ? [displayedHelperText, ". Limit: ", inputLength, "/", characterLimit] : ["Limit: ", inputLength, "/", characterLimit]
            : displayedHelperText
            : displayedHelperText} />
      </div>
    </Box>
  );
}

MaterialTextField.propTypes = {
  field: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  characterLimit: PropTypes.number,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  inputValue: PropTypes.func,
  multiline: PropTypes.bool,
  type: PropTypes.string,
  required: PropTypes.bool,
  showCharCounter: PropTypes.bool,
  requiresTextValidation: PropTypes.bool,
  isValidationCaseSensitive: PropTypes.bool,
  invalidInputs: PropTypes.array,
  invalidInputMsg: PropTypes.string,
  authenticationField: PropTypes.bool,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  negativeNumbersAllowed: PropTypes.bool,
  zerosAllowed: PropTypes.bool,
  fractionsAllowed: PropTypes.bool,
  disabled: PropTypes.bool,
}

MaterialTextField.defaultProps = {
  field: "",
  className: "",
  label: "",
  helperText: "",
  characterLimit: 500,
  placeholder: "",
  defaultValue: "",
  inputValue: () => { },
  multiline: false,
  type: "text",
  required: false,
  showCharCounter: false,
  requiresTextValidation: false,
  isTextValidationCaseSensitive: true,
  invalidInputs: [],
  invalidInputMsg: "",
  authenticationField: false,
  minValue: Number.MIN_SAFE_INTEGER,
  maxValue: Number.MAX_SAFE_INTEGER,
  negativeNumbersAllowed: true,
  zerosAllowed: true,
  fractionsAllowed: true,
  disabled: false,
}

export default MaterialTextField;
