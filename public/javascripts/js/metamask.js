const buyBtn = document.getElementById("buy-btn");
const swapBtn = document.getElementById("swap");
const amountInput = document.getElementById("amount-input");
const addInput = document.getElementById("address-link");
const getLinkBtn = document.getElementById("get-link");
const copyLinkBtn = document.getElementById("copy-link");
const link = document.getElementById("link");
const uGet = document.getElementById("u-get");
const label = document.getElementById("connected-label");
const enableBusdBtn = document.getElementById("enable-busd");
let referralAddress;

$(".inv-button").hide();
connectBtn.addEventListener("click", () => connect());
window.addEventListener("load", () => {
	setReferralAddress();
});
enableBusdBtn.addEventListener("click", () => enableBusd());
swapBtn.addEventListener("click", () => swap());
amountInput.addEventListener("input", () => {
	$(".buy-now").hide();
	uGet.innerText = amountInput.value / 0.0125;
	$(".inv-button").show();
});
getLinkBtn.addEventListener("click", () => {
	addInput.value;
	const l = `sifi.finance/referral?start=${addInput.value}`;
	link.innerText = l.slice(0, 42) + "...";
});

async function enableBusd() {
	const amount = amountInput.value;
	if (amount == "") return alert("Please enter amount ");
	if (amount > 6250) return alert("Please enter amount less than 6250");
	if (walletAddress.length < 1) return alert("Please connect to your wallet");
	const busdContract = new web3.eth.Contract(BUSD_ABI, BUSD_ADDRESS);
	console.log(walletAddress[0]);
	console.log(busdContract);
	try {
		const res = await busdContract.methods
			.approve(TOKEN_ADDRESS, amount * 10 ** 8)
			.send({ from: walletAddress[0] });
		enableBusdBtn.disabled = true;
		enableBusdBtn.classList.add("btn-outline-primary");
		swapBtn.classList.remove("btn-outline-primary");
		swapBtn.disabled = false;
	} catch (e) {
		console.log(e);
	}
	//
}
async function swap(provider) {
	const privateSaleContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
	// const targetAddress = "0x0000000000000000000000000000000000000000";
	console.log("buy ref", referralAddress);
	await privateSaleContract.methods
		.buy(referralAddress || REFERRAL_ADDRESS, amountInput.value * 10 ** 8)
		.send({
			from: walletAddress[0],
		});
	// web3.eth.sendTransaction(
	// 	{
	// 		from: walletAddress[0],
	// 		to: "0xdFe8b397CCe34B9F678f7c66Dc1a58bb05AC9407",
	// 		value: web3.utils.toWei(amount, "ether"),
	// 		chainId: 97,
	// 	},
	// 	function (error, result) {
	// 		if (!error) {
	// 			alert("success");
	// 		} else {
	// 			alert(error);
	// 		}
	// 	}
	// );
}
function setReferralAddress() {
	const queryString = window.location.search;
	const parameters = new URLSearchParams(queryString);
	if (parameters.get("start")) {
		referralAddress = parameters.get("start");
		console.log("reff", referralAddress);
	}
	// $("#referrer-address").html(referralAddress);
}
