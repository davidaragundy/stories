import { ResetPasswordForm } from "@/components";
import { isValidResetPasswordToken } from "@/utils";
import Image from "next/image";

export default async function ResetPassword({
  params: { token },
}: {
  params: { token: string };
}) {
  const isValidToken = await isValidResetPasswordToken(token);

  return (
    <main className="flex flex-1 px-7 pb-10 sm:pb-0">
      <div className="flex flex-1 select-none flex-col flex-wrap place-content-center gap-10">
        <div className="relative aspect-square w-4/5">
          <Image
            src={"/images/stories.svg"}
            alt="Stories"
            fill
            priority
            className="-my-7"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-wrap place-content-center">
        <div className="flex w-3/5 flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h2 className=" text-4xl font-extrabold">Reset your password</h2>
            <p className="text-sm font-semibold text-default-500">
              You better remember this one! 🫵
            </p>
          </div>
          <ResetPasswordForm isValidToken={isValidToken} token={token} />
        </div>
      </div>
    </main>
  );
}
