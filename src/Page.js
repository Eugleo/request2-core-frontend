import React from "react";

export default function Page(props) {
  let classes = ["w-full", props.width || "", "px-6", "flex-grow", "mx-auto"];

  return (
    <div className={classes.join(" ")}>
      <h1 className="text-3xl font-bold leading-tight text-black mt-8">{props.title}</h1>
      <div className="mt-6">{props.children}</div>
    </div>
  );
}

export function CenteredPage(props) {
  let classes = [
    "w-full",
    "h-full",
    props.width || "",
    "px-6",
    "flex-grow",
    "mx-auto",
    "flex",
    "flex-col",
    "justify-center"
  ];

  return (
    <div className={classes.join(" ")}>
      <h1 className="text-3xl text-center font-bold leading-tight text-black">{props.title}</h1>
      <div className="mt-6">{props.children}</div>
    </div>
  );
}
