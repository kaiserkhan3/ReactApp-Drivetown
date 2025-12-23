"use client";
import React from "react";

type SearchBoxProps = {
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
  onClear?: () => void;
  center?: boolean;
  id?: string;
  name?: string;
  className?: string;
};

export default function SearchBox({
  value,
  placeholder = "Search...",
  onChange,
  onSearch,
  onClear,
  center = false,
  id,
  name,
  className,
}: SearchBoxProps) {
  const wrapperClass = `d-flex ${center ? "justify-content-center" : ""}`;

  return (
    <div className={wrapperClass}>
      <div
        className={`input-group ${className || ""}`}
        style={{ maxWidth: 400 }}
      >
        <span
          className="input-group-text"
          aria-hidden
          style={{ background: "transparent", borderRight: "0" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          id={id}
          name={name}
          type="text"
          className="form-control"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
              onSearch && onSearch();
            }
          }}
          aria-label={placeholder}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            if (value) {
              onClear && onClear();
            } else {
              onSearch && onSearch();
            }
          }}
          title={value ? "Clear" : "Search"}
        >
          {value ? (
            <i className="bi bi-x-lg"></i>
          ) : (
            <i className="bi bi-search"></i>
          )}
        </button>
      </div>
    </div>
  );
}
