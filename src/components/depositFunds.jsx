// DepositFundsButton.jsx
import React, { useState } from "react";
import Modal from "react-modal";
import { ethers } from "ethers";
import './cards.css';

// Set app element for accessibility
Modal.setAppElement("#root");

function DepositFundsButton({ contract }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ethAmount = parseFloat(amount);

    // Input validation
    if(isNaN(ethAmount)) {
      setTxStatus("Please enter a valid number.");
      return;
    }

    if(ethAmount <= 0)  {
      setTxStatus("Please enter a positive number.");
      return;
    }

    if(ethAmount > 2) {
      setTxStatus("You cannot contribute more than 2 ETH.");
      return;
    }

    if (!contract) {
      alert("Contract not connected");
      return;
    }

   

    try {
      setTxStatus("Sending transaction...");
      const tx = await contract.deposit({ value: ethers.parseEther(amount) });
      await tx.wait();
      setTxStatus("Your deposit has been successful!");
    } catch (err) {
      console.error(err);
      if (err.reason) {
        setTxStatus(
          `We ran into a little issue: ${err.reason}. Make sure you deposit less than 2 ETH.`
        );
      } else {
        setTxStatus("Transaction incomplete.");
      }
    }
  };

  return (
    <>
      <button className='modal-button' onClick={() => setIsOpen(true)}>Contribute</button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Deposit ETH"
        shouldCloseOnOverlayClick={true}

        >

        <button className="modal-close" onClick={() => setIsOpen(false)}>×</button> 
        <h2>Deposit ETH</h2>
        <p>Deposit ETH in this secure vault to contribute to the prize</p>
        <form onSubmit={handleSubmit} className="secure-form">
          <input
            type="text"
            step="0.01"
            min="0"
            max="2"
            placeholder="Enter amount between 0.5 and 2 ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit">Confirm Deposit</button>
        </form>
        <p>{txStatus}</p>
      </Modal>
    </>
  );
}

export default DepositFundsButton;