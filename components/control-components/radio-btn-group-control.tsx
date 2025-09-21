import React, { ChangeEvent } from "react";

export const RadioButtonGroupControl = ({
  children,
  id,
  label,
  options,
  onChange,
  checkedValue,
}: {
  children?: React.ReactNode;
  id: string;
  label: string;
  options: string[];
  checkedValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div
      className="btn-group mb-3"
      role="group"
      aria-label="Basic radio toggle button group"
    >
      <span id={id} className="input-group-text pe-3">
        {label}
      </span>
      {options.map((item) => (
        <React.Fragment key={item}>
          <input
            type="radio"
            className="btn-check"
            name={id}
            id={item}
            autoComplete="off"
            value={item}
            onChange={onChange}
            checked={checkedValue === item}
          />
          <label className="btn btn-outline-primary" htmlFor={item}>
            {item}
          </label>
        </React.Fragment>
      ))}
      {children || null}
    </div>
  );
};
