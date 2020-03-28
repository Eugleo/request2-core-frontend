import React from "react";

export default function Page(props) {
  let classes = ["w-full", props.width || "", "px-6", "flex-grow", "mx-auto"];

  return (
    <div className={classes.join(" ")}>
      <h1 className="text-3xl font-bold leading-tight mb-4 text-black mt-8">{props.title}</h1>
      <div className="mt-6">{props.children}</div>
    </div>
  );
}
