import { NavButton } from "@/components";
import { ChatIcon, FollowingIcon, UserIcon, WorldIcon } from "@/icons";

interface Props {
  username: string;
}

export const Nav = ({ username }: Props) => {
  const links = [
    { label: "Global", path: "/", icon: <WorldIcon size={18} /> },
    {
      label: "Following",
      path: "/following",
      icon: <FollowingIcon size={18} />,
    },
    { label: "Rooms", path: "/rooms", icon: <ChatIcon size={18} /> },
    { label: "Profile", path: `/${username}`, icon: <UserIcon size={18} /> },
  ];

  return (
    <nav role="navigation" className="flex flex-col p-7 pr-4">
      <div className="flex flex-col gap-2 rounded-3xl bg-default-100 p-2">
        {links.map((link) => (
          <NavButton key={`${link.label} - ${link.path}`} link={link} />
        ))}
      </div>
    </nav>
  );
};
