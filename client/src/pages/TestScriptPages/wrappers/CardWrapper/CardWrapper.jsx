import PropTypes from "prop-types";
import React from "react"
import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

// TODO: study this - const CREATE_VIEW = "CREATE_VIEW"

/**
 * Component that structures this application's test script-related pages (i.e. CreateOrModifyTestScript.js, DeleteTestScript.js and RetrieveTestScriptTestingSessions.js).
 * @returns said component.
 */
function CardWrapper({
    children, // components to be displayed within the structured divs below
    rendering, // whether or not the page is rendering
    alert, // whether or not an alert is being displayed on the page
    isErrorThrown, // whether or not an error has been thrown on the page
    isUserModifyingSteps, // whether or not the user is currently modifying steps
    isUserRetrievingTestingSessions, // whether or not the user is currently retrieving testing sessions for a test script
    isUserDeletingTestScript, // whether or not the user is currently deleting a test script
    doTestingSessionsExist, // whether or not any testing sessions have been submitted for a particular test script
    pageMessageOpacity, // opacity of the page message (sits at the top of the page)
    pageContentOpacity, // opacity of the page content (sits below the page message)
    testScriptName, // name of the test script for which testing sessions have been retrieved
    isTestingSessionBeingDeleted, // whether or not a testing session is currently being removed from the database (triggers a change in page content)
    isStepBeingAddedOrRemoved, // whether or not a step is currently being added or removed from a test script (triggers a change in page content)
}) {
    return (
        rendering || alert
            ? <div></div>
            : isErrorThrown
                ? <div></div>
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
    // TODO: the code below is for future reference - document it somewhere
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
