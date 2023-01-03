const buyBtn = document.getElementById("buy-btn");
const swapBtn = document.getElementById("swap");
const amountInput = document.getElementById("amount-input");
const maxAmount = document.getElementById("max-amount");
const addInput = document.getElementById("address-link");
const getLinkBtn = document.getElementById("get-link");
const copyLinkBtn = document.getElementById("copy-link");
const link = document.getElementById("link");
const uGet = document.getElementById("u-get");
const enableBusdBtn = document.getElementById("enable-busd");
const modalBusdAmount = document.getElementById("modal-busd-amount");
const modalSiFiAmount = document.getElementById("modal-sifi-amount");
const modalTxLink = document.getElementById("modal-tx-link");
const referrer = document.getElementById("referrer");
let referralAddress;
let generatedReferralLink;

const CURRENT_SIFI_PRICE = 0.02;

$(".inv-button").hide();
connectBtn.addEventListener("click", () => connect());
maxAmount.addEventListener("click", async () => {
    amountInput.value = Number(busdBalance / 10 ** 18).toFixed(3);
});
window.addEventListener("load", () => {
    setReferralAddress();

    // const privateSaleContract = new web3.eth.Contract(
    // 	TOKEN_ABI,
    // 	PRIVATE_SALE_ADDRESS
    // );
    // const apple = privateSaleContract.events.Bought((err, data) => {
    // 	console.log("error", err);
    // 	console.log("data", data);
    // });
    // privateSaleContract
    // 	.getPastEvents("Bought")
    // 	.then((events) => console.log("events", events));
    // privateSaleContract.once("Bought", (error, event) => {
    // 	console.log(error);
    // 	console.log(event);
    // 	if (!error) console.log(event);
    // });
});
enableBusdBtn.addEventListener("click", () => enableBusd());
swapBtn.addEventListener("click", () => swap());
amountInput.addEventListener("input", () => {
    console.log("amount");
    $(".buy-now").hide();
    uGet.innerText = Number(amountInput.value / CURRENT_SIFI_PRICE).toFixed(3);
    $(".inv-button").show();
});
getLinkBtn.addEventListener("click", () => {
    if (walletAddress.length <= 0 && addInput.value == "") {
        console.log("true");
        return alert("Please Enter Wallet Address or Connect with metamask");
    }
    if (addInput.value == "") {
        console.log("false");
        generatedReferralLink = `https://sifi.finance/referral?start=${walletAddress[0]}`;
        // link.innerText = generatedReferralLink.slice(0, 42) + "...";
        link.innerHTML = generatedReferralLink;
        return;
    }
    console.log("apple");
    generatedReferralLink = `https://sifi.finance/referral?start=${addInput.value}`;
    // link.innerText = generatedReferralLink.slice(0, 42) + "...";
    link.innerHTML = generatedReferralLink;
});
copyLinkBtn.addEventListener("click", () => copyTextToClipboard(generatedReferralLink));

async function enableBusd() {
    const amount = amountInput.value;
    if (amount == "") return alert("Please enter amount ");
    if (amount > 6250) return alert("Please enter amount less than 6250");
    if (walletAddress.length < 1) return alert("Please connect to your wallet");
    try {
        $("#enable-busd").addClass("loader");
        const res = await busdContract.methods.approve(getPrivateSaleToken(chainId), web3.utils.toWei(amount, "ether")).send({ from: walletAddress[0] });
    } catch (e) {
        alert(e);
    }

    enableBusdBtn.classList.remove("loader");
    // enableBusdBtn.classList.add("bg-white");
    swapBtn.classList.remove("bg-white");
    // enableBusdBtn.classList.add("btn-outline-primary");
    // enableBusdBtn.classList.remove("btn-primary");
    // swapBtn.classList.remove("btn-outline-primary");
    // swapBtn.classList.add("btn-primary");
    swapBtn.disabled = false;
}
async function swap(provider) {
    modalBusdAmount.innerText = amountInput.value;
    modalSiFiAmount.innerText = amountInput.value / CURRENT_SIFI_PRICE;
    swapBtn.classList.add("loader");
    if (walletAddress.length < 1) return alert("Please connect to your wallet");
    const privateSaleContract = new web3.eth.Contract(getPrivateSaleABI(chainId), getPrivateSaleToken(chainId));
    try {
        const res = await privateSaleContract.methods
            .buy(referralAddress || REFERRAL_ADDRESS, web3.utils.toWei(amountInput.value, "ether"))
            .send({
                from: walletAddress[0],
            })
            .on("transactionHash", function (hash) {
                modalTxLink.href = `https://bscscan.com/tx/${hash}`;
            });
        $("#success").modal("show");
        swapBtn.classList.remove("loader");
    } catch (e) {
        swapBtn.classList.remove("loader");
        alert(e);
    }

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
function redirectToBsc() {
    window.open("https://www.bscscan.com/address/0xC2dB8c59ce4042C970B8C48e273E97C2b49A7D69", "_blank");
}
function setReferralAddress() {
    const queryString = window.location.search;
    const parameters = new URLSearchParams(queryString);
    if (parameters.get("start")) {
        referralAddress = parameters.get("start");
        referrer.innerText = "Your Referrer : " + referralAddress;
        return;
    }
    referrer.innerText = "Your Referrer : None";
    // $("#referrer-address").html(referralAddress);
}

function fallbackCopyTextToClipboard(text) {
    var input = document.createElement("input");
    input.value = text;
    // Avoid scrolling to bottom
    // textArea.style.top = "0";
    // textArea.style.left = "0";
    // textArea.style.position = "fixed";

    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999);

    input.focus();
    input.select();

    try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(input);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(
        function () {
            console.log("Async: Copying to clipboard was successful!");
        },
        function (err) {
            console.error("Async: Could not copy text: ", err);
        }
    );
}
