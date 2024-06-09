import { useState, useEffect } from "react";
import { useQuery } from "@airstack/airstack-react";
import { GET_NFTS_QUERY } from "@/services/airstack";

type NFT = {
  image: string;
  address: string;
};

type TokenBalance = {
  tokenNfts?: {
    contentValue?: {
      image?: {
        original?: string;
      };
    };
    address?: string;
  };
};

type GetNfTsQuery = {
  base?: {
    TokenBalance?: TokenBalance[];
  };
  ethereum?: {
    TokenBalance?: TokenBalance[];
  };
};

type GetNfTsQueryVariables = {
  Identity: string[];
};

export const useGetNfts = ({ address }: { address: string | null }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);

  const {
    data: nftData,
    loading: isNFTLoading,
    error,
  } = useQuery<GetNfTsQuery, GetNfTsQueryVariables>(GET_NFTS_QUERY, {
    Identity: [address ?? ""],
  });

  useEffect(() => {
    if (nftData && !isNFTLoading) {
      const baseNfts =
        nftData?.base?.TokenBalance?.map((tokenBalance) => {
          return {
            image: tokenBalance.tokenNfts?.contentValue?.image?.original,
            address: tokenBalance?.tokenNfts?.address,
          };
        }) ?? [];

      const ethereumNfts =
        nftData?.ethereum?.TokenBalance?.map((tokenBalance) => {
          return {
            image: tokenBalance.tokenNfts?.contentValue?.image?.original,
            address: tokenBalance?.tokenNfts?.address,
          };
        }) ?? [];

      const allNfts = baseNfts
        .concat(ethereumNfts)
        .filter((nft): nft is NFT => !!nft.image && !!nft.address);

      setNfts(allNfts);
    }
  }, [nftData, isNFTLoading]);

  return { nfts, isNFTLoading, error };
};
