import { isAddress } from "@ethersproject/address";
import { Alchemy, Network } from "alchemy-sdk";

import { AlchemyMultichainClient } from "@/lib/alchemy-multichain-client";

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET,
  network: Network.ETH_MAINNET,
};

const overrides = {
  [Network.MATIC_MAINNET]: {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_MATIC,
  },
  [Network.OPT_MAINNET]: {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM,
  },
};

const alchemy = new AlchemyMultichainClient(config, overrides);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");

  if (!owner) {
    return Response.json(
      { error: `Missing Owner Address` },
      {
        status: 400,
      }
    );
  }

  if (isAddress(owner as string)) {
    try {
      const mainnetNfts = await alchemy
        .forNetwork(Network.ETH_MAINNET)
        .nft.getNftsForOwner(owner as string, { pageSize: 5 });

      const maticNfts = await alchemy
        .forNetwork(Network.MATIC_MAINNET)
        .nft.getNftsForOwner(owner as string, { pageSize: 5 });

      const optimismNfts = await alchemy
        .forNetwork(Network.OPT_MAINNET)
        .nft.getNftsForOwner(owner as string, { pageSize: 5 });

      return Response.json({ mainnetNfts, maticNfts, optimismNfts });
    } catch (err) {
      const status = 500;
      const msg = (err as Error).message;
      return Response.json(
        { error: msg },
        {
          status,
        }
      );
    }
  } else if (!isAddress(owner as string)) {
    return Response.json(
      { error: `Invalid Owner Address` },
      {
        status: 400,
      }
    );
  } else {
    return Response.json(
      { error: `Incorrect Method: ${req.method} (GET Supported)` },
      {
        status: 405,
      }
    );
  }
}
