// Implement our own query for bounties to include submissions
export const listBountys = /* GraphQL */ `
  query ListBountys(
    $filter: ModelBountyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBountys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        deadline
        amount
        rules
        owner
        outcome
        createdAt
        updatedAt
        submissions {
          items {
            id
          }
        }
      }
      nextToken
    }
  }
`;

export const getBounty = /* GraphQL */ `
  query GetBounty($id: ID!) {
    getBounty(id: $id) {
      id
      title
      deadline
      amount
      rules
      owner
      outcome
      submissions {
        items {
          id
        }
      }
      url
      createdAt
      updatedAt
    }
  }
`;
