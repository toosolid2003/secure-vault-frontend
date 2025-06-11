import { useState, useEffect } from 'react'


// Set useState 



// Retrieve the contract balance
function GetBalance({ contract })   {
    const [balance, setBalance] = useState(null);
    
    useEffect(()    => {
        async function fetchBalance()   {
            if(!contract) return;

            const b = await contract.checkBalance();
            setBalance(b);
    
        }

    fetchBalance(); // calling the function just after being defined
    }, [contract]   // Everytime the contract variable changes, call the fecthBalance function
    );

    return(
        <div>
            {balance}
        </div>
    )

    // Return the contract balance as int
}

export default GetBalance;
