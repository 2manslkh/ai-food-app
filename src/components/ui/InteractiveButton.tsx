"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface FloatingIconProps {
  style: React.CSSProperties;
  Icon: LucideIcon;
  className?: string;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ style, Icon, className }) => (
  <div className="pointer-events-none absolute animate-float-up" style={style}>
    <Icon className={className} />
  </div>
);

interface InteractiveButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  variant?: "default" | "outline" | "ghost";
  showFloatingIcon?: boolean;
  floatingIconClassName?: string;
}

export function InteractiveButton({
  onClick,
  icon: Icon,
  variant = "default",
  showFloatingIcon = false,
  floatingIconClassName = "h-4 w-4",
}: InteractiveButtonProps) {
  const [floatingIcons, setFloatingIcons] = useState<{ id: number; style: React.CSSProperties }[]>(
    []
  );

  const handleClick = () => {
    if (showFloatingIcon) {
      const newIcon = {
        id: Date.now(),
        style: {
          bottom: "2rem",
          right: "0.5rem",
        },
      };

      setFloatingIcons((prev) => [...prev, newIcon]);
      setTimeout(() => {
        setFloatingIcons((prev) => prev.filter((icon) => icon.id !== newIcon.id));
      }, 1000);
    }

    onClick();
  };

  return (
    <div className="relative">
      {floatingIcons.map((floatingIcon) => (
        <FloatingIcon
          key={floatingIcon.id}
          style={floatingIcon.style}
          Icon={Icon}
          className={floatingIconClassName}
        />
      ))}
      <Button onClick={handleClick} variant={variant} size="icon">
        <Icon className="h-4 w-4" />
      </Button>
    </div>
  );
}
