import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./index.css";
import CeloDonate from "./abis/CeloDonate.json";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./App.css";

// 🧾 Địa chỉ contract bạn đã deploy trên Alfajores
const CONTRACT_ADDRESS = "0xA248Bb13c14EA06aC8f64d14E96060c59f401b55";
const CONTRACT_ABI = CeloDonate.abi;

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("0");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧩 Kết nối MetaMask & chuyển mạng sang Alfajores
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("⚠️ Vui lòng cài đặt MetaMask!");
      return;
    }

    // ✅ Kiểm tra và chuyển mạng
    const celoChainId = "0xaef3"; // 44787
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== celoChainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: celoChainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: celoChainId,
                  chainName: "Celo Alfajores Testnet",
                  nativeCurrency: {
                    name: "CELO",
                    symbol: "CELO",
                    decimals: 18,
                  },
                  rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
                  blockExplorerUrls: ["https://alfajores.celoscan.io/"],
                },
              ],
            });
          } else throw switchError;
        }
      }
    } catch (err) {
      console.error("⚠️ Lỗi khi kiểm tra/chuyển mạng:", err);
      alert("Không thể chuyển sang mạng Celo Alfajores.");
      return;
    }

    // ✅ Kết nối ví
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setProvider(provider);
      setAccount(accounts[0]);
      setContract(contract);
      await loadStats(contract);
    } catch (err) {
      console.error("❌ Lỗi khi kết nối ví:", err);
      alert("Không thể kết nối ví. Hãy thử lại.");
    }
  };

  // 💰 Gửi tiền quyên góp
  const donate = async () => {
    if (!amount || isNaN(amount)) {
      alert("⚠️ Nhập số CELO hợp lệ!");
      return;
    }
    try {
      setLoading(true);
      const tx = await contract.donate({
        value: ethers.parseEther(amount.toString()),
      });
      await tx.wait();
      setAmount("");
      await loadStats(contract);
      alert("🎉 Cảm ơn bạn đã quyên góp!");
    } catch (err) {
      console.error(err);
      alert("❌ Giao dịch thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // 📊 Lấy thống kê
  const loadStats = async (c) => {
    const ct = c || contract;
    if (!ct) return;

    try {
      const total = await ct.getTotalDonations();
      const count = await ct.getDonorCount();

      let donorData = [];
      for (let i = 0; i < count; i++) {
        const [addr, value] = await ct.getDonorAt(i);
        donorData.push({
          name: addr.slice(0, 6) + "..." + addr.slice(-4),
          amount: Number(ethers.formatEther(value)),
        });
      }

      setTotal(ethers.formatEther(total));
      setDonors(donorData);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    if (contract) loadStats();
  }, [contract]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #e0ffe5 0%, #fffde1 100%)",
        color: "#333",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-green-600 mb-2">
          🎗️ CeloDonate Pro
        </h1>
        <p className="text-lg mb-6">
          Nền tảng quyên góp minh bạch trên <b>Celo Blockchain 🌍</b>
        </p>
      </motion.div>

      {!account ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={connectWallet}
          className="px-6 py-3 bg-green-500 text-white rounded-xl shadow-lg font-semibold"
        >
          Kết nối ví MetaMask
        </motion.button>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mt-6 w-80 text-center"
          >
            <p className="font-semibold text-gray-600">
              Ví: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
            <p className="text-xl mt-2 mb-4 text-green-700 font-bold">
              Tổng quyên góp: {Number(total).toFixed(2)} CELO
            </p>

            <input
              type="number"
              placeholder="Nhập số CELO"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded-lg p-2 w-full mb-3 text-center"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={donate}
              disabled={loading}
              className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold w-full"
            >
              {loading ? "Đang gửi..." : "Quyên góp 💚"}
            </motion.button>
          </motion.div>

          {donors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-10 w-full flex flex-col items-center"
            >
              <h2 className="text-2xl font-semibold text-green-700 mb-3">
                🌟 Top Người Quyên Góp
              </h2>
              <ResponsiveContainer width="80%" height={300}>
                <BarChart data={donors}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
