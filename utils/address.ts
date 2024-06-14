import { ethers } from "ethers";
import { ensUtils } from "./ensUtils";

export const checkAndReturnAddress = async (inputAddressOrName: string) => {
  const isAddress = ethers.isAddress(inputAddressOrName);
  if (isAddress) return inputAddressOrName;

  const isENSAddress = (inputAddressOrName as string).includes(".eth");
  if (isENSAddress) {
    const data = await ensUtils.resolveName(inputAddressOrName);
    if (!data) return false;
    return data.address;
  } else {
    // Write logic to get data of users whose username is similar to inputAddressOrName
  }
  return false;
};
