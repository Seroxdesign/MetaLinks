"use client";

import { BackgroundBeams } from "@/components/background-beams";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import SearchProfilesComponent from "@/components/SearchProfile";
import { useRouter } from "next/navigation";

export default function Home() {
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
          <SearchProfilesComponent />
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}

export function ClaimYourProfileButton() {
  const router = useRouter();
  return (
    <div className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        onClick={() => {
          router.push("https://enter.metagame.wtf/");
        }}
      >
        <span>Claim your profile</span>
      </HoverBorderGradient>
    </div>
  );
}
