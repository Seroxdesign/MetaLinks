import { ethers } from "ethers";

const mainnetProvider = new ethers.JsonRpcProvider(
  "https://rpc-endpoints.superfluid.dev/eth-mainnet",
  "mainnet"
);

export const ensUtils = {
  resolveName: async (name: string) => {
    if (!name.includes(".")) {
      return null;
    }

    const address = await mainnetProvider.resolveName(name);
    return address ? { name, address } : null;
  },
  lookupAddress: async (address: string) => {
    const name = await mainnetProvider.lookupAddress(address);
    return name ? { name, address: ethers.getAddress(address) } : null;
  },
  lookupAvatar: async (address: string) => {
    const avatar = await mainnetProvider.getAvatar(address);
    return avatar ? { address, avatar } : null;
  },
};
