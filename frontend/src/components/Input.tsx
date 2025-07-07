import React from "react";

interface inputProps {
  placeholder: string;
  onChangeHandler: () => void;
  type: "string";
  label: string;
  id: string;
}
function Input({ placeholder, onChangeHandler, type, label, id }: inputProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        placeholder={placeholder}
        id={id}
        type={type}
        onChange={onChangeHandler}
      />
    </div>
  );
}

export default Input;
