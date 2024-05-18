"use client";

import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { profileQuery } from "@/services/apollo";
import { toHTTP } from "@/utils/ipfs";
import { useParams } from "next/navigation";
import Wrapper from "@/components/Wrapper";
import { FadeIn } from "@/components/FadeIn";
import Image from "next/image";
import { useNFTCollectibles } from "@/lib/hooks/useNFTCollectibles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonateCrypto from "@/components/DonateCrypto";
import { ConnectKitButton } from "connectkit";
import MainDrawer from "@/components/MoreOptionsDropdown";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import {
  WERK_NFT_CONTRACT_ADDRESS_SEPOLIA,
  META_LINKS_URL,
} from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WERKNFT_ABI } from "@/lib/WerkNFT";
import { useW3upClient } from "@/lib/useW3upClient";
import { useEAS } from "@/lib/hooks/useEAS";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TAttestations } from "@/lib/zod-utils";
import Loader from "@/components/ui/loader";
import { getTimeDifference } from "@/lib/get-time-diiference";

const FormSchema = z.object({
  attestation: z.string().min(2, {
    message: "Attestation must be at least 2 characters.",
  }),
});

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

const AttestationItem = ({ timeCreated, attestationVal, attestor }: any) => {
  const timeDifference = getTimeDifference(timeCreated);
  return (
    <div className="flex w-full bg-[#0e0e0e] flex-col px-6 py-4 justify-center rounded-2xl border-l border-t border-[rgba(255,255,255,0.1)] drop-shadow-md">
      <p className="font-semibold text-lg mb-4">{attestationVal}</p>
      <p className="font-light text-xs">By {attestor}</p>
      <p className="font-light text-xs">{timeDifference}</p>
    </div>
  );
};

const Attestations = ({ address }: { address: string }) => {
  const { attest, getAttestationsForRecipient, isLoading } = useEAS();
  const [attestation, setAttestion] = useState<string>("");
  const [attestations, setAttestations] = useState<TAttestations>([]);
  const [isAttesting, setIsAttesting] = useState(false);

  // TODO: later move it to tRPC
  useEffect(() => {
    const getAttestationData = async () => {
      const attestationData = await getAttestationsForRecipient(address);
      if (attestationData) {
        setAttestations(attestationData);
      }
    };
    getAttestationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isAttesting]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      attestation: "",
    },
  });

  async function handleAttest(data: z.infer<typeof FormSchema>) {
    try {
      const { attestation } = data;
      setIsAttesting(true);
      await attest(attestation, address);
      form.reset();
    } catch (err) {
    } finally {
      setIsAttesting(false);
    }
  }

  return isLoading ? (
    <p className="text-center">Loading...</p>
  ) : (
    <div className="max-w-xl flex flex-col items-center mx-auto">
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex items-center py-3 justify-center font-semibold text-white p-1 w-full hover:scale-105 transition-all bg-purple rounded-xl my-3 max-w-md">
            Attest
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px] bg-transparent">
          <DialogHeader>
            <DialogTitle>Create Attestation</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAttest)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="attestation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        placeholder="Write something..."
                        className="w-full p-3 rounded-md min-h-24 bg-zinc-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isAttesting && <Loader />}

              <DialogFooter>
                <Button disabled={isAttesting} type="submit">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-3 w-full">
        {attestations?.map((att, i) => {
          const attestor = att[3].value;
          const timeCreated = att[1].value.value;

          const attestationVal = att[0].value;
          return (
            <AttestationItem
              key={i}
              timeCreated={timeCreated}
              attestor={attestor}
              attestationVal={attestationVal.value}
            />
          );
        })}
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  // Get the address from the router params
  const router = useParams();
  const w3storage = useW3upClient();
  const address = router.address as string;
  const {
    loading: nftLoading,
    error: nftError,
    data: nfts,
  } = useNFTCollectibles(address);

  const {
    data: hash,
    error: writeContractErr,
    writeContractAsync,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

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
      console.log("res", res);
    } catch (err) {
      console.log("err", err);
    }
  }

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
    <main className="relative top-0 left-0">
      <Image
        alt="background-image"
        src="/Banner.svg"
        height="380"
        width="2000"
        style={{ zIndex: -2 }}
        className="absolute top-0 left-0 object-cover md:h-96 min-h-48 w-full"
      />
      <div className="fixed flex gap-x-4 items-center top-3 right-3 z-10">
        <MainDrawer username={profile?.username} />
        <ConnectKitButton />
      </div>
      <Wrapper>
        <FadeIn>
          <div className="flex items-center flex-col mx-auto w-full justify-center px-2 md:px-8">
            <div className="h-40 w-40 mt-16 md:mt-32 md:h-72 md:w-72">
              <img
                className="rounded-full h-40 w-40 md:h-72 md:w-72 border border-[12px] border-[rgba(255,255,255,0.04)]"
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
            {/* Mint Button */}
            {/* <form onSubmit={(e) => submit(e, data?.player[0])}>
              <button type="submit">Mint</button>
            </form> */}
            <Tabs defaultValue="links" className="w-full">
              <TabsList className="flex items-center justify-center">
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="nfts">NFTs</TabsTrigger>
                <TabsTrigger value="guilds">Guilds</TabsTrigger>
                <TabsTrigger value="donate">Donate</TabsTrigger>
                <TabsTrigger value="attestation">Attestation</TabsTrigger>
              </TabsList>
              <TabsContent value="links">
                <div className="w-full mt-8 flex flex-col items-center justify-center">
                  {data?.player[0]?.links.map((link: any, index: number) => (
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
                </div>
              </TabsContent>
              <TabsContent value="guilds">
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
              </TabsContent>
              <TabsContent value="donate">
                <div className="w-full mt-8 flex items-center justify-center">
                  <DonateCrypto
                    ethereumAddress={
                      data?.player[0]?.ethereumAddress as `0x${string}`
                    }
                  />
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
  );
};

export default Page;
