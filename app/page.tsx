"use client";

import { BackgroundBeams } from "@/components/background-beams";
import SearchProfilesComponent from "@/components/SearchProfile";
import ClaimYourProfileButton from "@/components/ClaimProfile";

export default function Home() {
  return (
    <>
      <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="relative text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
            Meta Links
          </h1>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Upgrade to the Future: Web3 Link-in-Bio Tool. Explore Now!
          </p>
          <div className="flex z-50 items-center mt-4 justify-center">
            <ClaimYourProfileButton />
          </div>
          <div className="flex w-full min-w-lg items-center space-x-2 mt-16">
            <SearchProfilesComponent />
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </>
  );
}
