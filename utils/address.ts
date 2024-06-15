import { ethers } from "ethers";
import { ensUtils } from "./ensUtils";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export const checkAndReturnAddress = async ({
  inputAddressOrName,
  supabase,
}: {
  inputAddressOrName: string;
  supabase?: SupabaseClient<Database>;
}) => {
  // Check if the input is an Ethereum address
  const isAddress = ethers.isAddress(inputAddressOrName);
  if (isAddress) return inputAddressOrName;

  // Check if the input is an ENS address
  const isENSAddress = (inputAddressOrName as string).includes(".eth");
  if (isENSAddress) {
    const data = await ensUtils.resolveName(inputAddressOrName);
    if (!data) return false;
    return data.address;
  }

  // If supabase client is provided, query the users table with partial match
  if (supabase) {
    const { data, error } = await supabase
      .from("users")
      .select("address")
      .ilike("username", `%${inputAddressOrName}%`);

    if (error) {
      console.error("Error querying Supabase:", error);
      return false;
    }

    // If no matching address found, return false
    if (!data || data.length === 0) {
      return false;
    }

    // Return the address (or addresses if multiple matches found)
    return data.length === 1
      ? data[0].address
      : data.map((user) => user.address);
  }

  return false;
};
