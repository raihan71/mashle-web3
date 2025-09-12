// SPDX-License-Identifier: UNLICENSED 

pragma solidity ^0.8.28;

contract Transactions {
    uint256 transactionCount;

    event Transfer(
        address from,
        address receiver,
        uint amount,
        string message,
        uint256 timestamp,
        string keyword
    );

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBlockchain(
        address payable receiver, 
        uint amount, 
        string memory message, 
        string memory keyword
    ) public {
        transactionCount += 1;
        transactions.push(TransferStruct(
            msg.sender, 
            receiver, 
            amount, 
            message, 
            block.timestamp, 
            keyword
        ));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    function getTransactionsByAddress(address user) public view returns (TransferStruct[] memory) {
        TransferStruct[] memory userTransactions = new TransferStruct[](transactionCount);
        uint256 userTransactionCount = 0;
        
        for (uint256 i = 0; i < transactions.length; i++) {
            if (transactions[i].sender == user || transactions[i].receiver == user) {
                userTransactions[userTransactionCount] = transactions[i];
                userTransactionCount++;
            }
        }
        
        // Create a new array with the correct size
        TransferStruct[] memory result = new TransferStruct[](userTransactionCount);
        for (uint256 i = 0; i < userTransactionCount; i++) {
            result[i] = userTransactions[i];
        }
        
        return result;
    }
}