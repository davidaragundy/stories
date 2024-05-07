"use client";

import { PostActions, PostContext, PostState } from "@/context";
import { useContext, useReducer, type ReactNode } from "react";

export interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider = ({ children }: PostProviderProps) => {
  const defaultInitState = useContext(PostContext);
  const [state, dispatch] = useReducer(postReducer, defaultInitState);

  return (
    <PostContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PostContext.Provider>
  );
};

function postReducer(state: PostState, action: PostActions) {
  switch (action.type) {
    case "SET_ID":
      return { ...state, id: action.payload.id };

    case "SET_IS_PENDING":
      return { ...state, isPending: action.payload.isPending };

    case "SET_REACTIONS_SET":
      return { ...state, reactionsSet: action.payload.reactionsSet };

    default:
      return state;
  }
}
