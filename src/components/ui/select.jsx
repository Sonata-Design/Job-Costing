import React from "react";
import { cn } from "@/lib/utils";

// Custom Select Component that properly handles onChange and value
const Select = React.forwardRef(({ className, children, onValueChange, value, defaultValue, ...props }, ref) => {
  // Handle the custom onValueChange prop to work like standard onChange
  const handleChange = (e) => {
    if (onValueChange) onValueChange(e.target.value);
  };
  
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("block truncate", className)}
      {...props}
    />
  );
});
SelectValue.displayName = "SelectValue";

// Modified to work with native select properly
const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  // We'll just pass children through since native select doesn't support custom containers
  return <>{children}</>;
});
SelectContent.displayName = "SelectContent";

// Convert to option element for native select
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <option ref={ref} {...props}>
      {children}
    </option>
  );
});
SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
};
