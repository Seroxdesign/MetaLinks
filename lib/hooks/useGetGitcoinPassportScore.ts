import { submitPassport } from "@/services/gitcoinPassport";
import { useEffect, useState } from "react";

export const useGetGitcoinPassportScore = (address: string) => {
  const [score, setScore] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScore = async () => {
      setLoading(true);
      try {
        const response = await submitPassport(address as string);
        if (response.status === "DONE") {
          const data = response.score;
          setScore(parseFloat(data).toFixed(2));
        } else {
          setError("Error fetching score");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [address]);

  return { score, loading, error };
};
