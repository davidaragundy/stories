import { PostContext } from "@/context";
import { useContext } from "react";

export const usePostState = () => {
  const postState = useContext(PostContext);

  return postState;
};
