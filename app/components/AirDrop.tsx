"use client";

import React, { useState } from "react";
import {
  PublicKey,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";

const AirDrop = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balanceLoader, setBalanceLoader] = useState(false);

  const handleBalance = async () => {
    try {
      setBalanceLoader(true);
      let publicKey: any = {};
      try {
        publicKey = new PublicKey(address);
      } catch (error: any) {
        setBalanceLoader(false);
        if (error?.message === "Invalid public key input") {
          toast.error("Invalid Solana Wallet Address!");
        } else {
          toast.error(error?.message || "Error");
        }
        return;
      }
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const walletBalance = await connection.getBalance(publicKey);
      setBalanceLoader(false);
      toast.success(
        `wallet ballance is ◎${walletBalance / LAMPORTS_PER_SOL} SOL`
      );
    } catch (err: any) {
      setBalanceLoader(false);
      toast.error(err);
    }
  };

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      let publicKey: any = {};
      try {
        publicKey = new PublicKey(address);
      } catch (error: any) {
        setIsLoading(false);
        if (error?.message === "Invalid public key input") {
          toast.error("Invalid Solana Wallet Address!");
        } else {
          toast.error(error?.message || "Error");
        }
        return;
      }
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );

      const fromAirDropSignature = await connection.requestAirdrop(
        publicKey,
        +amount * LAMPORTS_PER_SOL
      );

      await connection.confirmTransaction(fromAirDropSignature);

      setIsLoading(false);
      toast.success("Airdrop Successfull");

      setAddress("");
      setAmount("");
    } catch (error: any) {
      toast.error("Airdrop failed", {
        duration: 1000,
      });
      toast.error(
        "You have requested too many airdrops. Wait 24 hours for a refill.",
        {
          duration: 3000,
        }
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[80vh]">
      <div className="flex justify-center items-center flex-col h-full">
        <h1 className="text-center mt-7 md:text-6xl text-2xl font-medium bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
          Solana Airdrop App
        </h1>
        <form
          onSubmit={handleFormSubmit}
          className="w-[50%] h-64 p-6 pb-0 rounded-lg shadow-lg items-center justify-center md:flex flex-col"
        >
          <input
            type="text"
            name=""
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="w-full px-4 py-2 mb-4 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:bg-gray-700"
            placeholder="Solana Wallet Address"
          />

          <input
            type="number"
            name=""
            value={amount}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 mb-4 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:bg-gray-700"
            placeholder="Eample: 1 SOL"
            onChange={(event) => setAmount(event.target.value)}
          />

          <div className="flex gap-5 flex-col md:flex-row md:gap-5">
            <button
              type="submit"
              className="w-full md:w-40 justify-center md:rounded-lg items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg focus:outline-none focus:shadow-outline md:focus:rounded-lg"
            >
              {isLoading ? (
                <PulseLoader color="#ffffff" size={10} />
              ) : (
                "Air Drop"
              )}
            </button>
            <button
              type="button"
              onClick={handleBalance}
              className="w-full md:w-40 justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg focus:outline-none focus:shadow-outline md:rounded-lg md:focus:rounded-lg"
            >
              {balanceLoader ? (
                <PulseLoader color="#ffffff" size={10} />
              ) : (
                "Check Balance"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AirDrop;
