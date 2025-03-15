import { cn } from "@/shared/utils/cn";

export const H3: React.FC<React.ComponentProps<"h3">> = ({
  className,
  ...props
}) => {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
};
