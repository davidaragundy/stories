import { cn } from "@/shared/lib/utils";

export const P: React.FC<React.HTMLProps<HTMLParagraphElement>> = ({
  className,
  ...props
}) => {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  );
};
