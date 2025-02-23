"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "./magicui/animated-list";
import { useState, useEffect } from "react";
import { deleteCode, getCodesMeta } from "@/actions/code";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface Item {
  title: string;
  id: string;
  updatedAt: Date;
}

const Notification = ({ title, id }: Item) => {
  return (
    <figure
        onClick={() => {
            window.location.href = `/editor/${id}`;
        }
        }
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
        <div className="flex items-center justify-between text-lg font-medium dark:text-white px-2">
        <div className="text-sm sm:text-lg">{title}</div>
        <Button variant="ghost" className="z-10" onClick={() => deleteCode(id)}>
            <Trash2 className="h-4 w-4" />
        </Button>
        </div>
    </figure>
  );
};

export function UsersCode({ className }: { className?: string }) {
  const [notifications, setNotifications] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      const { codes } = await getCodesMeta();
      if (!codes) return;
      setNotifications(codes);
    })();
  }, []);

  return (
    <div className={cn("relative flex h-[500px] w-full flex-col overflow-hidden p-2", className)}>
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={item.id || idx} />
        ))}
      </AnimatedList>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 "></div>
    </div>
  );
}
