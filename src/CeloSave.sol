// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CeloSave {
    mapping(address => uint256) public balances;

    // Gửi tiền vào hợp đồng
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // Rút tiền ra
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Not enough balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // Xem số dư của chính mình
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}
