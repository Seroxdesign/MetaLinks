"use client";

import React from "react";

import { useQuery } from "@apollo/client";
import { profileQuery } from "@/services/apollo";
import { toHTTP } from "@/utils/ipfs";
import { useParams } from "next/navigation";
import Wrapper from "@/components/Wrapper";
import { FadeIn } from "@/components/FadeIn";
import Image from "next/image";
import { useNFTCollectibles } from "@/lib/hooks/useNFTCollectibles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectKitButton } from "connectkit";

// const FormatTime = ({ timeZone }: { timeZone: string }) => {
//   const [currentTime, setCurrentTime] = useState("");

//   const updateCurrentTime = () => {
//     const formattedTime = new Intl.DateTimeFormat("en-US", {
//       timeZone,
//       hour12: true,
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     }).format(new Date());
//     setCurrentTime(formattedTime);
//   };

//   useEffect(() => {
//     updateCurrentTime();

//     const intervalId = setInterval(() => {
//       updateCurrentTime();
//     }, 1000);

//     // Clean up the interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <p className="text-left text-6xl mt-1 text-lightBlackTxt">{currentTime}</p>
//   );
// };

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
      className="flex items-center p-1 w-full hover:scale-105 transition-all bg-purple rounded-xl mb-3 max-w-md"
    >
      <div className="flex items-center text-center max-h-12 h-12 w-full">
        <div className="w-4 h-4 ml-6">
          {image && (
            <Image
              className="rounded-sm"
              alt={title}
              src={image}
              width={16}
              height={16}
            />
          )}
        </div>
        <h2 className="flex justify-center items-center font-semibold w-full text-white -ml-10">
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
  const {
    loading: nftLoading,
    error: nftError,
    data: nfts,
  } = useNFTCollectibles(address);

  const processAllNfts = () => {
    let nftData: any = [];
    if (!nfts[0]) return [];
    if (nfts[0]?.maticNfts?.ownedNfts)
      nftData = [...nftData, ...nfts[0].maticNfts.ownedNfts];
    if (nfts[0]?.mainnetNfts?.ownedNfts)
      nftData = [...nftData, ...nfts[0].mainnetNfts.ownedNfts];
    if (nfts[0]?.optimismNfts?.ownedNfts)
      nftData = [...nftData, ...nfts[0].optimismNfts.ownedNfts];
    return nftData;
  };
  const allNfts = processAllNfts().filter(
    (nft: any) => nft.tokenType !== "ERC1155"
  );

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

  // Render the profile information
  const profile = data?.player[0]?.profile;
  return (
    <main>
      <Image
        alt="background-image"
        src="/Banner.svg"
        height="380"
        width="2000"
        className="absolute z-[-1] top-0 left-0 object-cover md:h-96 min-h-48 w-full"
      />
      <Wrapper>
        {/* <ConnectKitButton /> */}
        <FadeIn>
        
          <div className="flex items-center flex-col mx-auto w-full mt-16 md:mt-32 justify-center px-2 md:px-8">
  
            <div className="h-40 w-40 md:h-72 md:w-72">
              <img
                className="rounded-full h-40 w-40 md:h-72  md:w-72 border border-[12px] border-[rgba(255,255,255,0.04)]"
                alt="Picture of the author"
                src={toHTTP(profile.profileImageURL ?? "")}
                width={288}
                height={288}
              />
            </div>
            <h1 className="font-bold mt-4 text-2xl text-white">
              {profile?.name ?? ""}
            </h1>
            <h3 className="text-base text-white">@{profile?.username ?? ""}</h3>
            <p className="text-white text-center text-base my-8">
              {profile?.description ?? ""}
            </p>
            <Tabs defaultValue="links" className="w-full">
              <TabsList className="flex items-center justify-center">
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="nfts">NFTs</TabsTrigger>
              </TabsList>
              <TabsContent
                value="links"
                className="w-full mt-8 flex flex-col items-center justify-center"
              >
                  
                {data?.player[0]?.links.map((link: any, index: number) => (
                  <LinkCard
                    key={link.name}
                    href={link.url}
                    title={link.name}
                    image="/LinkDefaultIcon.svg"
                  />
                ))}
              </TabsContent>
              <TabsContent
                value="nfts"
                className="grid md:grid-cols-3 grid-cols-2 gap-3 max-w-96 place-self-center mx-auto"
              >
                {nftLoading && <p>Loading...</p>}
                {allNfts.map((nft: any) => {
                  const imageUri = nft.image.cachedUrl;

                  return (
                    <Image
                      key={imageUri}
                      src={imageUri}
                      alt="nft-item"
                      className="h-auto w-full max-w-full rounded-md min-h-32"
                      width={128}
                      height={128}
                    />
                  );
                })}
              </TabsContent>
            </Tabs>
          </div>
        </FadeIn>
      </Wrapper>
    </main>
  );
};

export default Page;
