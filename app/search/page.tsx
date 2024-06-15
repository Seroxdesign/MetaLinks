"use client";

import { useSearchParams } from "next/navigation";
import SearchProfilesComponent from "@/components/SearchProfile";
import { HoverEffect } from "@/components/card-hover-effect";
import { BackgroundBeams } from "@/components/background-beams";
import { Suspense } from "react";
import { useSearchByUsernameOrAddress } from "@/lib/hooks/useGetUserDetailsFromDatabase";

import { ThreeDotsLoaderComponent } from "@/components/LoadingComponents";

const SearchComponent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") ?? "";
  const { data, isLoading } = useSearchByUsernameOrAddress(searchQuery);

  if (isLoading || !data) return <ThreeDotsLoaderComponent />;

  return (
    <main>
      <div className="mt-16">
        <SearchProfilesComponent val={searchQuery} />
      </div>
      <div className="max-w-5xl mx-auto px-8">
        <HoverEffect items={data} />
      </div>
      <BackgroundBeams />
    </main>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense>
      <SearchComponent />
    </Suspense>
  );
};

export default Page;
