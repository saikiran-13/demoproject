const {ethers} = require('ethers')
const {abi} = require('./artifacts/contracts/demo.sol/counter.json')
// const {contractAddress} = require('./task/demo')
// console.log(abi)
// console.log(contractAddress)
const contractAddress = '0x9a44BD511B76aBBC3AF165c008aeC8DFbCDe9eEA'
const RPC = 'https://polygon-mumbai.g.alchemy.com/v2/BwyHvHONilHMEc9QpsoGpyJ9wXJpAzHY'
const account = '0xec18A3d572487d4DEFdd3864E7e992148319ca40'
const account2 = '0xe6A9D13D93CbA162A0fB46d338ADD071247910f3'
const account3 = '0x4d8f1cFF7b1414bE6F773b7Fda772Cee94B92f1f'
const privateKey = 'e36e452fdf5c6ba33fb664b65d9bf13ea2057c157171381bc782844f80929cf3'
//In package.json,ethers version should be ^5.4.0 and in terminal use command "npm install"

const provider = new ethers.providers.JsonRpcProvider(RPC)

let wallet = new ethers.Wallet(privateKey,provider)
//=================================================================================
async function details(){
    const bal = await provider.getBalance(account)
    // console.log(await provider.getTransactionCount())
    console.log("Gas Price",await provider.getGasPrice())
    console.log("Signer", provider.getSigner())
    console.log("Balance ",ethers.utils.formatEther(bal))//converting wei to ether by using formatEther
    console.log("Address ",await wallet.getAddress())
    console.log("Transaction Count",await wallet.getTransactionCount())
   
    //sendTransaction 
    console.log("before",ethers.utils.formatEther(await wallet.getBalance()))
    const trans = await wallet.sendTransaction({
        to:'0x4d8f1cFF7b1414bE6F773b7Fda772Cee94B92f1f',
        value:ethers.utils.parseEther('0.01','ether')
    })
    await trans.wait()
    console.log("after",ethers.utils.formatEther(await wallet.getBalance()))
    console.log("Transaction receipt",trans)

    // //signTransaction 
    // const trans2 = await wallet.signTransaction({
    //     to:'0x4d8f1cFF7b1414bE6F773b7Fda772Cee94B92f1f',
    //     value:ethers.utils.parseEther('0.01','ether')
    // },privateKey).on()
}
details()
//============================================================================
let contract = new ethers.Contract(contractAddress,abi,provider)

async function readContract(){
    console.log("Contract Balance",ethers.utils.formatEther(await contract.contractBalance()))
    console.log("Count ",(await contract.count()).toNumber())
    console.log("Name",(await contract.name()).toString())
}
readContract()

//========================================================================================
//changing from provider to signer for writing the contract
contract = contract.connect(wallet)
// console.log(contract)
async function writeContract(){

    //updating the count
    const updateCount = await contract.setcount(140)
    await updateCount.wait()
    console.log("Count updated",(await contract.count()).toNumber())

   //Incrementing the count 
    const incrementCount = await contract.incrementcount()
    await incrementCount.wait()
    console.log("Count incremented",(await contract.count()).toNumber())

    //Decrementing the count 
    const decrementCount = await contract.decrementcount()
    await decrementCount.wait()
    console.log("Count decremented",(await contract.count()).toNumber())

    //depositing in the contract
    const trans1 = await contract.deposit({
        value:ethers.utils.parseEther('0.001')
    })
    await trans1.wait()
    console.log(ethers.utils.formatEther(await contract.contractBalance()))

    //Transfer ether from one account to another
    console.log(`Before Transfer ${await wallet.getAddress()}:`,ethers.utils.formatEther(await wallet.getBalance()))
    const trans2 = await contract.transfer(account3,{
        value:ethers.utils.parseEther('0.003')
    })
    await trans2.wait()

    console.log(`After Transfer ${await wallet.getAddress()}:`,ethers.utils.formatEther(await wallet.getBalance()))
    console.log(`Target Account ${account3} :`,ethers.utils.formatEther(await provider.getBalance(account3)))
}
writeContract()


//=====================================================================================
// Event listener and filters
async function eventLog(){
let events = await contract.queryFilter('transferCalled')
console.log(await contract.queryFilter(events,-20))
events = events.filter((event)=>{return event.args[1]== 3000000000000000?true:false})
// console.log(events)

const filteredevents = events.map((event)=>{return `From: ${wallet.address} To:${event.args[0]} Value:${event.args[1]}`})
console.log(filteredevents)
}
eventLog()
// //=================================================================================
// async function gasEstimation(){
//     let gasfee = await contract.estimateGas.deposit(ethers.utils.parseEther('0.001'))
//     console.log("Gas fee:",gasfee)
// }
// gasEstimation()