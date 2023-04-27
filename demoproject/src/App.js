import logo from './logo.svg';
import './App.css';
import {useState} from 'react'

function App() {

const [address, setAddress] = useState("0x00..")
const [balance, setBalance] = useState(0)
const [toAddress,setToAddress] = useState("")
const [val,setVal] = useState('')


const {ethers} = require('ethers')
const {abi} = require('./data.json')
const contractAddress = '0x2613dC5Cf011CE11Cb9e8E0AC350daA8F88cf0C6'
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const {ethereum} = window
let contract = new ethers.Contract(contractAddress,abi,provider)
contract = contract.connect(signer)

async function readContract(){
  console.log("Contract Balance",ethers.utils.formatEther(await contract.contractBalance()))
  console.log("Count ",(await contract.count()).toNumber())
  console.log("Name",(await contract.name()).toString())
}
readContract()

async function accountDetails() {

  const Accounts = await ethereum.request({ method: "eth_requestAccounts" })
  const Balance = await ethereum.request({ method: "eth_getBalance", params: [Accounts[0], 'latest'] })

  await ethereum.request({ method: "eth_requestAccounts" })
    .then(acc => {
      console.log("connected Accounts", acc)
    })
    .catch(err => {
      console.log("Error occured")
    })

  setAddress(Accounts[0])
  console.log("Signer",signer.getAddress())
  setBalance(ethers.utils.formatEther(Balance))
}

async function incrementCount(){
await contract.incrementcount()
}

async function sendTransaction(_toAddress,_value){
  await contract.transfer(_toAddress,{value:ethers.utils.parseEther(_value)})
  console.log("Transfered")
}

async function depositEther(_value){
  await contract.deposit({value:ethers.utils.parseEther(_value)})
}

  return (
    <div className="App">
          <button onClick={accountDetails}>CONNECT METAMASK</button>
          <h1>AccountAddress:{address}</h1>
          <h1>AccountBalance:{balance}</h1>
          <button onClick={readContract}>Get Details</button>
          <button onClick={incrementCount}>Inc Count</button>
          <div><h1>To Address:</h1><input type="text" onChange = {(event)=>{setToAddress(event.target.value)}}></input></div>
        <div><h1>Value:</h1><input type="text" onChange = {(event)=>{setVal(event.target.value)}}></input></div>
        <button onClick={()=>sendTransaction(toAddress,val)}>SEND TRANSCATION</button>
        <div><h1>Value:</h1><input type="text" onChange = {(event)=>{setVal(event.target.value)}}></input></div>
        <button onClick={()=>depositEther(val)}>Deposit</button>

    </div>
  );
}

export default App;
