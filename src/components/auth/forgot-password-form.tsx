"use client";

import { EmailIcon } from "@/icons";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordAction } from "@/actions";
import { forgotPasswordSchema } from "@/validation";
import { ForgotPasswordInputs } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { Toast } from "@/components";

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const [isPending, setIsPending] = useState(false);

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    setIsPending(true);

    const { ok, messages } = await forgotPasswordAction(data);

    if (!ok) {
      messages.forEach((message) => {
        const [field, error] = message.split(":") as [
          keyof ForgotPasswordInputs,
          string,
        ];

        setError(field, { message: error });
      });

      return setIsPending(false);
    }

    toast.custom(
      (props) => (
        <Toast {...props} message={messages.toString()} variant="success" />
      ),
      {
        duration: 7000,
      },
    );

    setIsPending(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col justify-between gap-5"
    >
      {errors?.root && (
        <div className="flex flex-col flex-wrap rounded-xl bg-danger-50 p-2 text-sm font-semibold text-danger">
          {errors.root.message?.split("-").map((message) => (
            <span key={message} className="text-center">
              {message}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <Input
          type="email"
          label="Email"
          placeholder="david@aragundy.com"
          labelPlacement="inside"
          defaultValue=""
          startContent={<EmailIcon size={20} className="text-default-500" />}
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
          {...register("email")}
          description="If you have an account registered, we'll send you an email with a link to reset your password."
        />
      </div>

      <div className="flex flex-col flex-wrap items-center gap-2">
        <Button
          color="primary"
          variant="flat"
          type="submit"
          className="text-md w-full font-bold"
          isLoading={isPending}
        >
          Send link
        </Button>
        <Link href="/sign-in" underline="hover" className="text-xs">
          {"Did you remember the password?"}
        </Link>
      </div>
    </form>
  );
};
