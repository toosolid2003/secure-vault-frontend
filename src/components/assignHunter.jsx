import { useState } from 'react';
import './cards.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function AssignHunterForm( {contract}) {
    const [hunter, setHunter] = useState("");
    const [txStatus, settxStatus] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e) => {
        setHunter(e.target.value);
    };

    const handleSubmit = async (e)  => {
        e.preventDefault();
        if(!contract)   {
            alert("Contract not connected");
            return;
        }

        try {
            settxStatus("Sending transaction...");
            const tx = await contract.assign_hunter(hunter);
            await tx.wait();
            settxStatus("Hunter assigned successfully");
            setHunter("");
        }
        catch   (err)   {
            console.log(err);
            settxStatus("Transaction failed");
        }
    };

    return  (
        <>
            <button className="modal-button" onClick={() => setIsOpen(true)}>Assign Hunter</button>
            <Modal
                isOpen={isOpen}
                contentLabel='Assign a winner'
                onRequestClose={() => setIsOpen(false)}
                shouldCloseOnEsc={true}
            >
                <button className="modal-close" onClick={() => setIsOpen(false)}>x</button>
                <h2>Assign Hunter</h2>
                <p>Specify the wallet address of the prize winner of this challenge below.</p>
                <form onSubmit={handleSubmit} className='secure-form'>
                    <input
                        type="text"
                        id="hunter"
                        value={hunter}
                        onChange={handleChange}
                        placeholder='0x......'
                        style={{ width: "100%", padding: "0.5em", marginTop: "0.5em" }}
                        />
                        <br/><br/>
                        <button type="submit">Assign Hunter</button>
                </form>
                <p>{txStatus}</p>


            </Modal>

        </>

    );
}

export default AssignHunterForm;