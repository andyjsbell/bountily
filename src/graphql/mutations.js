/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBounty = /* GraphQL */ `
  mutation CreateBounty(
    $input: CreateBountyInput!
    $condition: ModelBountyConditionInput
  ) {
    createBounty(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const updateBounty = /* GraphQL */ `
  mutation UpdateBounty(
    $input: UpdateBountyInput!
    $condition: ModelBountyConditionInput
  ) {
    updateBounty(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteBounty = /* GraphQL */ `
  mutation DeleteBounty(
    $input: DeleteBountyInput!
    $condition: ModelBountyConditionInput
  ) {
    deleteBounty(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const createSubmission = /* GraphQL */ `
  mutation CreateSubmission(
    $input: CreateSubmissionInput!
    $condition: ModelSubmissionConditionInput
  ) {
    createSubmission(input: $input, condition: $condition) {
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
export const updateSubmission = /* GraphQL */ `
  mutation UpdateSubmission(
    $input: UpdateSubmissionInput!
    $condition: ModelSubmissionConditionInput
  ) {
    updateSubmission(input: $input, condition: $condition) {
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
export const deleteSubmission = /* GraphQL */ `
  mutation DeleteSubmission(
    $input: DeleteSubmissionInput!
    $condition: ModelSubmissionConditionInput
  ) {
    deleteSubmission(input: $input, condition: $condition) {
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
