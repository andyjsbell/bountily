/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBounty = /* GraphQL */ `
  subscription OnCreateBounty {
    onCreateBounty {
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
export const onUpdateBounty = /* GraphQL */ `
  subscription OnUpdateBounty {
    onUpdateBounty {
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
export const onDeleteBounty = /* GraphQL */ `
  subscription OnDeleteBounty {
    onDeleteBounty {
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
export const onCreateSubmission = /* GraphQL */ `
  subscription OnCreateSubmission {
    onCreateSubmission {
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
export const onUpdateSubmission = /* GraphQL */ `
  subscription OnUpdateSubmission {
    onUpdateSubmission {
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
export const onDeleteSubmission = /* GraphQL */ `
  subscription OnDeleteSubmission {
    onDeleteSubmission {
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
export const onCreateWallet = /* GraphQL */ `
  subscription OnCreateWallet {
    onCreateWallet {
      id
      user
      balance
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateWallet = /* GraphQL */ `
  subscription OnUpdateWallet {
    onUpdateWallet {
      id
      user
      balance
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteWallet = /* GraphQL */ `
  subscription OnDeleteWallet {
    onDeleteWallet {
      id
      user
      balance
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTransaction = /* GraphQL */ `
  subscription OnCreateTransaction {
    onCreateTransaction {
      id
      from
      to
      amount
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTransaction = /* GraphQL */ `
  subscription OnUpdateTransaction {
    onUpdateTransaction {
      id
      from
      to
      amount
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTransaction = /* GraphQL */ `
  subscription OnDeleteTransaction {
    onDeleteTransaction {
      id
      from
      to
      amount
      createdAt
      updatedAt
    }
  }
`;
