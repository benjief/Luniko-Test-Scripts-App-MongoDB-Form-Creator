import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import '../styles/DialogComponents.css';

function MaterialImageDialog({
    imageSource,
}) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <span
            className="image-dialog-container"> {/* TODO: remove unnecessary className attributes */}
            <button
                className="image-dialog-button"
                onClick={handleClickOpen}>
                <img src={require("../img/img_icon_orange.png")} alt="camera icon"/>
            </button>
            <Dialog
                className="image-dialog"
                open={open}
                onClose={handleClose}
            >
                <DialogContent>
                    <img className="image-dialog-content" src={imageSource} alt="dialog"/>
                </DialogContent>
            </Dialog>
        </span>
    );
}

MaterialImageDialog.propTypes = {
    imageSource: PropTypes.string,
}

MaterialImageDialog.defaultProps = {
    imageSource: "",
}

export default  MaterialImageDialog;
