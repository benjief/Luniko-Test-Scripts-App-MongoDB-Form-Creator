import PropTypes from "prop-types";
import React from "react"
import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

// const CREATE_VIEW = "CREATE_VIEW"

function CardWrapper({
    children,
    rendering,
    alert,
    isErrorThrown,
    isUserModifyingSteps,
    isUserRetrievingTestingSessions,
    isUserDeletingTestScript,
    doTestingSessionsExist,
    pageMessageOpacity,
    pageContentOpacity,
    testScriptName,
    isTestingSessionBeingDeleted,
    isStepBeingAddedOrRemoved,
}) {

    return (
        rendering || alert
            ? <div></div>
            : isErrorThrown
                ? <div></div> // TODO: test this!
                : <div className={isUserModifyingSteps
                    ? "add-or-modify-steps"
                    : isUserRetrievingTestingSessions
                        ? "view-test-script-testing-sessions"
                        : isUserDeletingTestScript
                            ? "delete-test-script"
                            : "create-or-modify-test-script"}>
                    <div
                        className="page-message"
                        style={{ opacity: pageMessageOpacity, transition: "0.5s" }}>
                        {isUserModifyingSteps
                            ? "Add or Modify Test Script Steps Below:"
                            : isUserDeletingTestScript
                                ? "Enter the Name of the Test Script to Delete Below:"
                                : isUserRetrievingTestingSessions
                                    ? doTestingSessionsExist
                                        ? `View Submitted Testing Sessions for ${testScriptName} Below:`
                                        : "No Submissions Yet!"
                                    : "Please Fill in the Fields Below:"}
                    </div>
                    {isUserRetrievingTestingSessions
                        ? <div className="view-test-script-testing-sessions-container"
                            style={{ opacity: pageContentOpacity, transition: "0.3s" }}>
                            {isTestingSessionBeingDeleted
                                ? < div className="fading-balls-container-testing-session-deletion">
                                    <FadingBalls
                                        className="spinner"
                                        color="var(--lunikoMidGrey)"
                                        width="12px"
                                        height="12px"
                                        duration="0.5s"
                                    />
                                </div>
                                : <div className="view-test-script-testing-sessions-card">
                                    {children}
                                </div>}
                        </div>
                        : isUserModifyingSteps
                            ? <div className="add-or-modify-steps-container"
                                style={{ opacity: pageContentOpacity, transition: "0.3s" }}>
                                {isStepBeingAddedOrRemoved
                                    ? < div className="fading-balls-container-testing-session-deletion">
                                        <FadingBalls
                                            className="spinner"
                                            color="var(--lunikoMidGrey)"
                                            width="12px"
                                            height="12px"
                                            duration="0.5s"
                                        />
                                    </div>
                                    : <div className="add-or-modify-steps-card">
                                        {children}
                                    </div>}
                            </div>
                            : <div className={isUserDeletingTestScript
                                ? "delete-test-script-container"
                                : "create-or-modify-test-script-container"}>
                                <div className={isUserDeletingTestScript
                                    ? "delete-test-script-card"
                                    : isUserRetrievingTestingSessions
                                        ? "view-test-script-testing-sessions-card"
                                        : "create-or-modify-test-script-card"}>
                                    {children}
                                </div>
                            </div>
                    }
                </div >
    )
};

// TODO: example prop types (document these elsewhere)
CardWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    rendering: PropTypes.bool,
    alert: PropTypes.bool,
    isErrorThrown: PropTypes.bool,
    isUserModifyingSteps: PropTypes.bool,
    isUserRetrievingTestingSessions: PropTypes.bool,
    isUserDeletingTestScript: PropTypes.bool,
    doTestingSessionsExist: PropTypes.bool,
    pageMessageOpacity: PropTypes.string,
    pageContentOpacity: PropTypes.string,
    testScriptName: PropTypes.string,
    isTestingSessionBeingDeleted: PropTypes.bool,
    isStepBeingAddedOrRemoved: PropTypes.bool,
    // isUserViewingTestingSessionDetails: PropTypes.bool,
    // setter: PropTypes.func,
    // myObject: PropTypes.shape({
    //     age: PropTypes.number
    // }),
    // arr: PropTypes.arrayOf(PropTypes.string),
    // somethingElse: PropTypes.oneOf([CREATE_VIEW, "Modify"])
}

CardWrapper.defaultProps = {
    rendering: false,
    alert: false,
    isErrorThrown: false,
    isUserModifyingSteps: false,
    isUserRetrievingTestingSessions: false,
    isUserDeletingTestScript: false,
    doTestingSessionsExist: false,
    pageMessageOpacity: "100%",
    pageContentOpacity: "100%",
    testScriptName: "",
    isTestingSessionBeingDeleted: false,
    isStepBeingAddedOrRemoved: false,
    // setter: null
}

export default CardWrapper;
