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
import { User } from "lucia";

export const Header = ({ user }: { user: User | null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Following", path: "/following" },
    { label: "Rooms", path: "/rooms" },
    { label: "Profile", path: "/profile" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      className="bg-transparent"
      position={user ? "sticky" : "static"}
    >
      <NavbarContent>
        {user && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        )}

        <NavbarBrand>
          <h1 className="select-none text-4xl font-extrabold">Stories</h1>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="items-center">
        {user && (
          <>
            <NavbarItem
              as={Link}
              href={"/profile"}
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
              href={pathname === "/signIn" ? "/signUp" : "/signIn"}
              color="primary"
              variant="flat"
              size="sm"
              className="text-md font-bold"
            >
              {pathname === "/signIn" ? "Sign Up" : "Sign In"}
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
