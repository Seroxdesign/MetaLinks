import { airStackQuery } from "@/services/airstack";
import { useQuery } from "@airstack/airstack-react";

interface QueryResponse {
  data: Data | null;
  loading: boolean;
  error: Error | null;
}

interface Data {
  Wallet: Wallet;
}

interface Error {
  message: string;
}

interface Wallet {
  socials: Social[];
  addresses: string[];
}

interface Social {
  dappName: "lens" | "farcaster";
  profileName: string;
}

export const useAirStack = () => {
  const { data, loading, error }: QueryResponse = useQuery<Data>(
    airStackQuery,
    {},
    { cache: false }
  );

  return {
    data,
    loading,
    error,
  };
};
