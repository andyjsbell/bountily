import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'

import { createBounty, createSubmission } from './graphql/mutations'
import { listBountys, listSubmissions } from './graphql/queries'

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

const Bountys = () => {

  const [bountys, setBountys] = useState([])

  useEffect(() => {
    fetchBountys()
  }, [])

  const fetchBountys = async () => {
    console.log("fetchBountys called")
    try {
      const bountyData = await API.graphql(graphqlOperation(listBountys))
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
        date: currentDateTimeISO(),
      }
      await API.graphql(graphqlOperation(createBounty, { input: bounty }))
      setBountys([...bountys, bounty])
    } catch (err) { console.log("error creating bounty:", err) }
  }

  const updateBounty = async () => {

  }

  const cancelBounty = async () => {

  }

  const addSubmission = async (bountyID) => {
    console.log("addSubmission called")
    try {
      const submission = {
        bountyID,
        date: currentDateTimeISO(),
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
        <tr>
          <th>Title</th>
          <th>Created</th>
          <th>Deadline</th>
          <th>Bounty</th>
          <th>Hunters</th>
          <th>Owner</th><th>Status</th>
          <th></th>
        </tr>
        {bountys.map((bounty =>
          <tr key={bounty.ID}>
            <th>{bounty.title}</th>
            <th>{formatDateTime(bounty.date)}</th>
            <th>{formatDateTime(bounty.deadline)}</th>
            <th>{bounty.amount}</th>
            <th>{bounty.submissions?.length}</th>
            <th>{bounty.owner}</th><th>{bounty.outcome}</th>
            <th><button onClick={() => addSubmission(bounty.ID)}>Add submission</button></th>
          </tr>
        ))}
      </table>
    </div>
  )
}

const Submissions = () => {
  const [submissions, setSubmissions] = useState([])

  useEffect(()=> {
    fetchSubmissions()
  }, [])

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
        <tr>
          <th>Bounty</th>
          <th>Date</th>
        </tr>
        {submissions.map((submission =>
          <tr key={submission.ID}>
            <th>{submission.bounty.title}</th>
            <th>{formatDateTime(submission.date)}</th>
          </tr>
        ))}
      </table>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <h1>Bountily</h1>
      <Bountys />
    </div>
  );
}

export default App;
