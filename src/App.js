import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'

import { createBounty, createSubmission } from './graphql/mutations'
import { listBountys, listSubmissions, getBounty } from './graphql/queries'
import { onCreateSubmission, OnCreateSubmission } from './graphql/subscriptions'
import { withAuthenticator } from '@aws-amplify/ui-react'
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const Outcome = Object.freeze({
  "Draft": "DRAFT",
  "Open": "OPEN",
  "Closed": "CLOSED",
  "Cancelled": "CANCELLED",
})

const currentDateTimeISO = () => {
  return new Date().toISOString()
}

const formatDateTime = (isoDate) => {
  return new Date(isoDate).toLocaleString()
}

const Bounty = ({bountyId}) => {

  const [bounty, setBounty] = useState(null)

  const load = async (id) => {
      try {
      const bountyData = await API.graphql(graphqlOperation(getBounty, { id: bountyId }))
      setBounty(bountyData.data.getBounty)
    } catch (err) {
      console.log("error getting bountyId:", err)
    }
  }
  useEffect(() => {
    load(bountyId)
  }, [])
  return (
    <span>{bounty?.title}</span>
  )
}

const Bountys = () => {

  const [bountys, setBountys] = useState([])

  useEffect(() => {
    fetchBountys()
  }, [])

  const fetchBountys = async () => {
    console.log("fetchBountys called")
    try {
      const bountyData = await API.graphql(graphqlOperation(listBountys))
      console.log(bountyData)
      const bountys = bountyData.data.listBountys.items
      setBountys(bountys)
    } catch (err) { console.log('error fetching bountys:', err) }
  }

  const addBounty = async () => {
    console.log("createBounty called")

    try {
      const bounty = {
        title: "Test bounty",
        deadline: currentDateTimeISO(),
        amount: 100,
        rules: "There are no rules",
        owner: "Andy",
        outcome: Outcome.Draft,
      }

      const bountyData = await API.graphql(graphqlOperation(createBounty, { input: bounty }))
      setBountys([...bountys, bountyData.data.createBounty])
    } catch (err) { console.log("error creating bounty:", err) }
  }

  const updateBounty = async () => {

  }

  const cancelBounty = async () => {

  }

  const addSubmission = async (bountyID) => {
    console.log("addSubmission called with bountyID:", bountyID)
    try {
      const submission = {
        bountyID,
        owner: "Andy",
        answer: "",
        outcome: Outcome.Draft,
      }
      await API.graphql(graphqlOperation(createSubmission, {input: submission}))
    } catch (err) {
      console.log("error creating submission:", err)
    }
  }

  return (
    <div>
      <button onClick={() => addBounty()}>Create Bounty</button>
      <table>
        <thead>
        <tr>
          <th>Title</th>
          <th>Created</th>
          <th>Deadline</th>
          <th>Bounty</th>
          <th>Hunters</th>
          <th>Owner</th><th>Status</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {bountys.map((bounty =>
          <tr key={bounty.id}>
            <td>{bounty.title}</td>
            <td>{formatDateTime(bounty.createdAt)}</td>
            <td>{formatDateTime(bounty.deadline)}</td>
            <td>{bounty.amount}</td>
            <td>{bounty.submissions?.length}</td>
            <td>{bounty.owner}</td>
            <td>{bounty.outcome}</td>
            <td><button onClick={() => addSubmission(bounty.id)}>Add submission</button></td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

const Submissions = () => {
  const [submissions, setSubmissions] = useState([])

  useEffect(()=> {
    fetchSubmissions()
    watchSubmissions()
  }, [])


  const watchSubmissions = async () => {
    console.log("watch submissions")
    try {
      // Subscribe to creation of submission
      API.graphql(
        graphqlOperation(onCreateSubmission)
      ).subscribe({
        next: (data) => fetchSubmissions()
      });
    } catch (err) {
      console.log("error watching submissions:", err)
    }
  }

  const fetchSubmissions = async () => {
    console.log("fetch submissions")
    try {
      const submissionData = await API.graphql(graphqlOperation(listSubmissions))
      const submissions = submissionData.data.listSubmissions.items
      setSubmissions(submissions)
    } catch (err) {
      console.log("error fetching submissions:", err)
    }
  }

  return (
    <div>
      <table>
        <thead>
        <tr>
          <th>Bounty</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>{submissions.map((submission =>
          <tr key={submission.id}>
            <td><Bounty bountyId={submission.bountyID}/></td>
            <td>{formatDateTime(submission.createdAt)}</td>
            <td>{submission.outcome}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <h1>Bountily</h1>
      <h3>Bounties</h3>
      <Bountys />
      <h3>My submissions</h3>
      <Submissions />
    </div>
  );
}

export default withAuthenticator(App)
