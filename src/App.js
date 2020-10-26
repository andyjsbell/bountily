import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify'

import { createBounty, createSubmission } from './graphql/mutations'
import { listSubmissions } from './graphql/queries'
import { listBountys, getBounty } from './graphql/extra_mutations'
import { onCreateSubmission, OnCreateSubmission } from './graphql/subscriptions'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import awsExports from "./aws-exports";
import Unsplash, { toJson } from 'unsplash-js';
import { FormTextarea, Modal, ModalBody, ModalHeader } from "shards-react";
import { Form, FormInput, FormGroupInputGroup,
  InputGroupText,
  InputGroupAddon, FormGroup, InputGroup } from "shards-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardImg,
  CardBody,
  CardFooter,
  Button
} from "shards-react"

import "bootstrap/dist/css/bootstrap.min.css"
import "shards-ui/dist/css/shards.min.css"

Amplify.configure(awsExports);

const APP_ACCESS_KEY = "3-4zpPqehzktn92aK0Ym7Xgxqy6hoUD-JSx3nQYqAc0"
const SECRET_KEY = "uEucq6KP2XxV4RPC9Jx7IFH9gmmbQykAjMzH6HZR4tg"
const unsplash = new Unsplash({ 
  accessKey: APP_ACCESS_KEY, 
  secret: SECRET_KEY 
})

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
  const [open, setOpen] = useState(false)

  const load = async (id) => {
      try {
      const bountyData = await API.graphql(graphqlOperation(getBounty, { id: bountyId }))
      setBounty(bountyData.data.getBounty)

      console.log(bountyData)
    } catch (err) {
      console.log("error getting bountyId:", err)
    }
  }
  useEffect(() => {
    load(bountyId)
  }, [])

  const addSubmission = async (bountyID) => {
    console.log("addSubmission called with bountyID:", bountyID)
    try {
      const currentUser = await Auth.currentUserInfo()
      const submission = {
        bountyID,
        owner: currentUser.username,
        answer: "",
        outcome: Outcome.Draft,
      }
      await API.graphql(graphqlOperation(createSubmission, {input: submission}))
      //Close modal
      setOpen(false)
      // reload our bounty
      load(bountyID)
      //TODO we want to subscribe to bounty to watch for changes to update 
    } catch (err) {
      console.log("error creating submission:", err)
    }
  }

  const toggle = () => {
    setOpen(!open)
  }
  
  return (
    <div className="bounty-item">
      <Card style={{ maxWidth: "300px"  }}>
        <CardHeader>${bounty?.amount} #{bounty?.submissions?.items?.length}</CardHeader>
        <CardImg src={bounty?.url} />
        <CardBody>
          <CardTitle>{bounty?.title}</CardTitle>
          <p>{bounty?.rules.substring(0,20) + '...'}</p>
          <Button onClick={() => toggle()}>More info &rarr;</Button>
          <Modal open={open} toggle={toggle}>
            <ModalHeader><strong>{bounty?.title}</strong></ModalHeader>
            <ModalBody>
              <div>{bounty?.rules}</div> 
              <div><Button onClick={() => addSubmission(bounty?.id)}>Go for it!</Button></div>
            </ModalBody>
          </Modal>
        </CardBody>
        <CardFooter>{formatDateTime(bounty?.deadline)}</CardFooter>
      </Card>
    </div>
  )
}

const Bountys = () => {

  const [bountys, setBountys] = useState([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [rules, setRules] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    fetchBountys()
  }, [])

  
  const toggle = () => {
    setOpen(!open)
  }
  
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
      const currentUser = await Auth.currentUserInfo()
      const random = await unsplash.photos.getRandomPhoto()
      const json = await toJson(random)
      const url = json.urls.thumb
      
      const bounty = {
        title,
        deadline: currentDateTimeISO(),
        amount: parseInt(amount),
        rules,
        owner: currentUser.username,
        outcome: Outcome.Draft,
        url
      }

      const bountyData = await API.graphql(graphqlOperation(createBounty, { input: bounty }))
      setBountys([...bountys, bountyData.data.createBounty])
      //Close modal
      setOpen(false)
    } catch (err) { console.log("error creating bounty:", err) }
  }

  const updateBounty = async () => {

  }

  const cancelBounty = async () => {

  }

  return (
    <div>
      <div className="bounty-control">
        <Button onClick={() => toggle()}>Create a Bounty</Button>
        <Modal open={open} toggle={toggle}>
          <ModalHeader>Create a Bounty</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <InputGroup className="mb-2">
                  <FormInput placeholder="Title" onChange={e => setTitle(e.target.value)}/>
                </InputGroup>
                <InputGroup className="mb-2">
                  <InputGroupAddon type="prepend">
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <FormInput placeholder="Amount" type="number" onChange={e => setAmount(e.target.value)}/>
                </InputGroup> 
                <InputGroup className="mb-2">
                  <FormTextarea id="#rules" placeholder="Rules" onChange={e => setRules(e.target.value)}/>
                </InputGroup>
              </FormGroup>
            </Form>
            <div><Button onClick={() => addBounty()}>Go for it!</Button></div>
          </ModalBody>
        </Modal>
      </div>
      <div className="bounty-container">
          {bountys.map((bounty =>
            <Bounty bountyId={bounty.id}/>
          ))}
      </div>
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
          <th>Owner</th>
        </tr>
        </thead>
        <tbody>{submissions.map((submission =>
          <tr key={submission.id}>
            <td><Bounty bountyId={submission.bountyID}/></td>
            <td>{formatDateTime(submission.createdAt)}</td>
            <td>{submission.outcome}</td>
            <td>{submission.owner}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

const UserProfile = () => {
  
  const [name, setName] = useState('')

  const load = async () => {
    try {
      const info = await Auth.currentUserInfo()
      setName(info.username)
    } catch (err) {
      console.log("failed to load user info:", err)
    }
  }
  useEffect(() => {
    load()
  })
  
  return (
    <div>
      <span>Welcome back <strong>{name}</strong></span>
      <AmplifySignOut />
    </div>
  )
}
function App() {
  
  return (
    <div className="App">
      <h1>Bountily</h1>
      <UserProfile />
      <h3>Bounties</h3>
      <Bountys />
      {/* <h3>My submissions</h3>
      <Submissions /> */}
    </div>
  );
}

export default withAuthenticator(App)
