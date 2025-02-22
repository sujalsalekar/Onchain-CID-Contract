module.exports = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "cid",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "filename",
        type: "string",
      },
    ],
    name: "CIDAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "cid",
        type: "string",
      },
    ],
    name: "CIDRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "cid",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "dealID",
        type: "uint256",
      },
    ],
    name: "DealIDRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "cid",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "dealID",
        type: "uint256",
      },
    ],
    name: "DealIDUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "cid",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "MultipleDealsRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_cid",
        type: "string",
      },
      {
        internalType: "uint256[]",
        name: "_dealIDs",
        type: "uint256[]",
      },
    ],
    name: "batchRemoveDealIDs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "files",
    outputs: [
      {
        internalType: "string",
        name: "filename",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "encryption",
        type: "bool",
      },
      {
        internalType: "string",
        name: "mimeType",
        type: "string",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "string",
        name: "_cid",
        type: "string",
      },
    ],
    name: "getFileDetails",
    outputs: [
      {
        internalType: "string",
        name: "filename",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "encryption",
        type: "bool",
      },
      {
        internalType: "string",
        name: "mimeType",
        type: "string",
      },
      {
        internalType: "uint256[]",
        name: "dealIDs",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_cid",
        type: "string",
      },
      {
        internalType: "string",
        name: "_filename",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_size",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_encryption",
        type: "bool",
      },
      {
        internalType: "string",
        name: "_mimeType",
        type: "string",
      },
      {
        internalType: "uint256[]",
        name: "_dealIDs",
        type: "uint256[]",
      },
    ],
    name: "pushCIDOnchain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_cid",
        type: "string",
      },
    ],
    name: "removeCID",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_cid",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_dealID",
        type: "uint256",
      },
    ],
    name: "removeDealID",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_cid",
        type: "string",
      },
      {
        internalType: "uint256[]",
        name: "_newDealIDs",
        type: "uint256[]",
      },
    ],
    name: "updateDealID",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
