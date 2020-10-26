import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify'

import { listSubmissions, listWallets } from './graphql/queries'
import { createBounty, createSubmission, createWallet, deleteBounty, updateBounty, updateWallet } from './graphql/mutations'
import { listBountys, getBounty } from './graphql/extra_mutations'
import { onCreateSubmission, OnCreateSubmission, onDeleteBounty, onUpdateWallet } from './graphql/subscriptions'
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

const CancelBounty = ({bountyId, bountyName}) => {
  const [open, setOpen] = useState(false)

  const toggle = () => {
    setOpen(!open)
  }

  const cancelBounty = async (bountyID) => {
    console.log("cancelBounty called")
    try {
      await API.graphql(graphqlOperation(deleteBounty, {
        input: {
          id: bountyID
        }
      }))
    } catch (err) {
      console.log("error canceling bounty:", err)
    }

    setOpen(false)
  }

  return (
    <div>
      <Button onClick={() => toggle()}>Cancel</Button>
      <Modal open={open} toggle={toggle}>
        <ModalHeader><strong>Cancel Bounty {bountyName}</strong></ModalHeader>
        <ModalBody>
          <div>Are you sure you want to cancel the bounty?</div> 
          <div>
            <Button className="button-modal" onClick={() => cancelBounty(bountyId)}>Go for it!</Button>
            <Button className="button-modal" theme="secondary" onClick={()=> toggle()}>Cancel</Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

const Bounty = ({bountyId}) => {

  const [bounty, setBounty] = useState(null)
  const [open, setOpen] = useState(false)

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
          <CancelBounty
            bountyId={bounty?.id}
            bountyName={bounty?.title}/>
          <Modal open={open} toggle={toggle}>
            <ModalHeader><strong>{bounty?.title}</strong></ModalHeader>
            <ModalBody>
              <div>{bounty?.rules}</div> 
              <div>
                <Button className="button-modal" onClick={() => addSubmission(bounty?.id)}>Go for it!</Button>
                <Button className="button-modal" theme="secondary" onClick={()=> toggle()}>Cancel</Button>
              </div>
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
    watchBountys()
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
      console.log("bountys:", bountys)
    } catch (err) { console.log('error fetching bountys:', err) }
  }

  const watchBountys = async () => {
    console.log("watch bountys")
    try {
      // Subscribe to creation of submission
      API.graphql(
        graphqlOperation(onDeleteBounty)
      ).subscribe({
        next: (data) => { 
          fetchBountys()
        }
      });
    } catch (err) {
      console.log("error watching submissions:", err)
    }
  }

  const addBounty = async () => {
    console.log("createBounty called")

    try {
      const amountAsNumber = parseInt(amount)
      const currentUser = await Auth.currentUserInfo()
      //Check balance
      const walletData = await API.graphql(graphqlOperation(listWallets, {
        filter:{
          user: {
            eq: currentUser.id
          }
        }
      }))

      const balance = walletData.data.listWallets?.items[0]?.balance

      if (balance >= amountAsNumber) {
        
        const random = await unsplash.photos.getRandomPhoto()
        const json = await toJson(random)
        const url = json.urls.thumb
      
        const bounty = {
          title,
          deadline: currentDateTimeISO(),
          amount: amountAsNumber,
          rules,
          owner: currentUser.username,
          outcome: Outcome.Draft,
          url
        }
    
        const bountyData = await API.graphql(graphqlOperation(createBounty, { input: bounty }))
        
        const newBalance = balance - amountAsNumber
        const transaction = {
          id: walletData.data.listWallets?.items[0].id,
          balance: newBalance
        }

        console.log(transaction)
        // update wallet
        // await API.graphql(graphqlOperation(updateWallet, 
        //   { input: transaction }   
        // ))

        await API.graphql(graphqlOperation(updateWallet, { 
          input: { 
            id: walletData.data.listWallets?.items[0].id, 
            balance: newBalance
          }
        }));
        
        setBountys([...bountys, bountyData.data.createBounty])
      }

      //Close modal
      setOpen(false)
    } catch (err) { console.log("error creating bounty:", err) }
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
            <div>
              <Button className="button-modal" onClick={() => addBounty()}>Go for it!</Button>
              <Button className="button-modal" onClick={() => toggle()} theme="secondary">Cancel</Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
      <div className="bounty-container">
          {bountys.map((bounty =>
            <Bounty bountyId={bounty.id} key={bounty.id}/>
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
      <Wallet/>
    </div>
  )
}

const Wallet = () => {
  
  const [wallet, setWallet] = useState(0.0)

  useEffect(() => {
    fetchWallet()
  }, [])

  const watchWallet = async () => {
    console.log("watch wallets")
    try {
      // Subscribe to updates on wallet, TODO, add filter for just user's filter
      API.graphql(
        graphqlOperation(onUpdateWallet)
      ).subscribe({
        next: (data) => {
          console.log(data)
          fetchWallet()
        }
      });
    } catch (err) {
      console.log("error watching submissions:", err)
    }
  }

  const fetchWallet = async () => {
    console.log("fetchWallet called")
    try {
      const currentUser = await Auth.currentUserInfo()
      const walletData = await API.graphql(graphqlOperation(listWallets, {
        filter:{
          user: {
            eq: currentUser.id
          }
        }
      }))

      if (walletData.data.listWallets?.items.length === 0) {
        await API.graphql(graphqlOperation(createWallet, 
          {
            input: {
              user: currentUser.id,
              balance: 100.0
            }
          }))
          setWallet(100.0)
      } else {
        const balance = walletData.data.listWallets?.items[0]?.balance
        setWallet(balance)
      }
    } catch (err) { console.log('error fetching bountys:', err) }
  }

  return (
    <span>Wallet: {wallet}</span>
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
