import { cn } from "@/shared/lib/utils";

export const Large: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return <div className={cn("text-lg font-semibold", className)} {...props} />;
};
