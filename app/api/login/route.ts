import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import type { Database } from "@/types/supabase";
import { z } from "zod";

const SUPABASE_TABLE_USERS = "users";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const reqBody = z.object({
  signedMessage: z.string(),
  address: z.string(),
  nonce: z.number(),
});

export async function POST(request: Request) {
  const req = await request.json();
  const { signedMessage, address, nonce } = reqBody.parse(req);
  console.log("address.address", address, signedMessage);

  const message = `I am signing this message to authenticate my address with my account on Meta links.`;

  const signerAddress = ethers.verifyMessage(message, signedMessage);
  console.log("signerAddress", signerAddress);

  if (signerAddress.toLowerCase() !== address.toLowerCase()) {
    return Response.json(
      { message: "The message was NOT signed by the expected address" },
      {
        status: 400,
      }
    );
  }

  const { data } = await supabase
    .from(SUPABASE_TABLE_USERS)
    .select()
    .eq("address", address)
    .single();

  if (data?.auth && typeof data.auth === "object" && "genNonce" in data.auth && data?.auth?.genNonce !== nonce) {
    return Response.json(
      { message: "The nonce does not match." },
      {
        status: 400,
      }
    );
  }

  // console.log("data", data);

  let authUser;
  if (!data?.id) {
    const { data: userData, error } = await supabase.auth.admin.createUser({
      email: `${address}@email.com`,
      user_metadata: { address: address },
    });
    if (error) {
      console.log("error creating user", error.status, error.message);
      return Response.json(
        { error: error.message },
        {
          status: 500,
        }
      );
    }
    authUser = userData.user;
  } else {
    const { data: userData, error } = await supabase.auth.admin.getUserById(
      data.id
    );
    // console.log("userData", userData, error);

    if (error) {
      console.log("error getting user", error.status, error.message);
      return Response.json(
        { error },
        {
          status: 500,
        }
      );
    }
    authUser = userData.user;
  }

  let newNonce = Math.floor(Math.random() * 1000000);
  while (newNonce === nonce) {
    newNonce = Math.floor(Math.random() * 1000000);
  }

  const updateUsers = await supabase
    .from(SUPABASE_TABLE_USERS)
    .update({
      auth: {
        genNonce: nonce,
        lastAuth: new Date().toISOString(),
        lastAuthStatus: "success",
      },
      id: authUser.id,
    })
    .eq("address", address);

  console.log("updateUsers", updateUsers);

  const token = jwt.sign(
    {
      address: address,
      sub: authUser.id,
      aud: "authenticated",
    },
    process.env.SUPABASE_JWT as string,
    { expiresIn: 60 * 2 }
  );

  return Response.json(
    { token },
    {
      status: 200,
    }
  );
}
