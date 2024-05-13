"use client";

import { usePageState } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByKey,
} from "firebase/database";
import { Message } from "@/types";
import { cn } from "@/utils";
import Image from "next/image";

interface Props {
  userId: string;
}

export const Messages = ({ userId }: Props) => {
  const { user } = usePageState();

  const [messages, setMessages] = useState<Message[]>([]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const db = getDatabase();

    const messagesRef = query(
      ref(db, "messages/" + [user!.id, userId].sort().join("-")),
      orderByKey(),
    );

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messages = Object.values(snapshot.val()) as Message[];

        setMessages(messages);
      }
    });

    return () => {
      unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
      });
    }
  }, [messages.length]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-1 overflow-y-auto scroll-smooth px-4"
    >
      <div className="flex h-full w-full flex-col gap-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex max-w-[80%] flex-col gap-2 rounded-xl bg-primary-100 px-2 py-1",
              user!.id === message.userId
                ? "self-end rounded-tr-none"
                : "self-start rounded-tl-none",
            )}
          >
            <p className="whitespace-break-spaces break-words">
              {message.content}
            </p>

            {message.media && message.media.length > 0 && (
              <div
                className={cn(
                  "relative mb-1 w-full min-w-52",
                  message.media[0].type === "image" && "aspect-square",
                )}
              >
                {message.media.map((media) =>
                  media.type === "image" ? (
                    <Image
                      key={media.id}
                      className="w-full rounded-lg object-cover"
                      fill
                      alt="message's image"
                      src={message.media![0].url}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <video
                      key={media.id}
                      className="w-full rounded-lg object-cover py-2"
                      controls
                    >
                      <source src={media.url} />
                    </video>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
