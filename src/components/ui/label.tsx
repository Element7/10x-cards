/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import * as React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  return <label ref={ref} className="block text-sm font-medium text-muted-foreground" {...props} />;
});

Label.displayName = "Label";
