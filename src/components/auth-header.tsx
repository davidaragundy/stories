import { ThemeSwitcher } from "@/components";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";

export const AuthHeader = ({
  link,
}: {
  link: { label: string; path: string };
}) => {
  return (
    <Navbar maxWidth="full">
      <NavbarContent>
        <NavbarBrand>
          <h1 className="select-none text-4xl font-extrabold">Stories</h1>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="items-center">
        <NavbarItem>
          <Button
            as={Link}
            href={link.path}
            color="primary"
            variant="flat"
            size="sm"
            className="text-md font-bold"
          >
            {link.label}
          </Button>
        </NavbarItem>

        <NavbarItem className="flex place-content-center">
          <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
