import { useState, useEffect } from 'react'
import { ethers } from 'ethers';


// Set useState 



// Retrieve the contract balance
function GetBalance({ contract })   {
    const [balance, setBalance] = useState(null);
    
    useEffect(()    => {
        async function fetchBalance()   {
            if(!contract) return;

            const b = await contract.checkBalance();
            setBalance(ethers.formatEther(b));
    
        }

    fetchBalance(); // calling the function just after being defined
    
    const onDeposit = (sender, amount) => {
        console.log("New deposit from:", sender, "for ", amount.toString());
        fetchBalance(); // Fetchbalance everytime a new deposit is made
    };

    contract.on('Deposit', onDeposit);

    return() => {
        contract.off('Deposit', onDeposit);
    };

    }, [contract]   // Also, everytime the contract variable changes, call the fecthBalance function
    );

    return(
        <div>
           <h3>Prize: {balance} ETH</h3> 
        </div>
    )

    // Return the contract balance as int
}

export default GetBalance;

// event Deposit(address indexed contributor, uint amount);