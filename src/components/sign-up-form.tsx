"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { getHash, isEmail } from "@/utils";
import { Tooltip } from "@nextui-org/tooltip";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { InfoIcon, LockIcon, UserIcon } from "@/icons";
import { signUpAction } from "@/actions";
import { signUpSchema } from "@/validation";
import { SignUpInputs } from "@/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDebounce } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Toast } from "@/components";

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    watch,
    formState: { errors },
  } = useForm<SignUpInputs>({
    resolver: zodResolver(signUpSchema),
  });
  const router = useRouter();
  const [debouncedEmail] = useDebounce(watch("email"), 500);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!isEmail(debouncedEmail)) {
      getValues("avatarUrl") && setValue("avatarUrl", "");
      return;
    }

    getHash(debouncedEmail)
      .then((hash) =>
        setValue(
          "avatarUrl",
          `https://gravatar.com/avatar/${hash}?d=monsterid&r=x`,
        ),
      )
      .catch(console.error);
  }, [debouncedEmail, getValues, setValue]);

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    setIsPending(true);

    const { ok, messages } = await signUpAction(data);

    if (!ok) {
      toast.custom(
        (props) => (
          <Toast
            {...props}
            message="Could not create account!"
            variant="danger"
          />
        ),
        {
          duration: 7000,
        },
      );

      messages.forEach((message) => {
        const [field, error] = message.split(":") as [
          keyof SignUpInputs,
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

    router.push("/signIn");
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

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            type="text"
            label="First name"
            placeholder="David"
            labelPlacement="inside"
            defaultValue=""
            startContent={<UserIcon size={20} className="text-default-500" />}
            errorMessage={errors.firstName?.message}
            isInvalid={!!errors.firstName}
            {...register("firstName")}
          />
          <Input
            type="text"
            label="Last name"
            placeholder="Aragundy"
            labelPlacement="inside"
            defaultValue=""
            startContent={<UserIcon size={20} className="text-default-500" />}
            errorMessage={errors.lastName?.message}
            isInvalid={!!errors.lastName}
            {...register("lastName")}
          />
        </div>
        <Input
          type="email"
          label="Email"
          placeholder="david@aragundy.com"
          labelPlacement="inside"
          defaultValue=""
          startContent={<UserIcon size={20} className="text-default-500" />}
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
          {...register("email")}
        />
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex flex-wrap gap-2">
            <Tooltip
              content="Your avatar is automatically generated from Gravatar 🥸"
              placement="left"
              className="self-start"
            >
              <InfoIcon size={16} className="text-default-500" />
            </Tooltip>
            <Avatar isBordered src={watch("avatarUrl")} />
          </div>
          <Input
            className="flex-1"
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
        </div>
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
      </div>

      <div className="flex flex-col flex-wrap items-center gap-2">
        <Button
          color="primary"
          variant="flat"
          type="submit"
          className="text-md w-full font-bold"
          isLoading={isPending}
        >
          Create account
        </Button>
        <Link href="/signIn" underline="hover" className="text-xs">
          Already have an account?
        </Link>
      </div>
    </form>
  );
};
