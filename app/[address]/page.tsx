"use client";

import React from "react";
import { toHTTP } from "@/utils/ipfs";
import { useParams } from "next/navigation";
import Wrapper from "@/components/Wrapper";
import { FadeIn } from "@/components/FadeIn";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonateCrypto from "@/components/DonateCrypto";
import { ConnectKitButton } from "connectkit";
import MainDrawer from "@/components/MoreOptionsDropdown";
import { Attestations } from "@/components/Attestations";
import { useGetGitcoinPassportScore } from "@/lib/hooks/useGetGitcoinPassportScore";
import { useGetUserProfile } from "@/lib/hooks/useGetUserProfile";
import { useGetNfts } from "@/lib/hooks/useGetNfts";
import { BackgroundBeams } from "@/components/background-beams";
import { useAccount } from "wagmi";
import { ThreeDotsLoaderComponent } from "@/components/LoadingComponents";

interface LinkCardProps {
  href: string;
  title: string;
  image?: string;
}

function LinkCard({ href, title, image }: LinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-1 w-full hover:scale-105 transition-all bg-purple rounded-xl mb-3 max-w-md"
    >
      <div className="flex items-center text-center max-h-12 h-12 w-full">
        <div className="w-6 h-6 ml-6">
          {image && (
            <Image
              className="rounded-sm"
              alt={title}
              src={image}
              width={24}
              height={24}
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
  const address = router?.address as string;
  const { address: userConnectAddress, chainId } = useAccount();
  const enableProfileEditing = userConnectAddress === address;

  const { score } = useGetGitcoinPassportScore(address);

  const { userProfile, isProfileLoading } = useGetUserProfile({ address });
  const { nfts, isNFTLoading } = useGetNfts({ address });

  const isLoading = isProfileLoading || isNFTLoading;

  if (isLoading) return <ThreeDotsLoaderComponent />;

  return (
    <>
      <main className="relative top-0 left-0 z-10">
        <div className="fixed flex gap-x-4 items-center top-3 right-3 z-10">
          <MainDrawer
            address={address}
            enableProfileEditing={enableProfileEditing}
          />
          <ConnectKitButton />
        </div>
        <Wrapper>
          <FadeIn>
            <div className="flex items-center flex-col mx-auto w-full justify-center px-2 md:px-8">
              <div className="h-40 w-40 mt-16 md:mt-32 md:h-72 md:w-72">
                <img
                  className="rounded-full h-40 w-40 md:h-72 md:w-72 border border-[12px] border-[rgba(255,255,255,0.04)]"
                  alt="Picture of the author"
                  src={
                    userProfile?.profileImageIPFS
                      ? toHTTP(userProfile?.profileImageIPFS)
                      : "/DefaultProfilePicture.png"
                  }
                  width={288}
                  height={288}
                />
              </div>
              <h1 className="font-bold mt-4 text-2xl text-white">
                {userProfile?.name ?? ""}
              </h1>
              <h3 className="text-base text-white">
                @{userProfile?.username ?? ""}
              </h3>
              <div className="flex flex-col items-center mt-4">
                <h1 className="text-xl font-light text-[#662DDF]">
                  {score ?? "0"}
                </h1>
                <p className="text-[10px]">Gitcoin Passport Score</p>
              </div>
              <p className="text-white text-center text-base my-4 max-w-[400px] break-words">
                {userProfile?.bio ?? ""}
              </p>

              {userProfile ? (
                <Tabs defaultValue="links" className="w-full">
                  <TabsList className="flex items-center justify-center">
                    <TabsTrigger value="links">Links</TabsTrigger>
                    <TabsTrigger value="nfts">NFTs</TabsTrigger>
                    <TabsTrigger value="donate">Donate</TabsTrigger>
                    <TabsTrigger value="attestation">Attestation</TabsTrigger>
                  </TabsList>
                  <TabsContent value="links">
                    <div className="w-full mt-8 flex flex-col items-center justify-center">
                      {userProfile?.links?.map((link: any) => (
                        <LinkCard
                          key={link.name}
                          href={link.url}
                          title={link.name}
                          image="/LinkDefaultIcon.svg"
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="nfts">
                    <div className="grid md:grid-cols-3 grid-cols-2 gap-3 max-w-96 place-self-center mx-auto mt-8">
                      {isNFTLoading && <p>Loading...</p>}
                      {!isNFTLoading && nfts.length === 0 && (
                        <p>No NFTs Found</p>
                      )}
                      {nfts.map((nft: { image: string; address: string }) => {
                        return (
                          <Image
                            key={nft.image}
                            src={nft.image}
                            alt="nft-item"
                            className="h-auto w-full max-w-full rounded-md min-h-32"
                            width={128}
                            height={128}
                          />
                        );
                      })}
                    </div>
                  </TabsContent>
                  <TabsContent value="donate">
                    <div className="w-full mt-8 flex items-center justify-center">
                      <DonateCrypto
                        ethereumAddress={address as `0x${string}`}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="attestation">
                    <Attestations address={address} />
                  </TabsContent>
                </Tabs>
              ) : (
                <p>No User Found with address {address}</p>
              )}
            </div>
          </FadeIn>
        </Wrapper>
      </main>
      <BackgroundBeams />
    </>
  );
};

export default Page;
