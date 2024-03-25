import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const client = new ApolloClient({
  uri:
    process.env.NEXT_PUBLIC_METAGAME_GRAPHQL_API ??
    (() => {
      throw new Error("Missing env var NEXT_PUBLIC_METAGAME_GRAPHQL_API");
    }),
  cache: new InMemoryCache(),
});

export const profileQuery = gql`
  query Profile($address: String!) {
    player(where: { ethereumAddress: { _ilike: $address } }) {
      ethereumAddress
      links {
        name
        type
        url
      }
      profile {
        username
        name
        profileImageURL
        description
        timeZone
      }
      guilds {
        Guild {
          guildname
          name
          logo
        }
      }
    }
  }
`;

export const searchProfiles = gql`
  query SearchPlayers(
    $search: String!
    $forLoginDisplay: Boolean! = false
    $limit: Int = 20
  ) {
    player(
      where: {
        _or: [
          {
            profile: {
              username: { _ilike: $search }
              name: { _ilike: $search }
            }
          }
          { ethereumAddress: { _ilike: $search } }
        ]
      }
      limit: $limit
    ) {
      ethereumAddress
      links {
        name
        type
        url
      }
      profile {
        username
        name
        profileImageURL
        description
        timeZone
      }
      guilds {
        Guild {
          guildname
          name
          logo
        }
      }
    }
  }
`;
