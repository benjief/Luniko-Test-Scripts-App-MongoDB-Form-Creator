import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import '../styles/DialogComponents.css';

function MaterialImageDialog({
    imageSource,
}) {
    const [open, setOpen] = React.useState(false);
    const [rendering, setRendering] = React.useState(true);

    const handleClickOpen = () => {
        setOpen(true);
        setTimeout(() => {
            setRendering(false);
        }, 300);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setRendering(true);
        }, 100);
    };

    return (
        <span
            className="image-dialog-container"> {/* TODO: remove unnecessary className attributes */}
            <button
                className="image-dialog-button"
                onClick={handleClickOpen}>
                <img src={require("../img/img_icon_orange.png")} alt="camera icon" />
            </button>
            <Dialog
                className="image-dialog"
                open={open}
                onClose={handleClose}
            >
                <DialogContent>
                    {rendering
                        ? <Hypnosis
                                className="spinner"
                                color="var(--lunikoOrange)"
                                width="100px"
                                height="100px"
                                duration="1.5s" />
                        : <img className="image-dialog-content" src={imageSource} alt="dialog" />
                    }
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

export default MaterialImageDialog;
