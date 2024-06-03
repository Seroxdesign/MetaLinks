import { cn } from "@/lib/utils";
import React from "react";

export default function ThreeDotsLoader({
  className,
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 65 50"
      enableBackground="new 0 0 0 0"
      xmlSpace="preserve"
      className={cn("inline-block w-[40px] h-[16px]", className)}
      data-qa-marker="three-dots-loader"
    >
      <circle fill={color} stroke="none" cx="6" cy="25" r="6">
        <animateTransform
          attributeName="transform"
          dur=".7s"
          type="translate"
          values="0 6 ; 0 -6; 0 6"
          repeatCount="indefinite"
          begin="0.1"
        />
      </circle>
      <circle fill={color} stroke="none" cx="30" cy="25" r="6">
        <animateTransform
          attributeName="transform"
          dur=".7s"
          type="translate"
          values="0 6 ; 0 -6; 0 6"
          repeatCount="indefinite"
          begin="0.25"
        />
      </circle>
      <circle fill={color} stroke="none" cx="54" cy="25" r="6">
        <animateTransform
          attributeName="transform"
          dur=".7s"
          type="translate"
          values="0 6 ; 0 -6; 0 6"
          repeatCount="indefinite"
          begin="0.4"
        />
      </circle>
    </svg>
  );
}
