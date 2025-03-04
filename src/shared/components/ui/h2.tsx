import { cn } from "@/shared/lib/utils";

export const H2: React.FC<React.ComponentProps<"h2">> = ({
  className,
  ...props
}) => {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  );
};
