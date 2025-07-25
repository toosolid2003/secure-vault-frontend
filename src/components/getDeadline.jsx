import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function GetDeadline({ contract }) {
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    async function fetchDeadline() {
      if (!contract) return;

      try {
        const rawDeadline = await contract.checkDeadline();


        const timestamp = Number(rawDeadline.toString()) * 1000; // Convert to ms
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMs = date - now;
        const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        if(daysLeft < 0)  {
          setDeadline("Deadline has expired");
        }

        else{
          const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          };

          const formatted = date.toLocaleString(undefined, options);
          setDeadline(`${formatted} (${daysLeft} days left)`);
        }

      } catch (err) {
        console.error("Error fetching deadline:", err);
        setDeadline("Error loading deadline");
      }
    }

    fetchDeadline();
  }, [contract]);

  return (
    <div>
      <h4>{deadline || 'To view the deadline and participate, please connect your wallet'}</h4>
    </div>
  );
}

export default GetDeadline;