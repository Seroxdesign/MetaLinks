export const airStackQuery = /* GraphQL */ `
  query GetProfileInfo($identity: Identity!) {
    Domains(
      input: { filter: { owner: { _eq: $identity } }, blockchain: ethereum }
    ) {
      Domain {
        tokenAddress
        tokenId
        avatar
        dappName
        dappSlug
        name
      }
    }
    Wallet(input: { identity: $identity, blockchain: ethereum }) {
      addresses
      primaryDomain {
        name
        avatar
        tokenNft {
          contentValue {
            image {
              small
            }
          }
        }
      }
      domains(input: { filter: { isPrimary: { _eq: false } } }) {
        name
        avatar
        tokenNft {
          contentValue {
            image {
              small
            }
          }
        }
      }
      xmtp {
        isXMTPEnabled
      }
    }
    TokenBalances(
      input: {
        filter: {
          owner: { _eq: $identity }
          tokenType: { _in: [ERC721, ERC1155] }
        }
        blockchain: ethereum
        limit: 50
      }
    ) {
      TokenBalance {
        tokenAddress
        amount
        formattedAmount
        tokenType
        tokenNfts {
          address
          tokenId
          blockchain
          contentValue {
            image {
              original
            }
          }
        }
      }
      pageInfo {
        nextCursor
        prevCursor
        hasNextPage
        hasPrevPage
      }
    }

    farcasterSocials: Socials(
      input: {
        filter: { identity: { _eq: $identity }, dappName: { _eq: farcaster } }
        blockchain: ethereum
        order: { followerCount: DESC }
      }
    ) {
      Social {
        twitterUserName
        profileUrl
        website
        isDefault
        blockchain
        dappName
        profileName
        profileDisplayName
        profileHandle
        profileImage
        profileBio
        followerCount
        followingCount
        profileTokenId
        profileTokenAddress
        profileCreatedAtBlockTimestamp
        profileImageContentValue {
          image {
            small
          }
        }
        socialCapital {
          socialCapitalScore
        }
      }
    }
    lensSocials: Socials(
      input: {
        filter: { identity: { _eq: $identity }, dappName: { _eq: lens } }
        blockchain: ethereum
        order: { followerCount: DESC }
      }
    ) {
      Social {
        twitterUserName
        profileUrl
        website
        isDefault
        blockchain
        dappName
        profileName
        profileDisplayName
        profileHandle
        profileImage
        profileBio
        followerCount
        followingCount
        profileTokenId
        profileTokenAddress
        profileCreatedAtBlockTimestamp
        profileImageContentValue {
          image {
            small
          }
        }
        socialCapital {
          socialCapitalScore
        }
      }
    }
  }
`;

// Define types for the query response
export interface AirStackQueryResponse {
  Domains: {
    Domain: Array<{
      tokenAddress: string;
      tokenId: string;
      avatar: string;
      dappName: string;
      dappSlug: string;
      name: string;
    }>;
  };
  Wallet: {
    addresses: string[];
    primaryDomain: {
      name: string;
      avatar: string;
      tokenNft: {
        contentValue: {
          image: {
            small: string;
          };
        };
      };
    } | null;
    domains: Array<{
      name: string;
      avatar: string;
      tokenNft: {
        contentValue: {
          image: {
            small: string;
          };
        };
      };
    }>;
    xmtp: {
      isXMTPEnabled: boolean;
    };
  };
  TokenBalances: {
    TokenBalance: Array<{
      tokenAddress: string;
      amount: string;
      formattedAmount: string;
      tokenType: string;
      tokenNfts: Array<{
        address: string;
        tokenId: string;
        blockchain: string;
        contentValue: {
          image: {
            original: string;
          };
        };
      }>;
    }>;
    pageInfo: {
      nextCursor: string | null;
      prevCursor: string | null;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  farcasterSocials: {
    Social: Array<{
      isDefault: boolean;
      blockchain: string;
      dappName: string;
      profileName: string;
      profileDisplayName: string;
      profileHandle: string;
      profileImage: string;
      profileBio: string;
      followerCount: number;
      followingCount: number;
      profileTokenId: string;
      profileTokenAddress: string;
      profileCreatedAtBlockTimestamp: string;
      twitterUserName: string;
      website: string;
      profileImageContentValue: {
        image: {
          small: string;
        };
      };
      socialCapital: {
        socialCapitalScore: number;
      };
    }>;
  };
  lensSocials: {
    Social: Array<{
      isDefault: boolean;
      blockchain: string;
      dappName: string;
      profileName: string;
      profileDisplayName: string;
      profileHandle: string;
      profileImage: string;
      profileBio: string;
      followerCount: number;
      followingCount: number;
      profileTokenId: string;
      profileTokenAddress: string;
      profileCreatedAtBlockTimestamp: string;
      twitterUserName: string;
      website: string;
      profileImageContentValue: {
        image: {
          small: string;
        };
      };
      socialCapital: {
        socialCapitalScore: number;
      };
    }>;
  };
}

export const GET_NFTS_QUERY = /* GraphQL */ `
  query GetNFTs($Identity: [Identity!]) {
    ethereum: TokenBalances(
      input: {
        filter: {
          owner: { _in: $Identity }
          tokenType: { _in: [ERC1155, ERC721] }
        }
        blockchain: ethereum
        limit: 50
      }
    ) {
      TokenBalance {
        tokenAddress
        amount
        formattedAmount
        tokenType
        token {
          isSpam
          name
        }
        tokenNfts {
          address
          tokenId
          blockchain
          contentValue {
            image {
              original
            }
          }
        }
      }
      pageInfo {
        nextCursor
        prevCursor
        hasNextPage
        hasPrevPage
      }
    }
    base: TokenBalances(
      input: {
        filter: {
          owner: { _in: $Identity }
          tokenType: { _in: [ERC1155, ERC721] }
        }
        blockchain: base
        limit: 50
      }
    ) {
      TokenBalance {
        tokenAddress
        amount
        formattedAmount
        tokenType
        tokenNfts {
          address
          tokenId
          blockchain
          contentValue {
            image {
              original
            }
          }
        }
      }
      pageInfo {
        nextCursor
        prevCursor
        hasNextPage
        hasPrevPage
      }
    }
  }
`;
