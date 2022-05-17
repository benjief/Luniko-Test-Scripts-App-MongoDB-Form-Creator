import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MaterialTextField({
  field = "",
  className = "",
  label = "",
  helperText = "",
  characterLimit = 500,
  placeholder = "",
  defaultValue = "",
  inputValue = "",
  multiline = false,
  type = "text",
  required = false,
  showCharCounter = false,
  // limitRangeOfInputs = false,
  requiresValidation = false,
  isValidationCaseSensitive = true,
  invalidInputs = [],
  invalidInputMsg = "",
  maxValue = Number.MAX_SAFE_INTEGER,
  minValue = Number.MIN_SAFE_INTEGER,
  negativeNumbersAllowed = true,
  zerosAllowed = true,
  fractionsAllowed = true,
  authenticationField = false,
  textAuthenticationError = "",
  disabled = false,
  forceErrorOff = false
}) {
  const [value, setValue] = React.useState(defaultValue);
  const [errorEnabled, setErrorEnabled] = React.useState(false);
  // const [errorMsg, setErrorMsg] = React.useState("");
  const [displayedHelperText, setDisplayedHelperText] = React.useState(helperText);
  const [inputLength, setInputLength] = React.useState(type !== "number" ? defaultValue.length : 0);
  // const [firstRender, setFirstRender] = React.useState(true);

  const handleOnChange = (value) => {
    if (value.trim() !== "") {
      if (type === "text" && requiresValidation) {
        checkInputValidity(value);
      } else if (type === "email") {
        checkEmailValidity(value);
      } else if (type === "password" && requiresValidation) {
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

  const checkInputValidity = (input) => {
    input = isValidationCaseSensitive ? input : input.toLowerCase();
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
    // setValue(null);
    setValue(number);
    inputValue({ field: field, value: number });
    setDisplayedHelperText(helperText);
    setErrorEnabled(true);
  }

  const handleEmptyValue = (value) => {
    setValue("");
    inputValue({ field: field, value: "" });
    if (showCharCounter && value) {
      setInputLength(value.length);
    }
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
      if (textAuthenticationError !== "") {
        setErrorEnabled(true);
        setDisplayedHelperText(textAuthenticationError);
      } else {
        if (value.trim() !== "" || authenticationField) {
          setErrorEnabled(false);
          setDisplayedHelperText("");
        }
      }
    }
  }, [authenticationField, textAuthenticationError, errorEnabled, value]) // TODO: check need for firstRender

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
          // onKeyDown={(evt) => {
          //   if (type === "number") {
          //     ["e", "E"].includes(evt.key) && evt.preventDefault()
          //   }
          //   type === "number"
          //     ? ["e", "E"].includes(evt.key) && evt.preventDefault() : "null";
          // }}
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