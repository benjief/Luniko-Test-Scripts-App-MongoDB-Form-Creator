import PropTypes from 'prop-types';
import React from 'react'

// const CREATE_VIEW = 'CREATE_VIEW'

function CardWrapper({
    children,
    rendering,
    isErrorThrown,
    isUserModifyingSteps,
}) {

    return (
        rendering
            ? <div></div>
            : isErrorThrown
                ? <div></div> // TODO: test this!
                : <div className={isUserModifyingSteps ? "create-or-modify-test-script" : "add-or-modify-steps"}>
                    <div className="page-message">
                        {isUserModifyingSteps
                            ? "Add or Modify Test Script Steps Below:"
                            : "Please Fill Out the Fields Below:"}
                    </div>
                    <div className={isUserModifyingSteps ? "add-or-modify-steps-container" : "create-or-modify-test-script-container"}>
                        <div className={isUserModifyingSteps ? "add-or-modify-steps-card" : "create-or-modify-test-script-card"}>
                            {children}
                        </div>
                    </div>
                </div >
    )
};

// TODO: example prop types (document these elsewhere)
CardWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    rendering: PropTypes.bool,
    isErrorThrown: PropTypes.bool,
    isUserModifyingSteps: PropTypes.bool,
    // setter: PropTypes.func,
    // myObject: PropTypes.shape({
    //     age: PropTypes.number
    // }),
    // arr: PropTypes.arrayOf(PropTypes.string),
    // somethingElse: PropTypes.oneOf([CREATE_VIEW, 'Modify'])
}

CardWrapper.defaultProps = {
    rendering: false,
    isErrorThrown: false,
    isUserModifyingSteps: false,
    // setter: null
}

export default CardWrapper;
