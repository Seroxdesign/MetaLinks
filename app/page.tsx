"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "@/components/background-beams";
import { Input } from "@/components/ui/input";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="z-50 max-w-4xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Meta Links
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Upgrade to the Future: Web3 Link-in-Bio Tool. Explore Now!
        </p>
        <div className="flex items-center mt-4 justify-center">
          <ClaimYourProfileButton />
        </div>
        <div className="flex w-full min-w-lg items-center space-x-2 mt-16">
          <Input
            type="text"
            placeholder="Enter username, name or ethereum address"
            className="rounded-xl w-[30rem] h-[2.5rem]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <Button variant="shimmer" size="lg">
            <IconSearch /> Search Profile
          </Button>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}

export function ClaimYourProfileButton() {
  return (
    <div className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <span>Claim your profile</span>
      </HoverBorderGradient>
    </div>
  );
}

function IconSearch() {
  return (
    <div className="mx-1">
      <svg viewBox="0 0 1024 1024" fill="currentColor" height="1em" width="1em">
        <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
      </svg>
    </div>
  );
}
