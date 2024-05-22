export const airStackQuery = `
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
