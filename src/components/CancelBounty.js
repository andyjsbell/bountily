import React, {useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {deleteBounty} from "../graphql/mutations";
import {Button, Modal, ModalBody, ModalHeader} from "shards-react";

export const CancelBounty = ({bountyId, bountyName}) => {
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
            console.error("error canceling bounty:", err)
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

