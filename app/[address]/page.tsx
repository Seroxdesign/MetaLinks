"use client";

import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { profileQuery } from "@/services/apollo";
import { toHTTP } from "@/utils/ipfs";
import { useParams } from "next/navigation";
import Wrapper from "@/components/Wrapper";
import { FadeIn } from "@/components/FadeIn";
import { SocialLinksContainer, SocialLinkItem } from "@/components/Socials";
import Image from "next/image";

const FormatTime = ({ timeZone }: { timeZone: string }) => {
  const [currentTime, setCurrentTime] = useState("");

  const updateCurrentTime = () => {
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());
    setCurrentTime(formattedTime);
  };

  useEffect(() => {
    updateCurrentTime();

    const intervalId = setInterval(() => {
      updateCurrentTime();
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <p className="text-left text-6xl mt-1 text-lightBlackTxt">{currentTime}</p>
  );
};

function LinkCard({
  href,
  title,
  image,
}: {
  href: string;
  title: string;
  image?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-1 w-full rounded-md hover:scale-105 transition-all bg-gray-100 mb-3 max-w-3xl"
    >
      <div className="flex text-center w-full">
        <div className="w-10 h-10">
          {image && (
            <Image
              className="rounded-sm"
              alt={title}
              src={image}
              width={40}
              height={40}
            />
          )}
        </div>
        <h2 className="flex justify-center items-center font-semibold w-full text-gray-700 -ml-10">
          {title}
        </h2>
      </div>
    </a>
  );
}

const Page: React.FC = () => {
  // Get the address from the router params
  const router = useParams();
  const address = router.address as string;

  // Fetch the profile data using Apollo useQuery hook
  const { loading, error, data } = useQuery(profileQuery, {
    variables: { address },
  });

  if (loading) {
    return <p></p>;
  }

  // Render error message if user is not found
  if (error || !data?.player[0]) {
    return <p>Error: User not found</p>;
  }
  console.log(data?.player[0]);
  // Render the profile information
  return (
    <main>
      <Wrapper>
        <FadeIn>
          <div className="flex items-center flex-col mx-auto w-full justify-center mt-16 px-8">
            <img
              className="rounded-full"
              alt="Picture of the author"
              src={toHTTP(data?.player[0]?.profile.profileImageURL ?? "")}
              width={96}
              height={96}
            />
            <h1 className="font-bold mt-4 text-xl text-white">
              {data?.player[0]?.profile?.name ?? ""}
            </h1>
            <p className="text-[#8a8a93] text-xl text-left mb-16">
              {data?.player[0]?.profile?.description ?? ""}
            </p>
            {data?.player[0]?.links.map((link: any, index: number) => (
              <LinkCard key={link.name} href={link.url} title={link.name} />
            ))}
          </div>
        </FadeIn>
      </Wrapper>
    </main>
  );
};

export default Page;
