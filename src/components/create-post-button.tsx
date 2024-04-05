"use client";

import { Button } from "@nextui-org/button";
import { Dispatch, SetStateAction, RefObject, useEffect } from "react";
import { useFormStatus } from "react-dom";

export const CreatePostButton = ({
  setLoading,
  formRef,
  contentRef,
  mediaRef,
}: {
  setLoading: Dispatch<SetStateAction<boolean>>;
  formRef: RefObject<HTMLFormElement>;
  contentRef: RefObject<HTMLTextAreaElement>;
  mediaRef: RefObject<HTMLInputElement>;
}) => {
  const { pending } = useFormStatus();

  useEffect(() => {
    setLoading(pending);
  }, [pending, setLoading]);

  return (
    <Button
      isLoading={pending}
      color="primary"
      size="sm"
      radius="lg"
      onClick={() => {
        if (
          !contentRef.current?.value &&
          mediaRef.current?.files?.length === 0
        ) {
          contentRef.current?.focus();
          return;
        }

        formRef.current?.dispatchEvent(new Event("submit", { bubbles: true }));
      }}
    >
      Post
    </Button>
  );
};
