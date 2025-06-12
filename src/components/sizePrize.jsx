import { useState, useEffect } from 'react'
import { ethers } from 'ethers';


// Retrieve the contract balance
function GetBalance({ contract })   {
    const [balance, setBalance] = useState(null);
    
    useEffect(()    => {
        if(!contract) return;
        
        let isMounted = true;
        
        async function fetchBalance()   {
            try{
                const b = await contract.checkContractBalance();
                if(isMounted)   {
                    setBalance(ethers.formatEther(b));
                }
            }   
            catch (err)  {
                    console.error("Error fetching balance", err);
                }
        };

    const onDeposit = (sender, amount) => {
        console.log("New deposit from:", sender, "for ", amount.toString());
        fetchBalance(); // Fetchbalance everytime a new deposit is made
    };

    fetchBalance();
    contract.on('Deposit', onDeposit);

    return() => {
        isMounted = false;
        contract.off('Deposit', onDeposit);
    };

    }, [contract]   // Also, everytime the contract variable changes, call the fecthBalance function
    );

    if(!contract) return null;

    return(
        <div>
           <h3>Prize: {balance} ETH</h3> 
        </div>
    )

    // Return the contract balance as int
}

export default GetBalance;