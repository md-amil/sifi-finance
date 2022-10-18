let Web3Modal = window.Web3Modal.default;
const connectBtn = document.getElementById("connect-btn");
let walletAddress = [];
let web3, provider, web3Modal;
let busdBalance;
let busdContract;
let chainId;
let showTokenInput = document.getElementById("sifi-token-contract-input")
const networkLabelEl = $('#network-label');

const chainLabels = {
	1: 'Ethereum',
	97: 'BSC Testnet',
	56: 'BSC Mainnet'
}

async function connect() {
	web3Modal = new Web3Modal({
		cacheProvider: false,
		providerOptions: {},
		disableInjectedProvider: false,
	});
	provider = await web3Modal.connectTo("injected");
	web3 = new Web3(provider);
	walletAddress = await web3.eth.getAccounts();
	if (walletAddress.length > 0) {
		const wallet =
			walletAddress[0].substr(0, 6) +
			"..." +
			walletAddress[0].substr(walletAddress[0].length - 4);
		connectBtn.innerText = wallet;
		chainId = await web3.eth.getChainId()
		console.log({chainId})
		const label = chainLabels[chainId];
		if (label) {
			networkLabelEl.text(label).show();
		}
		provider.on("networkChanged", async function() {
			// console.log('networkChanged', network);
			window.location.reload()

			// Time to reload your interface with accounts[0]!
			// accounts = await web3.eth.getAccounts();
			// accounts = await web3.eth.getAccounts();
			console.log(accounts);
		  });
		showTokenInput.placeholder = getPrivateSaleToken(chainId)
		busdContract = new web3.eth.Contract(getBusdABI(chainId), getBusdToken(chainId));
		busdBalance = await busdContract.methods
			.balanceOf(walletAddress[0])
			.call();
		document.getElementById("wallet-balance").innerText =
			"Balance: " + Number(busdBalance / 10 ** 18).toFixed(3) + " BUSD";
		document.getElementById("connected-label").innerText = "";
		// document.getElementById("address-link").placeholder = walletAddress[0];
	}
	// if (provider) {
	// 	try {
	// 		await provider.request({ method: "eth_requestAccounts" });
	//         web3 = new Web3(provider);
	//         walletAddress = await web3.eth.getAccounts();
	//         if(walletAddress.length > 0){
	//             connectBtn.innerText = walletAddress[0].substr(0, 6)+"..."+walletAddress[0].substr(walletAddress[0].length - 4);
	//             label.innerText = ''
	//         }
	// 	} catch (err) {
	//         console.log(err)
	// 	}
	// }
}

window.addEventListener("load", connect());
