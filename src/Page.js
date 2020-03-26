import React from "react";

export default function Page(props) {
  let width = props.width ? " max-w-" + props.width : "w-full";

  return (
    <div className={"px-6 flex-grow mx-auto" + width}>
      <h1 className="text-3xl font-bold leading-tight mb-4 text-black mt-8">{props.title}</h1>
      <div className="mt-6">{props.children}</div>
    </div>
  );
}
