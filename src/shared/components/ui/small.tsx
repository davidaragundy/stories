import { cn } from "@/shared/utils/cn";

export const Small: React.FC<React.ComponentProps<"small">> = ({
  className,
  ...props
}) => {
  return (
    <small
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
};
