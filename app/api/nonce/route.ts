import { createClient } from "@supabase/supabase-js";

const SUPABASE_TABLE_USER = "users";
import type { Database } from "@/types/supabase";

export async function POST(request: Request) {
  const req = await request.json();
  const { address } = req;
  const nonce = Math.floor(Math.random() * 1000000);

  const database = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

  const { data } = await database
    .from(SUPABASE_TABLE_USER)
    .select()
    .eq("address", address);

  console.log("get>usre", data);

  if (!!data && data.length > 0) {
    await database
      .from(SUPABASE_TABLE_USER)
      .update({
        auth: {
          genNonce: nonce,
          lastAuth: new Date().toISOString(),
          lastAuthStatus: "pending",
        },
      })
      .eq("address", address);
  } else {
    const res = await database.from(SUPABASE_TABLE_USER).insert({
      address,
      auth: {
        genNonce: nonce,
        lastAuth: new Date().toISOString(),
        lastAuthStatus: "pending",
      },
    });
    console.log("res", res);
  }

  return new Response(JSON.stringify({ nonce }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
