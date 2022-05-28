import PropTypes from 'prop-types';
import React from 'react'
import "../../../styles/CreateNewTestScript.css";

const CREATE_VIEW = 'CREATE_VIEW'

function PageWrapper({ children, isAddingSteps }) {

    return (
        <div className={isAddingSteps ? 'create-or-modify-test-script' : 'add-or-modify-steps'}>
            <div className="page-message">
                {isAddingSteps ? 'Add/Modify Test Script Steps Below:' : 'Please Fill Out/Modify the Fields Below:'}
            </div>
            {children}
        </div>
    )
}

// Example prop types
PageWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    isAddingSteps: PropTypes.bool,
    // setter: PropTypes.func,
    // myObject: PropTypes.shape({
    //     age: PropTypes.number
    // }),
    // arr: PropTypes.arrayOf(PropTypes.string),
    // somethingElse: PropTypes.oneOf([CREATE_VIEW, 'Modify'])
}

PageWrapper.defaultProps = {
    isAddingSteps: false,
    // setter: null
}


export default PageWrapper


