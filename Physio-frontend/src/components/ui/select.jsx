import * as React from "react";

export function Select({ children, className = "", ...props }) {
  return (
    <select
      className={`border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
