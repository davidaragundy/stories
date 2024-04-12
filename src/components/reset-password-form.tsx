"use client";

import { LockIcon } from "@/icons";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordAction } from "@/actions";
import { resetPasswordSchema } from "@/validation";
import { ResetPasswordInputs } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Toast } from "@/components";
import { useRouter } from "next/navigation";

export const ResetPasswordForm = ({
  isValidToken,
  token,
}: {
  isValidToken: boolean;
  token: string;
}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isValidToken) {
      setError("root", {
        message:
          "Invalid reset password token. It may have expired, been used or tampered with. 🤮",
      });
    }

    return () => {
      setError("root", { message: undefined });
    };
  }, [isValidToken, setError]);

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
    setIsPending(true);

    const { ok, messages } = await resetPasswordAction(data);

    if (!ok) {
      messages.forEach((message) => {
        const [field, error] = message.split(":") as [
          keyof ResetPasswordInputs,
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

    router.push("/sign-in");
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

      {isValidToken && (
        <>
          <div className="flex flex-col gap-5">
            <input type="hidden" defaultValue={token} {...register("token")} />

            <Input
              type="password"
              label="Password"
              placeholder="********"
              labelPlacement="inside"
              isClearable
              defaultValue=""
              startContent={<LockIcon size={20} className="text-default-500" />}
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
              {...register("password")}
            />

            <Input
              type="password"
              label="Confirm password"
              placeholder="********"
              labelPlacement="inside"
              isClearable
              defaultValue=""
              startContent={<LockIcon size={20} className="text-default-500" />}
              errorMessage={errors.passwordConfirmation?.message}
              isInvalid={!!errors.passwordConfirmation}
              {...register("passwordConfirmation")}
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
              Reset password
            </Button>
            <Link href="/sign-in" underline="hover" className="text-xs">
              {"Did you remember the password?"}
            </Link>
          </div>
        </>
      )}
    </form>
  );
};
