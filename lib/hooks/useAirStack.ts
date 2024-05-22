// This file contains custom hooks for interacting with the AirStack API using the Airstack SDK.
// For more details and documentation, visit the Airstack SDK GitHub repository:
// https://github.com/Airstack-xyz/airstack-web-sdk
// https://app.airstack.xyz/query/UMgiOv8Uwk?_gl=1*1jhw5ra*_ga*MTEwOTIxNDU0MC4xNzE1NzEwMzI5*_ga_6PP294SC61*MTcxNTk1Nzc5Ny4zLjEuMTcxNTk2MzA1Ny4wLjAuMA..

import { airStackQuery } from "@/services/airstack";
import { useLazyQuery, useQuery } from "@airstack/airstack-react";

interface QueryResponse {
  data: any | null;
  loading: boolean;
  error: Error | null;
}

interface Error {
  message: string;
}

type TAirStackQuery = {
  identity: string;
};

/**
 * Hook that loads query data as soon as the component is mounted.
 * It returns an object with the following properties:
 * - data: the data returned by the query.
 * - loading: a boolean indicating whether the query is currently loading.
 * - error: any error that occurred while loading the query.
 */
export const useAirStack = ({ identity }: TAirStackQuery) => {
  const { data, loading, error }: QueryResponse = useQuery(
    airStackQuery,
    { identity: identity },
    { cache: true }
  );

  return {
    data,
    loading,
    error,
  };
};

/**
 * Hook that is used to fetch query data manually, instead of automatically when the component mounts.
 * It returns an array with two items:
 * - fetch: a function that can be called to execute the query.
 * - an object with the same properties as the object returned by useAirStack: data, loading, and error.
 */
export const useAirStackWithManualTrigger = ({ identity }: TAirStackQuery) => {
  const [fetch, { data, loading, error }] = useLazyQuery(
    airStackQuery,
    { variables: { identity } },
    { cache: true }
  );

  const fetchData = () => {
    fetch();
  };

  return {
    data,
    loading,
    error,
    fetchData,
  };
};
