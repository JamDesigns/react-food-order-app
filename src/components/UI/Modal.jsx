import React from "react";
import ReactDOM from "react-dom";

import Card from "./Card";

import classes from "./Modal.module.css";

const Backdrop = (props) => {
    return <div className={classes.backdrop} onClick={props.onClose}></div>;
};

const ModalOverlay = (props) => {
    return (
        <Card className={classes.modal}>
            <div className={classes.content}>{props.children}</div>
        </Card>
    );
};

const Modal = (props) => {
    return (
        <React.Fragment>
            {ReactDOM.createPortal(
                <Backdrop onClose={props.onClick} />,
                document.getElementById("backdrop-root"),
            )}
            {ReactDOM.createPortal(
                <ModalOverlay>{props.children}</ModalOverlay>,
                document.getElementById("overlay-root"),
            )}
        </React.Fragment>
    );
};

export default Modal;
