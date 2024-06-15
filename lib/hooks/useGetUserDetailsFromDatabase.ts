import { useSupabase } from "@/app/providers/supabase";
import { useState, useEffect } from "react";

export type TUseFetchUserDetailsByUsername = {
  name: string;
  ethereumAddress: string;
  description: string;
  profileImageURL: string;
  username: string;
};

export const useFetchUserDetailsByUsername = (username: string) => {
  const [data, setData] = useState<TUseFetchUserDetailsByUsername[] | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .ilike("username", `%${username}%`);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setData(
            data.map((user) => ({
              name: user.name || user.username || "",
              ethereumAddress: user.address,
              description: user.bio || "",
              profileImageURL: user.profileImageIPFS || "",
              username: user.username || "",
            }))
          );
        } else {
          setData([]);
        }
      } catch (err) {
        // setError(err.message);
        setError(err as Error);
        setData(null);

        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return { data, error, isLoading };
};
