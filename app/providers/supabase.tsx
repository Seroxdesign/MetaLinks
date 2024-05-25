"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";


// Create a context
const SupabaseContext = createContext<null | {
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    supabase: ReturnType<typeof createClient>;
  }>(null);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabaseNew = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const [token, setToken] = useState<string | null>(null);
  const [supabase, setSupabase] = useState(supabaseNew);

  useEffect(() => {
    if (!token) {
      return;
    }
    const newSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    });
    newSupabase.realtime.accessToken = token;
    setSupabase(newSupabase);
  }, [token]);

  return (
    <SupabaseContext.Provider value={{ supabase, setToken }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

export default SupabaseProvider;
