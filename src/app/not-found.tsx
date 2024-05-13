import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/button";

export default function NotFound() {
  return (
    <div className="flex min-h-fit w-full flex-col flex-wrap items-center justify-center">
      <div className="relative aspect-square w-2/3 select-none">
        <Image src={"./images/404.svg"} alt="Not found" fill />
      </div>

      <Button
        color="primary"
        variant="flat"
        radius="lg"
        as={Link}
        href="/"
        className="-mt-28 font-bold"
        size="lg"
      >
        Go home
      </Button>
    </div>
  );
}
