"use client";

import { useEffect, useState } from "react";

type Maybe<T> = T | null;

export const useNFTCollectibles = (
  owner: string
): {
  data: any;
  loading: boolean;
  error: Maybe<string>;
} => {
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Maybe<string>>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const allData = await fetchAlchemyAllData(owner);
        console.log('all data', allData)
        setData(allData);
      } catch (err) {
        console.error("error", error);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    if (owner) {
      load();
    }
  }, [owner]);

  return { data, loading, error };
};

const fetchAlchemyAllData = async (owner: string): Promise<Array<any>> => {
  let offset = 0;
  let data: Array<any> = [];
  let lastData: Array<any> = [];
  const limit = 50;
  do {
    // eslint-disable-next-line no-await-in-loop
    lastData = await fetchAlchemyData(owner);
    data = data.concat(lastData);
    offset += limit;
  } while (lastData.length > 0);
  return data;
};

const fetchAlchemyData = async (owner: string): Promise<Array<any>> => {
  console.log('owner', owner)
  const res = await fetch(`/api/alchemy?owner=${owner}`);
  const body = await res.text();
  const NFTs = JSON.parse(body);
  if (!NFTs) throw new Error(`Received ${NFTs} assets`);
  return NFTs;
};
