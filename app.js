window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        // Request account access if needed (for modern dApp browsers and MetaMask)
        if (window.ethereum) {
            window.ethereum.enable().then(function(accounts) {
                web3.eth.defaultAccount = accounts[0]; // Set the default account
            });
        }
    } else {
        // Set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    const contractAddress = '0xD0a48A2d68DAeC51DD732df3D67B565F961c4b1d'; // Replace with your contract address
    const abi = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint256","name":"_initialSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSymbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"getWalletName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"},{"internalType":"string","name":"_name","type":"string"}],"name":"setMyWalletName","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"}]
    const myContract = new web3.eth.Contract(abi, contractAddress);


    // ... other event listeners ...

    document.getElementById('btnTransfer').addEventListener('click', function () {
        const toAddress = document.getElementById('transferToAddress').value;
        const amount = document.getElementById('transferAmount').value;

        // Ensure that there's a default account set
        if (!web3.eth.defaultAccount) {
            alert("No Ethereum account detected. Please ensure your wallet (e.g., MetaMask) is connected and refresh the page.");
            return;
        }

        const fromAccount = web3.eth.defaultAccount;

        // Adjust this to match your token's decimals
        const amountToSend = web3.utils.toWei(amount, 'ether'); 

        myContract.methods.transfer(toAddress, amountToSend).send({ from: fromAccount })
            .then(function (receipt) {
                document.getElementById('transferInfo').innerText = `Transfer successful: ${receipt.transactionHash}`;
            }).catch(function (error) {
                document.getElementById('transferInfo').innerText = `Error: ${error.message}`;
            });
    });



    document.getElementById('btnGetTokenInfo').addEventListener('click', function () {
        myContract.methods.getName().call().then(function (name) {
            myContract.methods.getSymbol().call().then(function (symbol) {
                myContract.methods.getTotalSupply().call().then(function (supply) {
                    document.getElementById('tokenInfo').innerText = `Name: ${name}\nSymbol: ${symbol}\nTotal Supply: ${supply}`;
                });
            });
        });
    });
    // ... existing JavaScript code ...

    document.getElementById('btnMint').addEventListener('click', function () {
        const toAddress = document.getElementById('mintToAddress').value;
        const amount = document.getElementById('mintAmount').value;

        // Assuming the user's account is already connected
        web3.eth.getAccounts().then(function (accounts) {
            const fromAccount = accounts[0]; // Using the first account in MetaMask

            myContract.methods.mint(toAddress, amount).send({ from: fromAccount })
                .then(function (receipt) {
                    document.getElementById('mintInfo').innerText = `Minted ${amount} tokens to ${toAddress}`;
                }).catch(function (error) {
                    document.getElementById('mintInfo').innerText = `Error: ${error.message}`;
                });
        });
    });

    // ... rest of the existing JavaScript code ...


    document.getElementById('btnGetBalance').addEventListener('click', function () {
        const address = document.getElementById('balanceOfAddress').value;
        myContract.methods.balanceOf(address).call().then(function (balance) {
            document.getElementById('balanceInfo').innerText = `Balance: ${balance}`;
        });
    });

});
