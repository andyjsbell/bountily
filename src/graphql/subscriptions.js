/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBounty = /* GraphQL */ `
  subscription OnCreateBounty {
    onCreateBounty {
      id
      title
      date
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
export const onUpdateBounty = /* GraphQL */ `
  subscription OnUpdateBounty {
    onUpdateBounty {
      id
      title
      date
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
export const onDeleteBounty = /* GraphQL */ `
  subscription OnDeleteBounty {
    onDeleteBounty {
      id
      title
      date
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
export const onCreateSubmission = /* GraphQL */ `
  subscription OnCreateSubmission {
    onCreateSubmission {
      id
      bountyID
      bounty {
        id
        title
        date
        deadline
        amount
        rules
        owner
        outcome
        createdAt
        updatedAt
      }
      date
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
        date
        deadline
        amount
        rules
        owner
        outcome
        createdAt
        updatedAt
      }
      date
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
        date
        deadline
        amount
        rules
        owner
        outcome
        createdAt
        updatedAt
      }
      date
      owner
      answer
      outcome
      createdAt
      updatedAt
    }
  }
`;
