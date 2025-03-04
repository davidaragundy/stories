import { cn } from "@/shared/lib/utils";

export const Muted: React.FC<React.ComponentProps<"p">> = ({
  className,
  ...props
}) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
};
