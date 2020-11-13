import {useEffect, useState} from "react";
import {API, Auth, graphqlOperation} from "aws-amplify";
import {onCreateTransaction} from "../graphql/subscriptions";
import {listTransactions} from "../graphql/queries";

export const useTransactions = () => {
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        fetchTransactions()
            .then(_ => console.log("fetched transactions"))
            .catch(e => console.error("error fetching transactions:", e))
        watchTransactions()
            .then(_ => console.log("watching transactions"))
            .catch(e => console.error("error watching transactions:", e))
    })

    const watchTransactions = async () => {
        console.log("watch transactions")
        try {
            // Subscribe to updates on wallet, TODO, add filter for just user's filter
            API.graphql(
                graphqlOperation(onCreateTransaction)
            ).subscribe({
                next: (data) => {
                    console.log(data)
                    fetchTransactions()
                }
            });
        } catch (err) {
            console.error("error watching submissions:", err)
        }
    }

    const fetchTransactions = async () => {
        console.log("fetchTransactions called")
        try {
            const currentUser = await Auth.currentUserInfo()
            const transactionData = await API.graphql(graphqlOperation(listTransactions, {
                filter:{
                    to: {
                        eq: currentUser.id
                    },
                    from: {
                        eq: currentUser.id
                    }
                }
            }))

            const transactions = transactionData.data.listTransactions.items
            setTransactions(transactions)
        } catch (err) { console.error('error fetching transactions:', err) }
    }

    return transactions
}
