import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import MaterialAlert from '../../../../components/MaterialAlert';
// import "../../../styles/CreateNewTestScript.css";

function ErrorWrapper({
    alert,
    alertMessage,
    handleAlertClosed,
    alertType,
}) {
    return (
        alert
            ? <div className="alert-container">
                <MaterialAlert
                    message={alertMessage.current}
                    closed={handleAlertClosed}
                    className={alertType.current}>
                </MaterialAlert>
                <div className="error-div"></div>
            </div>
            : <div></div>
    )
};

ErrorWrapper.propTypes = {
    alert: PropTypes.bool,
    alertMessage: PropTypes.string,
    handleAlertClosed: PropTypes.func,
    alertType: PropTypes.string,
};

export default ErrorWrapper;
