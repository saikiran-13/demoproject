// const { ethers } = require("hardhat");
const { task } = require("hardhat/config");

task('deploy','Deploy the contract on the blockchain',async(taskArgs,hre)=>{
    let demo = await ethers.getContractFactory('counter')
    demo = await demo.deploy()
    console.log("Contract deployed at ",demo.address)
    // let contractAddress = demo.address
})
