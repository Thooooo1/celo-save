# 🪙 CeloDonate Pro

**CeloDonate Pro** là một ứng dụng phi tập trung (dApp) được xây dựng trên **mạng Celo Sepolia Testnet**, cho phép người dùng **kết nối ví MetaMask và thực hiện quyên góp minh bạch bằng token CELO**.  
Dự án minh họa quy trình xây dựng một hệ thống quyên góp trên blockchain — nơi mọi giao dịch đều được ghi lại công khai và không thể chỉnh sửa.

---

## 👩‍💻 Thành viên thực hiện

- **Nguyễn Anh Thơ**
- **Nguyễn Thị Dung**

---

## 🎯 Mục tiêu dự án

Mục tiêu chính của **CeloDonate Pro** là:

- Tạo ra một nền tảng quyên góp minh bạch trên blockchain Celo.
- Giúp người dùng dễ dàng quyên góp CELO trực tiếp từ ví MetaMask.
- Đảm bảo rằng toàn bộ giao dịch được ghi lại công khai, có thể xác minh qua block explorer.
- Minh họa quy trình xây dựng và triển khai **smart contract + frontend React** kết nối ví blockchain.

Dự án hướng tới việc **ứng dụng Web3** trong lĩnh vực **minh bạch tài chính từ thiện** — giúp giảm gian lận, tăng niềm tin và cho phép người quyên góp theo dõi các khoản đóng góp của mình.

---

## ⚙️ Công nghệ sử dụng

| Thành phần                       | Công nghệ / Công cụ                                                        |
| -------------------------------- | -------------------------------------------------------------------------- |
| **Ngôn ngữ hợp đồng thông minh** | Solidity                                                                   |
| **Triển khai Smart Contract**    | Foundry                                                                    |
| **Frontend**                     | ReactJS                                                                    |
| **Thư viện Web3**                | Ethers.js v6                                                               |
| **Ví**                           | MetaMask                                                                   |
| **Mạng blockchain**              | Celo Sepolia Testnet                                                       |
| **RPC Provider**                 | `https://forno.celo-sepolia.celo-testnet.org`                              |
| **Block Explorer**               | [https://celo-sepolia.blockscout.com](https://celo-sepolia.blockscout.com) |

---

## 🧠 Ý tưởng & Nguyên lý hoạt động

**CeloDonate Pro** hoạt động như sau:

1. **Kết nối ví MetaMask:**  
   Ứng dụng tự động yêu cầu người dùng kết nối ví MetaMask và chuyển sang mạng **Celo Sepolia Testnet**. Nếu mạng chưa tồn tại, hệ thống sẽ đề xuất thêm tự động.

2. **Giao diện quyên góp:**  
   Người dùng nhập số lượng CELO muốn ủng hộ (ví dụ `0.01 CELO`), sau đó nhấn **Gửi**.

3. **Thực thi giao dịch:**  
   Ứng dụng tạo giao dịch thông qua **Ethers.js** và gửi đến smart contract đã triển khai trên blockchain.  
   Giao dịch được xác nhận công khai qua block explorer.

4. **Theo dõi kết quả:**  
   Sau khi hoàn tất, người dùng nhận thông báo giao dịch thành công và có thể kiểm tra trực tiếp trên block explorer.

---

## 💡 Chi tiết kỹ thuật Smart Contract

Smart contract `CeloDonate.sol` được viết bằng **Solidity** với hai hàm chính:

```solidity
function donate() public payable {
    // Cho phép người dùng gửi CELO tới contract
}

function donatedAmount(address user) public view returns (uint256) {
    // Trả về tổng số CELO mà người dùng đã quyên góp
}
```
