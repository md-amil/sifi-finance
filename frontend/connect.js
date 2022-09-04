let Web3Modal = window.Web3Modal.default;
let walletAddress, web3, provider, web3Modal;

export async function connect(connectBtn) {
    web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions: {},
        disableInjectedProvider: false,
    });
    provider = await web3Modal.connectTo("injected");
    web3 = new Web3(provider);
    walletAddress = await web3.eth.getAccounts();
    if (walletAddress.length > 0) {
        const wallet = walletAddress[0].substr(0, 6) + "..." + walletAddress[0].substr(walletAddress[0].length - 4);
        connectBtn.innerText = wallet;
        document.getElementById("connected-label").innerText = "";
        document.getElementById("address-link").placeholder = walletAddress[0];
    }
}
