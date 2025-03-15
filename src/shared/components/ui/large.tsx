import { cn } from "@/shared/utils/cn";

export const Large: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return <div className={cn("text-lg font-semibold", className)} {...props} />;
};
