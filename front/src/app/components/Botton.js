import React from "react";

const Button = ({ label, onClick, type = "button", variant = "primary" }) => {
  const baseStyles = "px-4 py-2 font-semibold rounded-md shadow focus:outline-none";
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {label}
    </button>
  );
};

export default Button;
