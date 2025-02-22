require("dotenv").config();

module.exports = {
  base: {
    rpcUrl: process.env.BASE_RPC_URL,
    contractAddress: "0x14C9d2aCB1DF1eFcCdCcB5b433a9F58F30F1140e",
  },
  baseSepolia: {
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL,
    contractAddress: "0xcC2eE5176F79c6DDcc1B750B562C0c5FD02D1E5b",
  },
  polygon: {
    rpcUrl: process.env.POLYGON_RPC_URL,
    contractAddress: "0xD812F03a27750036A235B0629Cc4D870dE38364B",
  },
  polygonAmoy: {
    rpcUrl: process.env.POLYGON_AMOY_RPC_URL,
    contractAddress: "0x661aFA2738e43ae4eBad603947Ce65F108Fc2a4C",
  },
  filecoin: {
    rpcUrl: process.env.FILECOIN_RPC_URL,
    contractAddress: "0x8172E79D5DaB48cb2E9A48D188774776379f5B50",
  },
  calibration: {
    rpcUrl: process.env.CALIBRATION_RPC_URL,
    contractAddress: "0x27E1CCbb95f02Ed210031D86220A918dCffD0A37",
  },
};
