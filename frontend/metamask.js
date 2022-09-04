import { TOKEN_ABI, TOKEN_ADDRESS } from "./contract";
const buyBtn = document.getElementById("buy-btn");
const swapBtn = document.getElementById("swap");
const amountInput = document.getElementById("amount-input");
const addInput = document.getElementById("address-link");
const getLinkBtn = document.getElementById("get-link");
const copyLinkBtn = document.getElementById("copy-link");
const link = document.getElementById("link");
const uGet = document.getElementById("u-get");
const enableBusdBtn = document.getElementById("enable-busd");
const modalBusdAmount = document.getElementById("modal-busd-amount");
const modalSiFiAmount = document.getElementById("modal-sifi-amount");
const connectBtn = document.getElementById("connect-btn");

let referralAddress;
let generatedReferralLink;
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
    if (addInput.value == "") {
        generatedReferralLink = `https://sifi.finance/referral?start=${walletAddress[0]}`;
        link.innerHTML = generatedReferralLink;
        return;
    }
    generatedReferralLink = `https://sifi.finance/referral?start=${addInput.value}`;
    link.innerHTML = generatedReferralLink;
});
copyLinkBtn.addEventListener("click", () => copyTextToClipboard(generatedReferralLink));

async function enableBusd() {
    const amount = amountInput.value;
    if (amount == "") return alert("Please enter amount ");
    if (amount > 6250) return alert("Please enter amount less than 6250");
    if (walletAddress.length < 1) return alert("Please connect to your wallet");
    const busdContract = new web3.eth.Contract(BUSD_ABI, BUSD_ADDRESS);
    try {
        const res = await busdContract.methods.approve(TOKEN_ADDRESS, web3.utils.toWei(amount, "ether")).send({ from: walletAddress[0] });
        enableBusdBtn.classList.add("btn-outline-primary");
        enableBusdBtn.classList.remove("btn-primary");
        swapBtn.classList.remove("btn-outline-primary");
        swapBtn.classList.add("btn-primary");
        swapBtn.disabled = false;
    } catch (e) {
        console.log(e);
    }
    //
}
async function swap(provider) {
    modalBusdAmount.innerText = amountInput.value;
    modalSiFiAmount.innerText = amountInput.value / 0.0125;
    const privateSaleContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
    await privateSaleContract.methods.buy(referralAddress || REFERRAL_ADDRESS, web3.utils.toWei(amountInput.value, "ether")).send({
        from: walletAddress[0],
    });
}
function setReferralAddress() {
    const queryString = window.location.search;
    const parameters = new URLSearchParams(queryString);
    if (parameters.get("start")) {
        referralAddress = parameters.get("start");
        console.log("reff", referralAddress);
    }
}

function fallbackCopyTextToClipboard(text) {
    var input = document.createElement("input");
    input.value = text;
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
