import React, {useEffect, useState} from "react";
import {API, Auth, graphqlOperation} from "aws-amplify";
import {onUpdateWallet} from "../graphql/subscriptions";
import {listWallets} from "../graphql/queries";
import {createWallet} from "../graphql/mutations";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "shards-react";
import {useTransactions} from "./useTransactions";
import {INITIAL_BALANCE, BALANCE_TOKEN} from "../constants";

export const Wallet = () => {
    const [wallet, setWallet] = useState(0.0)
    const [open, setOpen] = useState(false)
    const transactions = useTransactions();

    const toggle = () => {
        setOpen(!open)
    }

    useEffect(() => {
        fetchWallet()
            .then(_ => console.log("fetched wallet"))
            .catch(e => console.error("error fetching wallet:", e))
        watchWallet()
            .then(_ => console.log("watched wallet"))
            .catch(e => console.error("error watching wallet:", e))
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
            console.error("error watching submissions:", err)
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
                            balance: INITIAL_BALANCE
                        }
                    }))
                setWallet(INITIAL_BALANCE)
            } else {
                const balance = walletData.data.listWallets?.items[0]?.balance
                setWallet(balance)
            }
        } catch (err) { console.log('error fetching bountys:', err) }
    }

    return (
        <Dropdown open={open} toggle={() => toggle()} className="userpanel-item">
            <DropdownToggle outline>{BALANCE_TOKEN} {wallet}</DropdownToggle>
            <DropdownMenu>
                {
                    transactions?.length === 0 ?
                        <DropdownItem>No transactions</DropdownItem>
                        :
                        transactions.map((transaction =>
                                <DropdownItem>{BALANCE_TOKEN} {transaction.amount}</DropdownItem>
                        ))
                }
            </DropdownMenu>
        </Dropdown>
    )
}

