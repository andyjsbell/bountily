import React, {useEffect, useState} from "react";
import {API, Auth, graphqlOperation} from "aws-amplify";
import {listBountys} from "../graphql/extra_mutations";
import {onDeleteBounty} from "../graphql/subscriptions";
import {listWallets} from "../graphql/queries";
import Unsplash, {toJson} from "unsplash-js";
import {currentDateTimeISO} from "../utils";
import {createBounty, updateWallet} from "../graphql/mutations";
import {
    Button,
    Form,
    FormGroup,
    FormInput, FormTextarea,
    InputGroup,
    InputGroupAddon, InputGroupText,
    Modal,
    ModalBody,
    ModalHeader
} from "shards-react";
import {APP_ACCESS_KEY, BALANCE_TOKEN, BALANCE_TOKEN_NAME, SECRET_KEY, Outcome} from "../constants";
import {Bounty} from "./Bounty";

const unsplash = new Unsplash({
    accessKey: APP_ACCESS_KEY,
    secret: SECRET_KEY
})

export const Bounties = () => {

    const [bounties, setBounties] = useState([])
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [rules, setRules] = useState('')
    const [amount, setAmount] = useState('')

    useEffect(() => {
        fetchBounties()
            .then(_ => console.log("fetched bounties"))
            .catch(e => console.error("error fetching bounties:", e))
        watchBounties()
            .then(_ => console.log("watched bounties"))
            .catch(e => console.error("error watching bounties:", e))
    }, [])

    const toggle = () => {
        setOpen(!open)
    }

    const fetchBounties = async () => {
        console.log("fetchBounties called")
        try {
            const bountyData = await API.graphql(graphqlOperation(listBountys))
            const bounties = bountyData.data.listBountys.items
            setBounties(bounties)
        } catch (err) { console.error('error fetching bountys:', err) }
    }

    const watchBounties = async () => {
        console.log("watch bounties")
        try {
            // Subscribe to creation of submission
            API.graphql(
                graphqlOperation(onDeleteBounty)
            ).subscribe({
                next: (data) => {
                    fetchBounties()
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

                await API.graphql(graphqlOperation(updateWallet, {
                    input: transaction
                }));

                setBounties([...bounties, bountyData.data.createBounty])
            }

            //Close modal
            setOpen(false)
        } catch (err) { console.error("error creating bounty:", err) }
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
                                        <InputGroupText>{BALANCE_TOKEN}</InputGroupText>
                                    </InputGroupAddon>
                                    <FormInput placeholder={BALANCE_TOKEN_NAME} type="number" onChange={e => setAmount(e.target.value)}/>
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
                {bounties.map((bounty =>
                        <Bounty bountyId={bounty.id}/>
                ))}
            </div>
        </div>
    )
}