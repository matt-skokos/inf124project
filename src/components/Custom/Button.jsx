import React from 'react'
import PropTypes from "prop-types";
import "./Button.css";

function Button({
    children,
    onClick,
    type = "button",
    className = "",
    ...rest
})
{
    return (
        <button
          type={type}
          className={`btn-custom ${className}`}
          onClick={onClick}
          {...rest}
        >
          {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    className: PropTypes.string,
};

export default Button;