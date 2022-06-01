import PropTypes from 'prop-types';
import React from 'react';
import MaterialAlert from '../../../../components/MaterialAlert';

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
                    message={alertMessage}
                    closed={handleAlertClosed}
                    className={alertType}>
                </MaterialAlert>
                {/* <div className="error-div"></div> */}
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

ErrorWrapper.defaultProps = {
    alert: false,
    alertMessage: "",
    handleAlertClosed: () => { },
    alertType: "",
};

export default ErrorWrapper;
