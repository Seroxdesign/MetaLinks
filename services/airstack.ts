export const airStackQuery = `
  query MyQuery {
    Wallet(input: { identity: "vitalik.eth", blockchain: ethereum }) {
      socials {
        dappName
        profileName
      }
      addresses
    }
  }
`;
