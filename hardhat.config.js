require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
require('./task/demo')
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks:{
    polygon_mumbai:{
      url:`${process.env.ALCHEMY_RPC_URL}`,
      accounts:[`${process.env.WALLET_ADDRESS_PRIVATE_KEY}`]
    }
  },
    gasReporter: {       enabled: true,       currency: 'USD',       gasPrice: 100,     },
  etherscan:{
    apiKey:`${process.env.POLYGON_MUMBAI_API_KEY}`
  }
};
