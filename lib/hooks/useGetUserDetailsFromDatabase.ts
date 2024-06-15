"use client";

import { useSupabase } from "@/app/providers/supabase";
import { useState, useEffect } from "react";
import { toHTTP } from "@/utils/ipfs";

export type User = {
  name: string;
  ethereumAddress: string;
  description: string;
  profileImageURL: string;
  username: string;
  href: string;
};

// TODO: pagination
export const useSearchByUsernameOrAddress = (searchQuery: string) => {
  const [data, setData] = useState<User[] | null>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) return;

      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .or(`username.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`);

        if (error) {
          console.log("err", error);
          throw new Error("error searching users");
        }

        if (data && data.length > 0) {
          setData(
            data.map((user) => ({
              name: user.name || user.username || "",
              ethereumAddress: user.address,
              description: user.bio || "",
              profileImageURL: toHTTP(user.profileImageIPFS || ""),
              username: user.username || "",
              href: `/${user.address}`,
            }))
          );
        } else {
          setData([]);
        }
      } catch (err) {
        setError(err as Error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  return { data, error, isLoading };
};
