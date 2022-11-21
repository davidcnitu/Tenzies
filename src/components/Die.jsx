import React from "react";

export default function Die(props) {
    return (
        <div className={`die ${props.isHeld ? "isHeld" : ""}`} onClick={props.handleClick}>
            <h2>{props.value}</h2>
        </div>
    );
}