const lighthouse = require("@lighthouse-web3/sdk");
const ethers = require("ethers");
const OnChainCIDabi = require("./utils/abi");
const chainConfig = require("./utils/chainConfig");
require("dotenv").config();

const chain = "baseSepolia";
const API_KEY = process.env.LIGHTHOUSE_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

console.log(chainConfig[chain].rpcUrl, chainConfig[chain].contractAddress);

const provider = new ethers.JsonRpcProvider(chainConfig[chain].rpcUrl);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  chainConfig[chain].contractAddress,
  OnChainCIDabi,
  signer
);

async function pushMetadataOnchain() {
  try {
    // 1. Upload file to Lighthouse

    const filePath = "./uploadSample.txt";
    const uploadResponse = await lighthouse.upload(filePath, API_KEY);
    console.log("File uploaded to Lighthouse:", uploadResponse);
    const cid = uploadResponse.data.Hash;

    // const cid = "Qmah99npVfj9WRMfc172Ghk1qKdxF7BTYFLTD9Ph4wseTJ";
    console.log(cid);

    // 2. Get file information from Lighthouse
    const fileInfo = await lighthouse.getFileInfo(cid);
    console.log("File information:", fileInfo);

    // 3. Add CID to smart contract
    console.log("Pushing CID onchain....");
    const tx = await contract.pushCIDOnchain(
      cid,
      fileInfo.data.fileName,
      fileInfo.data.fileSizeInBytes,
      fileInfo.data.encryption,
      fileInfo.data.mimeType,
      [] // initial empty dealIDs array
    );
    await tx.wait();
    console.log("CID added to contract");

    // 4. Verify file details on-chain
    await verifyFileDetails(cid);

    // 5. Update dealIDs in smart contract
    console.log("Updating dealIDs onchain....");
    await updateDealIDs(cid);
    console.log("DealIDs updated onchain");

    await verifyFileDetails(cid);
  } catch (error) {
    console.error("Error in main process:", error);
  }
}

// Helper function to verify file details on-chain
async function verifyFileDetails(cid) {
  const details = await contract.getFileDetails(signer.address, cid);
  console.log("On-chain file details:", {
    filename: details[0],
    size: details[1].toString(),
    encryption: details[2],
    mimeType: details[3],
    dealIDs: details[4].map((id) => id.toString()),
  });
}

async function updateDealIDs(cid) {
  const dealStatus = await lighthouse.dealStatus(cid);
  console.log("Deal status:", dealStatus);

  const dealIds = [];
  dealStatus.data.forEach((sector) => {
    sector.deal.forEach((deal) => {
      dealIds.push(deal.dealId);
    });
  });

  // update the dealIDs in the contract
  const tx = await contract.updateDealID(cid, dealIds);
  await tx.wait();
  console.log("Deal IDs updated in contract");
}

pushMetadataOnchain()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
