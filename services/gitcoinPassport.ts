export const submitPassport = async (address: string) => {
  const url = "https://api.scorer.gitcoin.co/registry/submit-passport";
  const scoreId = process.env.NEXT_PUBLIC_GITCOIN_SCORER_ID;
  const body = JSON.stringify({
    address: address,
    signature: "",
    scorer_id: scoreId,
    community: "deprecated",
    nonce: "",
  });

  const response = await callGitcoinApi(url, "POST", body);
  if (response.ok) {
    const data = await response.json();

    return data;
  } else {
    const scoreUrl = `https://api.scorer.gitcoin.co/registry/score/${scoreId}/${address}`;
    const scoreResponse = await callGitcoinApi(scoreUrl, "GET");
    return scoreResponse;
  }
};

const callGitcoinApi = async (url: string, method: string, body?: any) => {
  const response = await fetch(url, {
    method,
    body: body || undefined,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.NEXT_PUBLIC_GITCOIN_PASSPORT_API_KEY || "",
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("API request failed with status " + response.status);
  }
};
