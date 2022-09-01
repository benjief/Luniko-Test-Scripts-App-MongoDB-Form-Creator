import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import '../styles/DialogComponents.css';

/**
 * Dialog button/popup combination, used specifically for displaying images. Customized from the original Material UI component that can be found here: https://mui.com/material-ui/react-dialog/.
 * @returns said dialog.
 */
function MaterialImageDialog({
    imageSource, // image source path
}) {
    const [open, setOpen] = React.useState(false);
    const [rendering, setRendering] = React.useState(true);
    const [imageOpacity, setImageOpacity] = React.useState("0%");
    const [imageVisibility, setImageVisibility] = React.useState("hidden");

    /**
     * Prevents the image from being displayed if it is still being retrieved/loaded (this should be the case, but it doesn't always work for some reason).
     */
    React.useEffect(() => {
        if (!rendering) {
            setImageOpacity("100%");
            setImageVisibility("visible");
        } else {
            setImageOpacity("0%");
            setImageVisibility("hidden");
        }
    }, [rendering, setImageOpacity, setImageVisibility]);

    /**
     * Opens the image dialog and sets rendering to false after one second.
     */
    const handleClickOpen = () => {
        setOpen(true);
        setTimeout(() => {
            setRendering(false);
        }, 1000);
    };

    /** 
     * Closes the image dialog and sets rendering back to true for the next time the image is opened.
    */
    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setRendering(true);
        }, 200);
    };

    return (
        <span
            className="image-dialog-container">
            <button
                className="image-dialog-button"
                onClick={handleClickOpen}>
                <img src={require("../img/img_icon_orange.png")} alt="camera icon" />
            </button>
            <Dialog
                className="image-dialog"
                open={open}
                onClose={handleClose}>
                <DialogContent>
                    <div className="image-loading-spinner"
                        style={{ opacity: rendering ? "100%" : "0%", display: rendering ? "visible" : "hidden" }}>
                        <Hypnosis
                            className="spinner"
                            color="var(--lunikoOrange)"
                            width="100px"
                            height="100px"
                            duration="1.5s" />
                    </div>
                    <div className="image-dialog-image"
                        style={{ "--imageURL": `url(${imageSource})`, "--imageOpacity": imageOpacity, "--imageVisibility": imageVisibility }}>
                    </div>
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
