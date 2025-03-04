import { cn } from "@/shared/lib/utils";

export const H4: React.FC<React.ComponentProps<"h4">> = ({
  className,
  ...props
}) => {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
};
