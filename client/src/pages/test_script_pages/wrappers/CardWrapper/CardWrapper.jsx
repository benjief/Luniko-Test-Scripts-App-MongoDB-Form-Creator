import PropTypes from 'prop-types';
import React from 'react'

// const CREATE_VIEW = 'CREATE_VIEW'

function CardWrapper({
    children,
    rendering,
    isErrorThrown,
    isUserModifyingSteps,
    isUserRetrievingTestingSessions,
    doTestingSessionsExist,
    isUserViewingTestingSessionDetails,
}) {

    return (
        rendering
            ? <div></div>
            : isErrorThrown
                ? <div></div> // TODO: test this!
                : <div className={isUserModifyingSteps
                    ? "create-or-modify-test-script"
                    : isUserRetrievingTestingSessions
                        ? "view-test-script-testing-sessions"
                        : isUserViewingTestingSessionDetails
                            ? "view-testing-session-details"
                            : "add-or-modify-steps"}>
                    <div className="page-message">
                        {isUserModifyingSteps
                            ? "Add or Modify Test Script Steps Below:"
                            : isUserRetrievingTestingSessions
                                ? doTestingSessionsExist
                                    ? "View Submitted Testing Sessions Below:"
                                    : "No Submissions Yet!"
                                : isUserViewingTestingSessionDetails
                                    ? "Review Testing Session Details Below"
                                    : "Please Fill in the Fields Below:"}
                    </div>
                    <div className={isUserModifyingSteps
                        ? "add-or-modify-steps-container" :
                        isUserRetrievingTestingSessions
                            ? "view-test-script-testing-sessions-container"
                            : isUserViewingTestingSessionDetails
                                ? "view-testing-session-details-container"
                                : "create-or-modify-test-script-container"}>
                        <div className={isUserModifyingSteps
                            ? "add-or-modify-steps-card"
                            : isUserRetrievingTestingSessions
                                ? "view-test-script-testing-sessions-card"
                                : isUserViewingTestingSessionDetails
                                    ? "view-testing-session-details-card"
                                    : "create-or-modify-test-script-card"}>
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
    isUserRetrievingTestingSessions: PropTypes.bool,
    doTestingSessionsExist: PropTypes.bool,
    isUserViewingTestingSessionDetails: PropTypes.bool,
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
    isUserRetrievingTestingSessions: false,
    doTestingSessionsExist: false,
    isUserViewingTestingSessionDetails: false,
    // setter: null
}

export default CardWrapper;
