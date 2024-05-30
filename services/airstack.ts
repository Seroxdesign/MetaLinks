export const airStackQuery = /* GraphQL */ `
  query GetProfileInfo($identity: Identity!) {
    Wallet(input: { identity:  $identity, blockchain: ethereum }) {
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
