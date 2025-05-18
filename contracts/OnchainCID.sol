// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract OnchainCID {
    struct FileMetadata {
        string filename;
        uint256 size;
        bool encryption;
        string mimeType;
        uint256[] dealIDs;
        bool exists;
        uint256 createdAt;     // New field for creation timestamp
        uint256 updatedAt;     // New field for last update timestamp
    }

    // Mapping: user address => CID => FileMetadata
    mapping(address => mapping(string => FileMetadata)) public files;

    // Mapping to track pending ownership transfers
    mapping(address => mapping(string => address)) public pendingTransfers;
    
    event CIDAdded(address indexed user, string cid, string filename, uint256 timestamp);
    event DealIDUpdated(address indexed user, string cid, uint256 dealID, uint256 timestamp);
    event CIDRemoved(address indexed user, string cid);
    event DealIDRemoved(address indexed user, string cid, uint256 dealID);
    event MultipleDealsRemoved(address indexed user, string cid, uint256 count);
    event OwnershipTransferInitiated(address indexed from, address indexed to, string cid);
    event OwnershipTransferCompleted(address indexed from, address indexed to, string cid);
    event OwnershipTransferCancelled(address indexed from, address indexed to, string cid);
    event MetadataUpdated(address indexed user, string cid, uint256 timestamp);

    // Function to push a new CID with its metadata
    function pushCIDOnchain(
        string memory _cid,
        string memory _filename,
        uint256 _size,
        bool _encryption,
        string memory _mimeType,
        uint256[] memory _dealIDs
    ) public {
        require(bytes(_cid).length > 0, "CID cannot be empty");
        require(bytes(_filename).length > 0, "Filename cannot be empty");
        require(_size > 0, "Size must be greater than 0");
        require(!files[msg.sender][_cid].exists, "CID already exists");

        uint256 currentTime = block.timestamp;
        files[msg.sender][_cid] = FileMetadata({
            filename: _filename,
            size: _size,
            encryption: _encryption,
            mimeType: _mimeType,
            dealIDs: _dealIDs,
            exists: true,
            createdAt: currentTime,
            updatedAt: currentTime
        });

        emit CIDAdded(msg.sender, _cid, _filename, currentTime);
    }

    function updateDealID(string memory _cid, uint256[] memory _newDealIDs) public {
        require(files[msg.sender][_cid].exists, "CID does not exist");
        
        uint256 currentTime = block.timestamp;
        files[msg.sender][_cid].updatedAt = currentTime;
        
        for (uint i = 0; i < _newDealIDs.length; i++) {
            files[msg.sender][_cid].dealIDs.push(_newDealIDs[i]);
            emit DealIDUpdated(msg.sender, _cid, _newDealIDs[i], currentTime);
        }
    }

    function getFileDetails(address _user, string memory _cid) public view returns (
        string memory filename,
        uint256 size,
        bool encryption,
        string memory mimeType,
        uint256[] memory dealIDs,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        FileMetadata memory file = files[_user][_cid];
        require(file.exists, "CID does not exist");
        
        return (
            file.filename,
            file.size,
            file.encryption,
            file.mimeType,
            file.dealIDs,
            file.createdAt,
            file.updatedAt
        );
    }

    // Initiate file ownership transfer
    function initiateOwnershipTransfer(string memory _cid, address _newOwner) public {
        require(files[msg.sender][_cid].exists, "CID does not exist");
        require(_newOwner != address(0), "Invalid new owner address");
        require(_newOwner != msg.sender, "Cannot transfer to self");
        require(pendingTransfers[msg.sender][_cid] == address(0), "Transfer already pending");
        
        pendingTransfers[msg.sender][_cid] = _newOwner;
        emit OwnershipTransferInitiated(msg.sender, _newOwner, _cid);
    }

    // Accept file ownership transfer
    function acceptOwnershipTransfer(address _currentOwner, string memory _cid) public {
        require(pendingTransfers[_currentOwner][_cid] == msg.sender, "No pending transfer");
        require(files[_currentOwner][_cid].exists, "CID does not exist");

        // Copy file metadata to new owner
        FileMetadata memory fileData = files[_currentOwner][_cid];
        fileData.updatedAt = block.timestamp;
        files[msg.sender][_cid] = fileData;

        // Remove file from current owner
        delete files[_currentOwner][_cid];
        delete pendingTransfers[_currentOwner][_cid];

        emit OwnershipTransferCompleted(_currentOwner, msg.sender, _cid);
    }

    // Cancel a pending ownership transfer
    function cancelOwnershipTransfer(string memory _cid) public {
        require(pendingTransfers[msg.sender][_cid] != address(0), "No pending transfer");
        address pendingOwner = pendingTransfers[msg.sender][_cid];
        delete pendingTransfers[msg.sender][_cid];
        emit OwnershipTransferCancelled(msg.sender, pendingOwner, _cid);
    }

    function removeDealID(string memory _cid, uint256 _dealID) public {
        require(files[msg.sender][_cid].exists, "CID does not exist");
        uint256[] storage deals = files[msg.sender][_cid].dealIDs;
        
        for (uint i = 0; i < deals.length; i++) {
            if (deals[i] == _dealID) {
                deals[i] = deals[deals.length - 1];
                deals.pop();
                files[msg.sender][_cid].updatedAt = block.timestamp;
                emit DealIDRemoved(msg.sender, _cid, _dealID);
                return;
            }
        }
        revert("Deal ID not found");
    }

    function removeCID(string memory _cid) public {
        require(files[msg.sender][_cid].exists, "CID does not exist");
        require(pendingTransfers[msg.sender][_cid] == address(0), "Cannot remove file with pending transfer");
        delete files[msg.sender][_cid];
        emit CIDRemoved(msg.sender, _cid);
    }

    // Batch remove deal IDs (gas efficient)
    function batchRemoveDealIDs(string memory _cid, uint256[] memory _dealIDs) public {
        require(files[msg.sender][_cid].exists, "CID does not exist");
        
        uint256[] storage deals = files[msg.sender][_cid].dealIDs;
        uint256 removedCount = 0;
        
        for (uint i = 0; i < _dealIDs.length; i++) {
            for (uint j = 0; j < deals.length; j++) {
                if (deals[j] == _dealIDs[i]) {
                    deals[j] = deals[deals.length - 1];
                    deals.pop();
                    removedCount++;
                    break;
                }
            }
        }
        
        require(removedCount > 0, "No matching deal IDs found");
        files[msg.sender][_cid].updatedAt = block.timestamp;
        emit MultipleDealsRemoved(msg.sender, _cid, removedCount);
    }
}
