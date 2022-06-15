var express = require("express");
var router = express.Router();
const Web3 = require("web3");

const PRIVATE_SALE_ABI = [
	{
		inputs: [],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "Bought",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint8",
				name: "version",
				type: "uint8",
			},
		],
		name: "Initialized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		inputs: [],
		name: "BUSD",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_referrer",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
		],
		name: "buy",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_tokenAddress",
				type: "address",
			},
		],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "referralStore",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "tokenAddress",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_transferTo",
				type: "address",
			},
		],
		name: "withdrawBNB",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_tokenAddress",
				type: "address",
			},
			{
				internalType: "address",
				name: "_transferTo",
				type: "address",
			},
		],
		name: "withdrawToken",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
const PRIVATE_SALE_ADDRESS = "0x877a209c9541c244a2c27a3dbda774114260c938";

/* GET home page. */
router.get("/:referral?", function (req, res, next) {
	res.render("index", { referral: req.params.referral });
});

router.get("/api/get-referral", async function (req, res, next) {
	// const userAddress = req.body.token;
	const userAddress = req.query.id;
	if (!userAddress)
		return res.status(401).json({ message: "No user address provided" });
	if (userAddress.length < 42)
		return res
			.status(401)
			.json({ message: "please provide a valid user address" });

	// console.log("add", userAddress);
	const web3 = new Web3("https://bsc-dataseed1.ninicoin.io");
	const privateContract = new web3.eth.Contract(
		PRIVATE_SALE_ABI,
		PRIVATE_SALE_ADDRESS
	);
	const r = await privateContract.methods.referralStore(userAddress).call();
	res.send(r);
});
module.exports = router;
