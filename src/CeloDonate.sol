// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CeloDonate {
    struct Donor {
        address addr;
        uint256 amount;
    }

    Donor[] public donors;
    mapping(address => uint256) public donatedAmount;
    uint256 public totalDonations;

    // Hàm quyên góp
    function donate() public payable {
        require(msg.value > 0, "Phai gui mot so luong CELO");
        donatedAmount[msg.sender] += msg.value;
        totalDonations += msg.value;
        donors.push(Donor(msg.sender, msg.value));
    }

    // Tổng số tiền đã quyên góp
    function getTotalDonations() public view returns (uint256) {
        return totalDonations;
    }

    // Lấy số lượng người quyên góp
    function getDonorCount() public view returns (uint256) {
        return donors.length;
    }

    // Lấy thông tin người quyên góp theo index
    function getDonorAt(uint256 index)
        public
        view
        returns (address, uint256)
    {
        require(index < donors.length, "Chi so khong hop le");
        Donor memory d = donors[index];
        return (d.addr, d.amount);
    }

    // Lấy số tiền đã quyên góp của người gọi
    function getMyDonation() public view returns (uint256) {
        return donatedAmount[msg.sender];
    }
}
