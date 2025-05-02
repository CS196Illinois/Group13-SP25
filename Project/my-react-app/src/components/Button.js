import React from "react";

function Button(props) {
    return (
        <div style={outerWrapper}>
          <div style={borderWrapper}>
            <button style={buttonStyle} onClick={props.onClick}>
              {props.children}
            </button>
          </div>
        </div>
      );
    }
    
    const outerWrapper = {
      display: "block",
      position: "relative",
      marginBottom: "16px",
    };
    
    const borderWrapper = {
      padding: "1px", // Border thickness here
      borderRadius: "25px",
      background: "linear-gradient(90deg, #DC1FFF, #769DD7,rgb(0, 174, 255))",
      width: "fit-content",
    };
    
    const buttonStyle = {
      backgroundColor: "#FF5F05",
      color: "#13294B",
      padding: "10px 20px",
      border: "none",
      borderRadius: "24px", 
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
    };
    
export default Button;