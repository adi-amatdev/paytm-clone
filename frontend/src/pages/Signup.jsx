import Heading from "../components/Heading"
import SubHeading from '../components/SubHeading'
import InputBox from "../components/InputBox"
import {Button} from "../components/Button"
import BottomWarning from "../components/BottomWarning"
import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const navigate = useNavigate();
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  
  function setValues(e,setter){
    setter(e.target.value);
  }

  async function sendSignup(){
    const response = await  axios.post("http://localhost:3000/api/v1/user/signup",{
      firstName:firstName,
      lastName:lastName,
      username: email,
      password:password
    });
    localStorage.setItem("token",response.data.token);
    if(response.status === 200){
        setTimeout(()=>{navigate('/signin')},400)
    }
  }
  

  return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-100 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox onChange={(e)=>{setValues(e,setFirstName)}} placeholder="John" label={"First Name"} />
        <InputBox onChange={(e)=>{setValues(e,setLastName)}} placeholder="Doe" label={"Last Name"} />
        <InputBox onChange={(e)=>{setValues(e,setEmail)}} placeholder="aaditya@gmail.com" label={"Email"} />
        <InputBox onChange={(e)=>{setValues(e,setPassword)}} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button
            onClick={()=>{sendSignup();}}
            label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}

export default Signup
