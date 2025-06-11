import { useState } from "react";
import './cards.css';
import Modal from 'react-modal';


Modal.setAppElement('#root');

function ClaimBountyForm({contract})    {
    const [txstatus, settxStatus] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    
    

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!contract)   {
            alert("Contract not connected");
            settxStatus("Contract not connected");
        }

        try{
            settxStatus("Claiming bounty...");
            const tx = await contract.claim_bounty();
            await tx.wait();
            settxStatus("Transaction sent");
        }
        catch (err) {
            console.log(err)
            if(err.reason)  {
                settxStatus(`We ran into an issue: ${err.reason}`);
            }
            else {
                settxStatus("Error: check the browser console for details");
            }

        }
    };

    return (
        <>
            <button className="modal-button" onClick={() => setIsOpen(true)}>Claim</button>
            <Modal
                isOpen={isOpen}
                shouldCloseOnOverlayClick={true}
                onRequestClose={() => setIsOpen(false)}
                contentLabel="Claim your bounty!"
            
            >
                <button className="modal-close" onClick={() => setIsOpen(false)}>x</button>
                <h2>You won the contest!</h2>
                <p>Congrats, you have been rewarded with the bounty. Claim it here!</p>
                <form onSubmit={handleSubmit} className="secure-form">
                    <button type="submit">Claim</button> 
                </form>

            </Modal>
        </>


    )
};

export default ClaimBountyForm;
