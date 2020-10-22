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
  
  const [bountys,setBountys] = useState([])

  useEffect(()=> {
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
      }
      await API.graphql(graphqlOperation(createBounty, {input: bounty}))
      setBountys([...bountys, bounty])
    } catch(err) {console.log("error creating bounty:", err)}
  }

  const updateBounty = async () => {

  }

  const cancelBounty = async () => {

  }

  return (
    <div>
      <button onClick={() => addBounty()}>Create Bounty</button>
      <table>
        <tr>
          <th>Title</th><th>Deadline</th><th>Bounty</th><th>Hunters</th><th>Owner</th><th>Status</th>
        </tr>
        {bountys.map((bounty =>
          <tr key={bounty.ID}>
            <th>{bounty.title}</th><th>{formatDateTime(bounty.deadline)}</th><th>{bounty.amount}</th><th>{bounty.submissions?.length}</th><th>{bounty.owner}</th><th>{bounty.outcome}</th>
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
      <Bountys/>
    </div>
  );
}

export default App;
