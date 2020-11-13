import React, {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {onCreateSubmission} from "../graphql/subscriptions";
import {listSubmissions} from "../graphql/queries";
import {formatDateTime} from "../utils";
import {Bounty} from "./Bounty";

export const Submissions = () => {
    const [submissions, setSubmissions] = useState([])

    useEffect(()=> {
        fetchSubmissions()
            .then(_ => console.log("fetched submissions"))
            .catch(e => console.error("error fetching submissions:", e))
        watchSubmissions()
            .then(_ => console.log("watched submissions"))
            .catch(e => console.error("error watching submissions:", e))
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
            console.error("error watching submissions:", err)
        }
    }

    const fetchSubmissions = async () => {
        console.log("fetch submissions")
        try {
            const submissionData = await API.graphql(graphqlOperation(listSubmissions))
            const submissions = submissionData.data.listSubmissions.items
            setSubmissions(submissions)
        } catch (err) {
            console.error("error fetching submissions:", err)
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
