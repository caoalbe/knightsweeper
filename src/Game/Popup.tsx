import React from "react";
import "../App.css";

// todo:
// popup statistics
// round the corners on the divs

function Popup(props: any): JSX.Element {
  return props.trigger ? (
    <div className="popup">
      <button className="close-button" onClick={() => props.setTrigger(false)}>
        X
      </button>
      {props.children}
    </div>
  ) : (
    <></>
  );
}

export default Popup;
