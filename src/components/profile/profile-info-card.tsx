"use client";

import { useDisclosure } from "@nextui-org/modal";
import { ProfileInfoModal } from "@/components";

interface Props {
  count: number;
  label: "followers" | "following";
}

export const ProfileInfoCard = ({ count, label }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div
        onClick={onOpen}
        className="flex flex-col items-center rounded-2xl p-2 hover:cursor-pointer hover:bg-default-200"
      >
        <span className="text-xl font-bold">{count}</span>

        <span className="text-sm text-default-500">{label}</span>
      </div>

      {isOpen && (
        <ProfileInfoModal isOpen={isOpen} onClose={onClose} target={label} />
      )}
    </>
  );
};
