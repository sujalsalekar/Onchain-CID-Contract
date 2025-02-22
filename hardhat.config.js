require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

const BASE_RPC_URL = process.env.BASE_RPC_URL || "";
const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const BASE_SEPOLIA_API_KEY = process.env.BASE_SEPOLIA_API_KEY || "";
const FILECOIN_RPC_URL = process.env.FILECOIN_RPC_URL || "";
const CALIBRATION_RPC_URL = process.env.CALIBRATION_RPC_URL || "";
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "";
const POLYGON_AMOY_RPC_URL = process.env.POLYGON_AMOY_RPC_URL || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.25",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    // evmVersion: "paris",
  },

  etherscan: {
    apiKey: {
      baseSepolia: BASE_SEPOLIA_API_KEY,
    },
  },

  networks: {
    hardhat: {
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      gasLimit: 5000000000,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
    },
    base: {
      url: BASE_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    baseSepolia: {
      url: BASE_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    filecoin: {
      url: FILECOIN_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    calibration: {
      url: CALIBRATION_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    polygon: {
      url: POLYGON_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    polygonAmoy: {
      url: POLYGON_AMOY_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
