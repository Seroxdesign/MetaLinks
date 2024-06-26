import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { getAddress } from "viem";
import { useEthersSigner } from "../eas-wagmi-utils";
import { ZAttestations } from "@/lib/zod-utils";


// EAS Schema https://optimism.easscan.org/schema/view/0xd4c0003240401da8b17fbe710a41e4c8e690a0afef796ab6d5871b69ac15b0d1

const easContractAddress = "0x4200000000000000000000000000000000000021";
const schemaUID =
  "0xd4c0003240401da8b17fbe710a41e4c8e690a0afef796ab6d5871b69ac15b0d1";
const eas = new EAS(easContractAddress);

export const useEAS = () => {
  const [connectedEAS, setConnectedEAS] = useState<EAS | null>(null);
  const { address } = useAccount();
  const signer = useEthersSigner();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const connectEAS = async () => {
      if (signer) {
        eas.connect(signer);
      }
      setConnectedEAS(eas);
    };
    connectEAS();
  }, [signer]);

  const attest = async (message: string, attestee: string, xp?: string) => {
    if (!address) return undefined;
    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "string attestation,string timeCreated,string xp"
    );
    const timeRightNow = new Date().toDateString();
    const encodedData = schemaEncoder.encodeData([
      { name: "attestation", value: message, type: "string" },
      { name: "timeCreated", value: timeRightNow, type: "string" },
      { name: "xp", value: xp ?? "0", type: "string" },
    ]);
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: attestee,
        expirationTime: BigInt(0),
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });
    const newAttestationUID = await tx.wait();
    return newAttestationUID;
  };

  const getAttestationsForRecipient = async (recipient: string) => {
    try {
      setLoading(true);
      // Define the GraphQL query
      const query = `
        query Attestations($recipient: String!) {
          attestations(
            where: {
              schemaId: { equals: "0xd4c0003240401da8b17fbe710a41e4c8e690a0afef796ab6d5871b69ac15b0d1" }
              recipient: { equals: $recipient }
            }
            take: 25
          ) {
            id
            attester
            recipient
            refUID
            revocable
            revocationTime
            expirationTime
            data
            schemaId
            timeCreated
          }
        }
      `;
      const checkSumAddress = getAddress(recipient);

      // Define the GraphQL endpoint
      const endpoint = "https://optimism.easscan.org/graphql";

      // Send POST request with fetch
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { recipient: checkSumAddress },
        }),
      });
      // Parse response JSON
      const responseData = await response.json();
      const schemaEncoder = new SchemaEncoder(
        "string attestation,string timeCreated,string xp"
      );
      const res = responseData?.data?.attestations.filter((attestation: any) => {
        return !attestation.data.includes("sig");
      });
      const decodedData = res.map(
        (attestation: any) =>
          schemaEncoder.decodeData(attestation.data).concat([
            {
              name: "attester",
              value: attestation.attester,
              signature: "",
              type: "string",
            },
          ])
      );
      const parsedData= ZAttestations.parse(decodedData)

      return parsedData;
    } catch (err) {
      // Handle any errors
      console.error("Error fetching data:", err);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { connectedEAS, attest, getAttestationsForRecipient, isLoading };
};
