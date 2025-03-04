import { cn } from "@/shared/lib/utils";

export const H1: React.FC<React.ComponentProps<"h1">> = ({
  className,
  ...props
}) => {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
      {...props}
    />
  );
};
