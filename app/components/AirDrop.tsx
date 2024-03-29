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
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = React.useState<
    "info" | "success" | "error" | "warning"
  >("info");

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    try {
      setStatus("warning");
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

      setStatus("success");
      setIsLoading(false);
      toast.success("Airdrop Successfull");

      setAddress("");
      setAmount("");
    } catch (error: any) {
      //   const errorObject = JSON.parse(error);
      //   const errorMessage = errorObject.error.message;
      toast.error("Airdrop failed");
      setIsLoading(false);
      setError(error);
      setStatus("error");
    }
  };

  return (
    <div className="w-full h-[80vh]">
      <div className="flex justify-center items-center flex-col h-full">
        <h1 className="text-center mt-7 text-6xl font-medium bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
          Solana Airdrop App
        </h1>
        <form
          onSubmit={handleFormSubmit}
          className="w-[50%] h-64 p-6 rounded-lg shadow-lg items-center justify-center flex flex-col"
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

          <button
            type="submit"
            className="w-40 justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg focus:outline-none focus:shadow-outline"
          >
            {isLoading ? <PulseLoader color="#ffffff" size={10} /> : "Air Drop"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AirDrop;
