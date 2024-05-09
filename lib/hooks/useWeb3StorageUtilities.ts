import { AnyLink } from "@web3-storage/w3up-client/dist/src/types";
import { useW3upClient } from "../useW3upClient";

export const useWeb3StorageUtilities = () => {
  const w3storage = useW3upClient();

  const uploadFileToWeb3Storage = async <T>({
    payload,
  }: {
    payload: T;
  }): Promise<AnyLink | undefined> => {
    const payloadString = JSON.stringify(payload);
    const blob = new Blob([payloadString], { type: "application/json" });

    const cid = await w3storage?.uploadFile(blob);

    return cid;
  };

  return {
    uploadFileToWeb3Storage,
  };
};
