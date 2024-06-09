import { useSupabase } from "@/app/providers/supabase";
import { Database } from "@/types/supabase";
import { useState, useEffect, useCallback } from "react";
import {
  QueryResponse,
  useAirStack,
  useAirStackWithManualTrigger,
} from "./useAirStack";
import { SupabaseClient } from "@supabase/supabase-js";

interface UserProfile {
  address: string;
  username: string | null;
  profileImageIPFS: string | null;
  name: string | null;
  bio: string | null;
  backgroundImageIPFS?: string | null;
  links: { name: string; url: string }[];
}
interface UseUserProfileProps {
  address: string | null;
}

interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  isProfileLoading: boolean;
  error: Error | null;
}

/**
 * Creates a profile data object from the given query response.
 * @param p - The query response from AirStack.
 * @returns The formatted user profile data.
 */
const createProfileData = (data: QueryResponse["data"]): UserProfile => {
  const website =
    data?.farcasterSocials.Social?.[0].website ||
    data?.lensSocials.Social?.[0].website ||
    null;
  const twitter =
    data?.farcasterSocials.Social?.[0].twitterUserName ||
    data?.lensSocials.Social?.[0].twitterUserName ||
    null;

  const links = [
    {
      name: "farcaster",
      url: `https://warpcast.com/${data?.farcasterSocials.Social?.[0].profileName}`,
    },
    {
      name: "lens",
      url: `https://hey.xyz/${
        data?.lensSocials.Social?.[0].profileName.split("@")[1]
      }`,
    },
  ];

  if (website) {
    links.push({
      name: "website",
      url: website,
    });
  }

  if (twitter) {
    links.push({
      name: "twitter",
      url: `https://twitter.com/${twitter}`,
    });
  }

  return {
    address: data?.Wallet?.addresses?.[0] as string,
    username: data?.Wallet?.primaryDomain?.name as string,
    profileImageIPFS: data?.farcasterSocials.Social?.[0].profileImage as string,
    name: data?.farcasterSocials.Social?.[0].profileDisplayName as string,
    bio: data?.farcasterSocials.Social?.[0].profileBio as string,
    links,
  };
};

/**
 * Creates a user in Supabase using the provided address.
 * @param address - The user's address.
 * @param supabase - The Supabase client.
 * @returns A promise resolving to either the user data or an error message.
 */
const createUserInSupabase = async (
  address: string,
  supabase: SupabaseClient<Database>,
  profileData: UserProfile
): Promise<{ data?: any; error?: string }> => {
  try {
    console.log("address:", address);
    const data = await supabase.from("users").insert({
      address,
      username: profileData.username,
      bio: profileData.bio,
      profileImageIPFS: profileData.profileImageIPFS,
      backgroundImageIPFS: null,
      links: profileData.links,
    });

    return { data };
  } catch (err) {
    console.error("Error creating user", err);
    return { error: (err as Error).message };
  }
};

/**
 * Custom hook to get the user profile, with fallback to AirStack data if not found in Supabase.
 * @param address - The user's address.
 * @returns An object containing the user profile, loading state, and any error encountered.
 */
export const useGetUserProfile = ({
  address,
}: UseUserProfileProps): UseUserProfileReturn => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { supabase } = useSupabase();
  const {
    data: airStackData,
    loading: airStackLoading,
    error: airStackError,
    fetchData: fetchAirStackData,
  } = useAirStackWithManualTrigger({ identity: address });

  const getUserProfile = useCallback(async () => {
    if (!address) return;

    setIsProfileLoading(true);
    setError(null);

    try {
      const { data } = await supabase
        .from("users")
        .select()
        .eq("address", address)
        .single();

      if (data) {
        setUserProfile(data as any);
      } else {
        fetchAirStackData();
      }
    } catch (err) {
      setError(err as Error);
      console.error("Something went wrong", err);
    } finally {
      setIsProfileLoading(false);
    }
  }, [address, supabase]);

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    if (airStackData && !userProfile) {
      setIsProfileLoading(true);
      const profileData = createProfileData(airStackData);
      setUserProfile(profileData);
      setIsProfileLoading(false);
      // Create user in Supabase in the background
      createUserInSupabase(address!, supabase, profileData);
    }
  }, [airStackData, userProfile]);

  return {
    userProfile,
    isProfileLoading: isProfileLoading || airStackLoading,
    error: error || airStackError,
  };
};
