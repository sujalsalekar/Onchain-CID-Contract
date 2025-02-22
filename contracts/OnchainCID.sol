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
    }

    // Mapping: user address => CID => FileMetadata
    mapping(address => mapping(string => FileMetadata)) public files;

    
    event CIDAdded(address indexed user, string cid, string filename);
    event DealIDUpdated(address indexed user, string cid, uint256 dealID);
    event CIDRemoved(address indexed user, string cid);
    event DealIDRemoved(address indexed user, string cid, uint256 dealID);
    event MultipleDealsRemoved(address indexed user, string cid, uint256 count);

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

        files[msg.sender][_cid] = FileMetadata({
            filename: _filename,
            size: _size,
            encryption: _encryption,
            mimeType: _mimeType,
            dealIDs: _dealIDs,
            exists: true
        });

        emit CIDAdded(msg.sender, _cid, _filename);
    }

    function updateDealID(string memory _cid, uint256[] memory _newDealIDs) public {
        require(bytes(files[msg.sender][_cid].filename).length > 0, "CID does not exist");
        
        for (uint i = 0; i < _newDealIDs.length; i++) {
            files[msg.sender][_cid].dealIDs.push(_newDealIDs[i]);
            emit DealIDUpdated(msg.sender, _cid, _newDealIDs[i]);
        }
    }

    function getFileDetails(address _user, string memory _cid) public view returns (
        string memory filename,
        uint256 size,
        bool encryption,
        string memory mimeType,
        uint256[] memory dealIDs
    ) {
        FileMetadata memory file = files[_user][_cid];
        require(file.exists, "CID does not exist");
        
        return (
            file.filename,
            file.size,
            file.encryption,
            file.mimeType,
            file.dealIDs
        );
    }

    function removeDealID(string memory _cid, uint256 _dealID) public {
        require(files[msg.sender][_cid].exists, "CID does not exist");
        uint256[] storage deals = files[msg.sender][_cid].dealIDs;
        
        for (uint i = 0; i < deals.length; i++) {
            if (deals[i] == _dealID) {
                deals[i] = deals[deals.length - 1];
                deals.pop();
                emit DealIDRemoved(msg.sender, _cid, _dealID);
                return;
            }
        }
        revert("Deal ID not found");
    }

    function removeCID(string memory _cid) public {
        require(files[msg.sender][_cid].exists, "CID does not exist");
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
        emit MultipleDealsRemoved(msg.sender, _cid, removedCount);
    }
}
