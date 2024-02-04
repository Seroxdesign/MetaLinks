"use client";

import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { profileQuery } from "@/services/apollo";
import { toHTTP } from "@/utils/ipfs";
import { useParams } from "next/navigation";
import Wrapper from "@/components/Wrapper";
import { FadeIn } from "@/components/FadeIn";
import { SocialLinksContainer, SocialLinkItem } from "@/components/Socials";

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
          <div className="grid gap-x-2 gap-y-2 grid-cols-[1fr_0.7fr] max-mdd:grid-cols-[1fr] grid-rows-[auto] my-2">
            <div className="flex w-full max-w-[746px] flex-col items-start gap-x-8 gap-y-8 bg-lightBlackBg px-12 py-10 rounded-3xl max-md:max-w-none max-md:p-8">
              <img
                src={toHTTP(data?.player[0]?.profile.profileImageURL ?? "")}
                alt="Picture of the author"
                className="overflow-hidden w-[108px] h-[108px] flex-[0_0_auto] rounded-full"
              />
              <h1 className="text-6xl max-md:tracking-[-0.01em]">
                {data?.player[0]?.profile?.name ?? ""}
                <br />
              </h1>
            </div>
            <div className="flex flex-col items-stretch gap-x-8  bg-[#131315] text-center p-12 rounded-3xl max-md:p-8">
              <div className="flex flex-col justify-center mb-6 text-left">
                <h2 className="font-bold text-5xl">About me</h2>
              </div>

              <p className="text-[#8a8a93] text-xl text-left">
                {data?.player[0]?.profile?.description ?? ""}
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <SocialLinksContainer>
            {data?.player[0]?.links.map((link: any, index: number) => (
              <SocialLinkItem key={link.name} url={link.url} name={link.name} />
            ))}
          </SocialLinksContainer>
        </FadeIn>

        <FadeIn>
          <div className="grid gap-x-2 gap-y-2 grid-cols-[0.7fr_1fr] max-md:grid-cols-[1fr] auto-rows-auto my-2">
            <div className="flex w-full max-w-[746px] flex-col items-start gap-x-8 gap-y-8 bg-lightBlackBg px-12 py-10 rounded-3xl max-md:max-w-none max-md:p-8">
              <h2 className="font-bold text-2xl">Guilds</h2>
              <ul>
                {data?.player[0]?.guilds.map((guild: any, index: number) => (
                  <li className="flex gap-2 items-center" key={index}>
                    <img
                      src={toHTTP(guild.Guild.logo)}
                      style={{ height: "50px", width: "50px" }}
                      alt="guild logo"
                      width={50}
                      height={50}
                    />
                    <a href="">{guild.Guild.guildname}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-stretch gap-x-8 bg-lightBlackBg text-center p-12 rounded-3xl max-md:p-8">
              <h2 className="font-bold text-left text-xl">
                Time Zone ({data?.player[0]?.profile?.timeZone})
              </h2>
              <FormatTime timeZone={data?.player[0]?.profile?.timeZone} />
            </div>
          </div>
        </FadeIn>
      </Wrapper>
    </main>
  );
};

export default Page;
