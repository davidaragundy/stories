import { XIcon } from "@/icons";
import { cn } from "@/utils";
import toast, { Toast as IToast } from "react-hot-toast";

type Props = IToast & {
  message: string;
  variant?: "success" | "danger" | "warning" | "default";
};

export const Toast = ({ id, visible, message, variant = "default" }: Props) => {
  return (
    <div
      className={cn(
        visible ? "animate-appearance-in" : "animate-disappearance-out",
        `bg-${variant}-50 text-${variant}`,
        "flex select-none items-center gap-2 rounded-xl p-2 text-sm font-semibold",
      )}
    >
      <span>{message}</span>

      <XIcon
        size={16}
        className={cn(
          `text-${variant}-500 hover:text-${variant}-700`,
          "cursor-pointer",
        )}
        onClick={() => toast.dismiss(id)}
      />
    </div>
  );
};
