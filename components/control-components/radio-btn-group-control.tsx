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
      aria-label={`Radio button group ${id}`}
    >
      <span id={id} className="input-group-text pe-3">
        {label}
      </span>
      {options.map((item, idx) => {
        // create a unique id per option per group to avoid duplicate DOM ids
        const safe = item.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
        const optionId = `${id}-${safe}-${idx}`;
        return (
          <React.Fragment key={optionId}>
            <input
              type="radio"
              className="btn-check"
              name={id}
              id={optionId}
              autoComplete="off"
              value={item}
              onChange={onChange}
              checked={checkedValue === item}
            />
            <label className="btn btn-outline-primary" htmlFor={optionId}>
              {item}
            </label>
          </React.Fragment>
        );
      })}
      {children || null}
    </div>
  );
};
