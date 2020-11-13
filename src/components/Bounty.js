import React, {useEffect, useState} from "react";
import {API, Auth, graphqlOperation} from "aws-amplify";
import {getBounty} from "../graphql/extra_mutations";
import {createSubmission} from "../graphql/mutations";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardImg,
    CardTitle,
    Modal,
    ModalBody,
    ModalHeader
} from "shards-react";
import {formatDateTime} from "../utils";
import {BALANCE_TOKEN, Outcome} from "../constants";
import {CancelBounty} from "./CancelBounty";

export const Bounty = ({bountyId}) => {

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
            .then(_ => console.log("loaded bounty"))
            .catch(e => console.error("error loading bounty: " + e))
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
            await load(bountyID)
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
                <CardHeader>{BALANCE_TOKEN}&nbsp;{bounty?.amount} #{bounty?.submissions?.items?.length}</CardHeader>
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