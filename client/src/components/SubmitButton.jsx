import PropTypes from 'prop-types';
import React from 'react';
import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

function SubmitButton({
    isSubmitButtonDisabled,
    displayFadingBalls,
    handleOnClick,
    handleOnClickFunction,
}) {
    return (
        <button
            className="submit-test-script-button"
            disabled={isSubmitButtonDisabled}
            onClick={handleOnClick ? handleOnClickFunction : undefined}>
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
    )
};

SubmitButton.propTypes = {
    isSubmitButtonDisabled: PropTypes.bool,
    displayFadingBalls: PropTypes.bool,
    handleOnClick: PropTypes.bool,
    handleOnClickFunction: PropTypes.func,
};

SubmitButton.defaultProps = {
    isSubmitButtonDisabled: true,
    displayFadingBalls: false,
    handleOnClick: false,
    handleOnClickFunction: () => { }
};

export default SubmitButton;
