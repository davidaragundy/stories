"use client";

import { SignOutButton, ThemeSwitcher } from "@/components";
import { Link } from "@nextui-org/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Avatar } from "@nextui-org/avatar";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { usePathname } from "next/navigation";
import { usePageState } from "@/hooks";

export const Header = () => {
  const { user } = usePageState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Following", path: "/following" },
    { label: "Rooms", path: "/rooms" },
    { label: "Profile", path: `/${user?.username}` },
  ];

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      className="mt-4"
      height={40}
      position={user ? "sticky" : "static"}
    >
      <NavbarContent>
        {user && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        )}

        <NavbarBrand className="flex items-center">
          <h1 className="select-none text-4xl font-extrabold">Stories</h1>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="items-center">
        {user && (
          <>
            <NavbarItem
              as={Link}
              href={`/${user.username}`}
              className="hidden place-content-center sm:flex"
            >
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                name={`${user.firstName} ${user.lastName}`}
                size="sm"
                src={user.avatarUrl}
              />
            </NavbarItem>

            <NavbarItem className="hidden place-content-center sm:flex">
              <SignOutButton />
            </NavbarItem>
          </>
        )}

        {!user && (
          <NavbarItem>
            <Button
              as={Link}
              href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}
              color="primary"
              variant="flat"
              size="sm"
              className="text-md font-bold"
            >
              {pathname === "/sign-in" ? "Sign Up" : "Sign In"}
            </Button>
          </NavbarItem>
        )}

        <NavbarItem className="flex place-content-center">
          <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={`${item.label}-${item.path}`}>
            <Link
              color={"foreground"}
              className="w-full"
              href={item.path}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}

        <NavbarMenuItem>
          <SignOutButton showText={true} />
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
