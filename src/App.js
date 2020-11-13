import './App.css';

import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify'
import { listSubmissions, listWallets } from './graphql/queries'
import { createBounty, createSubmission, createWallet, deleteBounty, updateBounty, updateWallet } from './graphql/mutations'
import { listBountys, getBounty } from './graphql/extra_mutations'
import { onCreateSubmission, onCreateTransaction, onDeleteBounty, onUpdateTransaction, onUpdateWallet } from './graphql/subscriptions'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import awsExports from "./aws-exports";
import Unsplash, { toJson } from 'unsplash-js';
import {UserProfile} from "./components/UserProfile";

import {
  FormTextarea,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormInput,
  InputGroupText,
  InputGroupAddon,
  FormGroup,
  InputGroup,
  Card,
  CardHeader,
  CardTitle,
  CardImg,
  CardBody,
  CardFooter,
  Button
} from "shards-react";

import "bootstrap/dist/css/bootstrap.min.css"
import "shards-ui/dist/css/shards.min.css"
import {APP_ACCESS_KEY, SECRET_KEY} from "./constants";
import {formatDateTime, currentDateTimeISO} from "./utils";
import {Bounties} from "./components/Bounties";

Amplify.configure(awsExports);

function App() {
  
  return (
    <div className="App">
      <UserProfile />
      <h3>Bounties</h3>
      <Bounties />
      {/* <h3>My submissions</h3>
      <Submissions /> */}
    </div>
  );
}

export default withAuthenticator(App)
