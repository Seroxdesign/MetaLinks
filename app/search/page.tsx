"use client";

import { useSearchParams } from "next/navigation";
import SearchProfilesComponent from "@/components/SearchProfile";
import { HoverEffect } from "@/components/card-hover-effect";
import { BackgroundBeams } from "@/components/background-beams";
import { toHTTP } from "@/utils/ipfs";
import { Suspense } from "react";
import {
  TUseFetchUserDetailsByUsername,
  useFetchUserDetailsByUsername,
} from "@/lib/hooks/useGetUserDetailsFromDatabase";
import { ThreeDotsLoaderComponent } from "@/components/LoadingComponents";

const SearchComponent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") ?? "";
  const { data, isLoading } = useFetchUserDetailsByUsername(searchQuery);

  if (isLoading) return <ThreeDotsLoaderComponent />;

  const players = data ?? [];
  const formattedData = players.map(
    (profile: TUseFetchUserDetailsByUsername) => ({
      name: profile.name,
      description: profile.description,
      username: profile.username,
      imageUrl: toHTTP(profile?.profileImageURL ?? ""),
      ethereumAddress: profile.ethereumAddress,
      href: `/${profile.ethereumAddress}`,
    })
  );

  return (
    <main>
      <div className="mt-16">
        <SearchProfilesComponent val={searchQuery} />
      </div>
      <div className="max-w-5xl mx-auto px-8">
        <HoverEffect items={formattedData} />
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
