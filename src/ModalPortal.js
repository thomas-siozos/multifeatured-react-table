import {createPortal} from "react-dom";
import React, {useEffect, useState} from "react";

const ModalPortal = (props) => {

    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(props.isOpen)
    }, [props.isOpen]);

    const calculatePositionAndWidth = () => {
        const { current } = props.parent;
        if (current) {
            return {
                top: current.getBoundingClientRect().top + window.scrollY + current.getBoundingClientRect().height + 10,
                left: current.getBoundingClientRect().left + window.scrollX - (props.isSettingsModal && 200),
                width: props.getWidthFromParent && current.getBoundingClientRect().width
            }
        }
        return {};
    }

    return createPortal(
        active &&
        <div className="select-modal-container" style={calculatePositionAndWidth()}>
            <div className="select-modal-body">
                {props.children}
            </div>
        </div>
    , document.body);
}

export default ModalPortal;