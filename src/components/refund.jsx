import { useState } from "react";
import './cards.css';
import Modal from "react-modal";


// Set app element for accessibility
Modal.setAppElement("#root");

function RefundForm({contract})    {
    const [txstatus, settxStatus] = useState("");
    const [isOpen, setOpen] = useState(false);
    
    

    const handleSubmit = async (e) => {
        e.preventDefault(); // Preventing page reload on submit
        if(!contract)   {
            alert("Contract not connected");
            settxStatus("Contract not connected");
            return;
        }

        try{
            settxStatus("Claiming refund...");
            const tx = await contract.refund();
            await tx.wait();
            settxStatus("Refund successful!");
        }
        catch (err) {
            console.log(err)
            if (err.reason) {
                settxStatus(`Sorry: ${err.reason}`);    // Displaying the error message sent by the contract
            }
            
        }
    };

    return (
        <>
            <button className="modal-button" onClick={() => setOpen(true)}>Refund</button>
            <Modal
                isOpen={isOpen}
                shouldCloseOnOverlayClick={true}
                onRequestClose={() => setOpen(false)}
                contentLabel="Ask for refund"
                >
        
                <button className="modal-close" onClick={() => setOpen(false)}>x</button>
                    <h2>Refund</h2>
                    <p>You can ask for a refund before the deadline expires. Fees are on you.</p>
                    <form onSubmit={handleSubmit} className="secure-form">
                        <button type="submit">Ask refund</button>
                    </form>
                    <p>{txstatus}</p>

            </Modal>        
        </>



    )
};

export default RefundForm;
