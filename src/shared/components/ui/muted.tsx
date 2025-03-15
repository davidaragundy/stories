import { cn } from "@/shared/utils/cn";

export const Muted: React.FC<React.ComponentProps<"p">> = ({
  className,
  ...props
}) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
};
