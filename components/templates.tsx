
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import Image from "next/image";

export function Templates() {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          template={item.template}
        />
      ))}
    </BentoGrid>
  );
}

const items = [
    {
      title: "Block Shield",
      description: "Secure Your Blockchain Assets with Confidence.",
      header: (
        <Image
          src="/block-shield.png"
          alt="Block Shield Preview"
          width={500}
          height={300}
          className="rounded-xl"
        />
      ),
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
      template: "block-shield",
    },
    {
      title: "Crypto Dashboard",
      description: "Stay Updated with Real-Time Crypto Market Data.",
      header: (
        <Image
          src="/crypto-dashboard.png"
          alt="Crypto Dashboard Preview"
          width={500}
          height={300}
          className="rounded-xl"
        />
      ),
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
      template: "crypto-dashboard",
    },
    {
      title: "Urban Style",
      description: "Urban Style beyond the ordinary",
      header: (
        <Image
          src="/urban-style.png"
          alt="Urban Style Preview"
          width={500}
          height={300}
          className="rounded-xl"
        />
      ),
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
      template: "urban-style",
    },
    {
      title: "Widget",
      description: "A widget is a small application that can be installed within a web page.",
      header: (
        <Image
          src="/widget.png"
          alt="Widget Preview"
          width={500}
          height={300}
          className="rounded-xl"
        />
      ),
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
      template: "widget",
    },
    {
      title: "Portfolio",
      description: "Join the quest for understanding and enlightenment.",
      header: (
        <Image
          src="/portfolio-preview.png"
          alt="Portfolio Preview"
          width={500}
          height={300}
          className="rounded-xl"
        />
      ),
      icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
      template: "portfolio",
    },
  ];