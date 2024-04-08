"use client";

import { LockIcon, UserIcon } from "@/icons";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInAction } from "@/actions";
import { signInSchema } from "@/validation";
import { SignInInputs } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const SignInForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInInputs>({
    resolver: zodResolver(signInSchema),
  });
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<SignInInputs> = async (data) => {
    setIsPending(true);

    const { ok, messages } = await signInAction(data);

    if (!ok) {
      messages.forEach((message) => {
        const [field, error] = message.split(":") as [
          keyof SignInInputs,
          string,
        ];

        setError(field, { message: error });
      });

      return setIsPending(false);
    }

    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col justify-between gap-5"
    >
      {errors?.root && (
        <div className="flex flex-col flex-wrap rounded-xl bg-danger-50 p-2 text-sm font-semibold text-danger">
          {errors.root.message?.split(", ").map((message) => (
            <span key={message} className="text-center">
              {message}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <Input
          type="text"
          label="Username"
          placeholder="davidaragundy"
          labelPlacement="inside"
          defaultValue=""
          startContent={<UserIcon size={20} className="text-default-500" />}
          errorMessage={errors.username?.message}
          isInvalid={!!errors.username}
          {...register("username")}
        />
        <div>
          <Input
            type="password"
            label="Password"
            placeholder="********"
            labelPlacement="inside"
            startContent={<LockIcon size={20} className="text-default-500" />}
            defaultValue=""
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            {...register("password")}
          />
          <Link
            href="/forgotPassword"
            underline="hover"
            className="text-xs text-default-500"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <div className="flex flex-col flex-wrap items-center gap-2">
        <Button
          color="primary"
          variant="flat"
          type="submit"
          className="text-md w-full font-bold"
          isLoading={isPending}
        >
          Sign in
        </Button>
        <Link href="/signUp" underline="hover" className="text-xs">
          {"Don't have an account?"}
        </Link>
      </div>
    </form>
  );
};
