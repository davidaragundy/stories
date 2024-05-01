import { NavButton } from "@/components";
import {
  ChatIcon,
  FollowingIcon,
  HomeIcon,
  SettingsIcon,
  UserIcon,
} from "@/icons";

export const Nav = () => {
  const links = [
    { label: "Home", path: "/", icon: <HomeIcon size={18} /> },
    {
      label: "Following",
      path: "/following",
      icon: <FollowingIcon size={18} />,
    },
    { label: "Rooms", path: "/rooms", icon: <ChatIcon size={18} /> },
    { label: "Profile", path: "/profile", icon: <UserIcon size={18} /> },
    { label: "Settings", path: "/settings", icon: <SettingsIcon size={18} /> },
  ];

  return (
    <nav role="navigation" className="flex flex-col p-7">
      <div className="flex flex-col gap-2 rounded-3xl bg-default-50 p-2">
        {links.map((link) => (
          <NavButton key={`${link.label} - ${link.path}`} link={link} />
        ))}
      </div>
    </nav>
  );
};
