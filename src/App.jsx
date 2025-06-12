import { useState, useEffect  } from 'react';
import { ethers } from "ethers";
import './App.css'
import SecureVault from './SecureVault.json';
import AssignHunterForm from './components/assignHunter';
import DepositFundsForm from './components/depositFunds';
import ClaimBountyForm from './components/claimBounty';
import RefundForm from './components/refund';
import GetDeadline from './components/getDeadline';
import GetBalance from './components/sizePrize';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount,  useWatchContractEvent } from 'wagmi';


export const abi = SecureVault.abi;
const contractAddress = "0x855b3d7cD376b2FBF1AE0e69B1D11Ec4f989E302"; // on Sepolia




function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [message, setMessage] = useState(null);
  const [contract, setContract] = useState(null);
  const [hunter, setHunter] = useState(null);
  const [owner, setOwner] = useState(null);

  const { address, isConnected } = useAccount();

  // Listening to contract events and publish it on the console
  useWatchContractEvent({
    address: contractAddress,
    abi: abi,
    eventName: 'Deposit',
    onLogs(logs) {
      console.log('New deposit: ', logs)
    }
  })


  // Contract set up
  useEffect(()  => {
    const setupContract = async () => {
      if (!window.ethereum || !isConnected) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, SecureVault.abi, signer);
      console.log("Contract: ", contractInstance.address)

      setContract(contractInstance);
      setWalletAddress(address);

      try{
        const ownerAddress = await contractInstance.owner();
        setOwner(ownerAddress);
      } catch (e) {
        console.error("Unable to get the owner's address: ",e);
      }

      try{
        const hunterAddress = await contractInstance.hunter();
        setHunter(hunterAddress);
      } catch(e)  {
        setHunter(null);  // TODO: function to display something when the hunter is not assigned yet
      }
    };
    setupContract();
  } , [address, isConnected]);


  const readContract = async () => {
    if (!contract) return alert("Contract not connected");
    const value = await contract.checkBalance();
    setMessage(value.toString());
  }
  useEffect(() => {
    if (contract) {
      readContract();
    }
  }, [contract]);

  // Helper functions
  const isOwner = walletAddress && owner && walletAddress.toLowerCase() === owner.toLowerCase();
  
  const isHunter = walletAddress && hunter && walletAddress.toLowerCase() === hunter.toLowerCase();
  

  // Card rendering logic
  const renderCards = () => {
    if(!contract) {
      return(
        <>
          <p>Connect your wallet to get started.</p>
        </>
      )
    }
    else  {
      if (isOwner)  {
        return(
          <>
            <DepositFundsForm contract={contract} />
            <AssignHunterForm contract={contract} />
            <RefundForm contract={contract} />
          </>
        );
      } else if (isHunter)  {
        return(
        <>
            <DepositFundsForm contract={contract} />
            <ClaimBountyForm contract={contract} />
        </>
        );
      } else{
        console.log("no hunter or owner");
          return(
          <>
            <DepositFundsForm contract={contract} />
            <RefundForm contract={contract} />        
          </>
    )}
    }

  };


  return (

      <>
        <div className="top-menu">
          <ConnectButton />
         
        </div>

          <div className="title-box">
             <h4>The challenge</h4>
            <h1>Cross-Site Scripting (XSS) Vulnerability in User Profile Page</h1>
            <GetDeadline contract={contract}/>
          </div>

      <div className="main">
            <div className='left-box'>
              <h2>Cross-Site Vulnerability</h2>
              <div className="description">
                  Cross-Site Scripting (XSS) vulnerability has been identified in the user profile page of the application. When a user updates their profile information, specifically the "About Me" section, it does not properly sanitize input/ 
                  This allows an attacker to inject malicious JavaScript code that executes when other users view the profile.
                     <h5>Expected Result:</h5>
                      The application should sanitize the input and display the text without executing any scripts.<br/>

                      <h5>Result:</h5>
                      The injected script executes, displaying an alert box with the message "XSS Vulnerability!" when the profile is viewed.

                       <h5>Impact:</h5>
                      This vulnerability can lead to session hijacking, data theft, or other malicious actions against users of the application. It poses a significant security risk, especially if sensitive information is accessible through the user profiles.<br/>

                      <h5>Recommendation:</h5>
                      Implement proper input validation and output encoding to prevent XSS attacks. Use libraries such as DOMPurify to sanitize user inputs before rendering them on the page.
                 
              </div>
            </div>

            <div className='side-panel'>
              {!contract ? (
                <div></div>
              ) : (
                <GetBalance contract={contract} />
              )}
              
              {renderCards()}
            </div>


       </div>
        


      
      </>  
 
        

  );
}

export default App;
