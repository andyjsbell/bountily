/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
        nextToken
      }
      url
      createdAt
      updatedAt
    }
  }
`;
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
        url
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSubmission = /* GraphQL */ `
  query GetSubmission($id: ID!) {
    getSubmission(id: $id) {
      id
      bountyID
      bounty {
        id
        title
        deadline
        amount
        rules
        owner
        outcome
        url
        createdAt
        updatedAt
      }
      owner
      answer
      outcome
      createdAt
      updatedAt
    }
  }
`;
export const listSubmissions = /* GraphQL */ `
  query ListSubmissions(
    $filter: ModelSubmissionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubmissions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        bountyID
        owner
        answer
        outcome
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
