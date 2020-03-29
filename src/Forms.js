import React, { useEffect } from "react";
import { useField } from "formik";

export function InputField({ label, initValue, ...props }) {
  let [field, meta, helpers] = useField(props);

  useEffect(() => {
    if (initValue) {
      helpers.setValue(initValue);
      return;
    }
  }, [helpers, initValue]);

  return (
    <div className="flex flex-col mb-6 w-full">
      <label htmlFor={props.name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...field}
        {...props}
        className={
          "border shadow-inner text-sm border-gray-300 text-gray-900 rounded-md py-1 px-2 " +
          "focus:outline-none focus:shadow-outline-blue focus:border-blue-600 focus:z-10 font-normal"
        }
      />
      {meta.touched && meta.error ? (
        <div className="mt-1 text-red-600 text-xs">{meta.error}</div>
      ) : null}
    </div>
  );
}
