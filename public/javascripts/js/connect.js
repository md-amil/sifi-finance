let Web3Modal = window.Web3Modal.default;
const connectBtn = document.getElementById("connect-btn");
let walletAddress, web3, provider, web3Modal;

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
		connectBtn.innerText =
			walletAddress[0].substr(0, 6) +
			"..." +
			walletAddress[0].substr(walletAddress[0].length - 4);
		label.innerText = "";
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
