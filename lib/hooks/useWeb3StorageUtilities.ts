import { AnyLink } from "@web3-storage/w3up-client/dist/src/types";
import { useW3upClient } from "../useW3upClient";
import { useState } from "react";

export const useWeb3StorageUtilities = () => {
  const [isUploading, setIsUploading] = useState(false);
  const w3storage = useW3upClient();

  const uploadFileToWeb3Storage = async <T>({
    payload,
  }: {
    payload: T;
  }): Promise<AnyLink | undefined> => {
    setIsUploading(true);
    const payloadString = JSON.stringify(payload);
    const blob = new Blob([payloadString], { type: "application/json" });

    const cid = await w3storage?.uploadFile(blob);
    setIsUploading(false);
    return cid;
  };

  return {
    uploadFileToWeb3Storage,
    isUploading,
  };
};
