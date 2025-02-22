const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const OnchainCID = await ethers.getContractFactory("OnchainCID");

  // Deploy the contract
  console.log("Deploying OnchainCID contract...");
  const onchainCID = await OnchainCID.deploy();
  await onchainCID.waitForDeployment();

  // Get the contract address
  const address = await onchainCID.getAddress();
  console.log("OnchainCID deployed to:", address);
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
