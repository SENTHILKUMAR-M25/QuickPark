import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

const Label = React.forwardRef((props, ref) => {
  const { className = "", ...rest } = props;

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...rest}
    />
  );
});

Label.displayName = "Label";

export { Label };