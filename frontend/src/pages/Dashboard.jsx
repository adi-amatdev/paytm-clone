
import { useEffect, useState } from "react"
import Appbar from "../components/Appbar"
import Balance from "../components/Balance"
import { Users } from "../components/Users"
import axios from "axios"

export const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    useEffect(()=>{
        async function fetchBalance(){
            const response = await axios.get("http://localhost:3000/api/v1/account/balance",{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setBalance(response.data.balance.toFixed(2));
        }
        fetchBalance()
    },[balance])
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance} />
            <Users />
        </div>
    </div>
}