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
import { useWriteContract } from "wagmi";
import {
  WERK_NFT_CONTRACT_ADDRESS_SEPOLIA,
  META_LINKS_URL,
} from "@/lib/constants";

import { WERKNFT_ABI } from "@/lib/WerkNFT";
import { useW3upClient } from "@/lib/useW3upClient";

import { Attestations } from "@/components/Attestations";
import { useGetGitcoinPassportScore } from "@/lib/hooks/useGetGitcoinPassportScore";
import { useGetUserProfile } from "@/lib/hooks/useGetUserProfile";
import { useGetNfts } from "@/lib/hooks/useGetNfts";
import { BackgroundBeams } from "@/components/background-beams";

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
  const address = router.address as string;

  const w3storage = useW3upClient();

  const { score } = useGetGitcoinPassportScore(address);

  const { userProfile, isProfileLoading } = useGetUserProfile({ address });
  const { nfts, isNFTLoading } = useGetNfts({ address });

  const {
    data: hash,
    error: writeContractErr,
    writeContractAsync,
  } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>, player?: any) {
    e.preventDefault();

    const payload = {
      links: player.links,
      external_url: `${META_LINKS_URL}/${address}`,
      name: player.profile.name,
      image: player.profile.profileImageURL,
      description: player.profile.description,
      address: player.ethereumAddress,
    };

    const payloadString = JSON.stringify(payload);
    const blob = new Blob([payloadString], { type: "application/json" });

    const cid = await w3storage?.uploadFile(blob);
    const ipfsUrl = `ipfs://${cid}`;
    // const ipfsUrl =
    //   "ipfs://bafkreid7pqjb7jljrsy7xahod5sabmak5ripcm3dziuyswk7qxsh3ddeym";
    const coordinationStrategyId =
      "0x7e0bb5d32b56c645d0ec518278dbdd455ba9cb0aef4b5f5e1b948c3c8cc8bdf6";
    const commitmentStrategyId =
      "0x664b14947c4acefa12daff80395d2208043e7b616975fc8f20d23a0204cc2b25";
    const evaluationStrategyId =
      "0x90b92fef49f68b1f2508955e08ad8fcb052175afa2289b5883fc6660ce83c4f7";
    const fundingStrategyId =
      "0x554cdef72cf81a028dcca12b19667df6bee27e545aa7effb7639a14449b6652a";
    const payoutStrategyId =
      "0x28c0b3171d84a169a6516177f2a53929989d6278df8aacb2ad15c5ed6defa847";

    try {
      const res = await writeContractAsync({
        address: WERK_NFT_CONTRACT_ADDRESS_SEPOLIA,
        abi: WERKNFT_ABI,
        functionName: "mintWorkstream",
        args: [
          // address,
          "0xd3Fb8F20ca2d2a1ecaf3EA04AD37c37f60Ee36dc",
          ipfsUrl,
          coordinationStrategyId,
          commitmentStrategyId,
          evaluationStrategyId,
          fundingStrategyId,
          payoutStrategyId,
        ],
      });
    } catch (err) {
      console.log("err", err);
    }
  }

  if (isProfileLoading) {
    return <p></p>;
  }

  return (
    <>
      <main className="relative top-0 left-0 z-10">
        <div className="fixed flex gap-x-4 items-center top-3 right-3 z-10">
          <MainDrawer username={userProfile?.username} />
          <ConnectKitButton />
        </div>
        <Wrapper>
          <FadeIn>
            <div className="flex items-center flex-col mx-auto w-full justify-center px-2 md:px-8">
              <div className="h-40 w-40 mt-16 md:mt-32 md:h-72 md:w-72">
                <img
                  className="rounded-full h-40 w-40 md:h-72 md:w-72 border border-[12px] border-[rgba(255,255,255,0.04)]"
                  alt="Picture of the author"
                  src={toHTTP(userProfile?.profileImageIPFS ?? "")}
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
              {/* Mint Button */}
              {/* <form onSubmit={(e) => submit(e, data?.player[0])}>
              <button type="submit">Mint</button>
            </form> */}
              <Tabs defaultValue="links" className="w-full">
                <TabsList className="flex items-center justify-center">
                  <TabsTrigger value="links">Links</TabsTrigger>
                  <TabsTrigger value="nfts">NFTs</TabsTrigger>
                  {/* <TabsTrigger value="guilds">Guilds</TabsTrigger> */}
                  <TabsTrigger value="donate">Donate</TabsTrigger>
                  <TabsTrigger value="attestation">Attestation</TabsTrigger>
                </TabsList>
                <TabsContent value="links">
                  <div className="w-full mt-8 flex flex-col items-center justify-center">
                    {userProfile?.links?.map((link: any, index: number) => (
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
                    {!isNFTLoading && nfts.length === 0 && <p>No NFTs Found</p>}
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
                {/* <TabsContent value="guilds">
                <div className="w-full mt-8 flex flex-col items-center justify-center">
                  {data?.player[0]?.guilds.map(
                    ({ Guild: guild }: any, index: number) => (
                      <LinkCard
                        key={guild.name}
                        href={"/"}
                        title={guild.name}
                        image={toHTTP(guild.logo)}
                      />
                    )
                  )}
                </div>
              </TabsContent> */}
                <TabsContent value="donate">
                  <div className="w-full mt-8 flex items-center justify-center">
                    <DonateCrypto ethereumAddress={address as `0x${string}`} />
                  </div>
                </TabsContent>
                <TabsContent value="attestation">
                  <Attestations address={address} />
                </TabsContent>
              </Tabs>
            </div>
          </FadeIn>
        </Wrapper>
      </main>
      <BackgroundBeams />
    </>
  );
};

export default Page;
