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
      url
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
      url
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
      url
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
export const createWallet = /* GraphQL */ `
  mutation CreateWallet(
    $input: CreateWalletInput!
    $condition: ModelWalletConditionInput
  ) {
    createWallet(input: $input, condition: $condition) {
      id
      user
      balance
      createdAt
      updatedAt
    }
  }
`;
export const updateWallet = /* GraphQL */ `
  mutation UpdateWallet(
    $input: UpdateWalletInput!
    $condition: ModelWalletConditionInput
  ) {
    updateWallet(input: $input, condition: $condition) {
      id
      user
      balance
      createdAt
      updatedAt
    }
  }
`;
export const deleteWallet = /* GraphQL */ `
  mutation DeleteWallet(
    $input: DeleteWalletInput!
    $condition: ModelWalletConditionInput
  ) {
    deleteWallet(input: $input, condition: $condition) {
      id
      user
      balance
      createdAt
      updatedAt
    }
  }
`;
export const createTransaction = /* GraphQL */ `
  mutation CreateTransaction(
    $input: CreateTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    createTransaction(input: $input, condition: $condition) {
      id
      from
      to
      amount
      createdAt
      updatedAt
    }
  }
`;
export const updateTransaction = /* GraphQL */ `
  mutation UpdateTransaction(
    $input: UpdateTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    updateTransaction(input: $input, condition: $condition) {
      id
      from
      to
      amount
      createdAt
      updatedAt
    }
  }
`;
export const deleteTransaction = /* GraphQL */ `
  mutation DeleteTransaction(
    $input: DeleteTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    deleteTransaction(input: $input, condition: $condition) {
      id
      from
      to
      amount
      createdAt
      updatedAt
    }
  }
`;
