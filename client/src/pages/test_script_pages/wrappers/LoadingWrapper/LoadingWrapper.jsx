import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import NavBar from '../../../../components/Navbar';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
// import "../../../styles/TestScriptTestingPage.css";

function LoadingWrapper({
    // children,
    rendering,
    transitionElementOpacity,
    transitionElementVisibility,
    // activeError,
    // alert,
    // isValidTestScriptNameEntered,
    // isUserCurrentlyTesting,
}) {
    return (
        <Fragment>
            <div
                className={rendering ? "loading-spinner" : "transition-element"}
                style={{ opacity: rendering ? "100%" : transitionElementOpacity, visibility: rendering ? "visible" : transitionElementVisibility }}>
                {rendering
                    ? <Hypnosis
                        className="spinner"
                        color="var(--lunikoOrange)"
                        width="100px"
                        height="100px"
                        duration="1.5s" />
                    : <div></div>}
            </div >
            <NavBar></NavBar>
        </Fragment>
    )
};

LoadingWrapper.propTypes = {
    // children: PropTypes.node.isRequired,
    rendering: PropTypes.bool,
    transitionElementOpacity: PropTypes.string,
    transitionElementVisibility: PropTypes.string,
};

export default LoadingWrapper;
