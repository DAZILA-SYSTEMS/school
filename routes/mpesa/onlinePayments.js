const express = require("express");
const router = express.Router();
const OnlinePayment = require("../../models/OnlinePayment");
const Credential = require("../../models/Credential");
const Invoice = require("../../models/Invoice");
const { Op, fn } = require("sequelize");
const Payment = require("../../models/Payment");

//complete C2B transaction Confirmation
const CompleteConfirmation = (req) => {
	Payment.findOne({
		where: {
			code: {
				[Op.like]: fn("LOWER", req.body.TransID),
			},
		},
	})
		.then((payment) => {
			if (payment) {
				return;
			}
			//get house payment
			Credential.findOne({
				where: {
					studentReg: {
						[Op.like]: fn("LOWER", req.body.BillRefNumber),
					},
					instLinker: req.params.instLinker,
				},
			})
				.then((student) => {
					if (!student) {
						return;
					}

					//create an payment
					Payment.create({
						name: "Online Payment",
						details: `Paybill Payment`,
						amount: req.body.TransAmount,
						code: req.body.TransID,
						mode: "Mpesa-Online",
						credLinker: "Mpesa-Online",
						studentLinker: student.dataValues.linker,
						instLinker: req.params.instLinker,
						live: 1,
						linker: Date.now(),
						trace: Date.now(),
						deleted: 0,
						status: 0,
					})
						.then((payment) => {
							req.io
								.to(req.params.instLinker)
								.emit("message", { ...payment, messageType: "payment" });
						})
						.catch((err) => console.log(`Payment Error : ${err}`));
				})
				.catch((err) => console.log(`Invoice Error : ${err}`));
		})
		.catch((err) => console.log(`House Error : ${err}`));
};

//complete transaction push
const CompletePush = (req, amount, code) => {
	Payment.findOne({
		where: {
			code: {
				[Op.like]: fn("LOWER", req.body.TransID),
			},
		},
	})
		.then((payment) => {
			if (payment) {
				return;
			}
			//create an payment
			Payment.create({
				name: "Online Payment",
				details: `Paybill Payment`,
				amount,
				code,
				mode: "Mpesa-Online",
				credLinker: "Mpesa-Online",
				studentLinker: req.params.studentLinker,
				instLinker: req.params.instLinker,
				live: 1,
				linker: Date.now(),
				trace: Date.now(),
				deleted: 0,
				status: 0,
			})
				.then((payment) => {
					req.io
						.to(req.params.instLinker)
						.emit("message", { ...payment, messageType: "payment" });
				})
				.catch((err) => console.log(`Payment Error : ${err}`));
		})
		.catch((err) => console.log(`Invoice Error : ${err}`));
};

//mpesa validation
router.post("/validate/:instLinker", (req, res) => {
	// Send a success response if the transaction is valid
	const successResponse = {
		ResultCode: 0,
		ResultDesc: "Accepted",
	};
	res.json(successResponse);
});

//mpesa confirmation
router.post("/confirm/:instLinker", (req, res) => {
	const successResponse = {
		ResultCode: 0,
		ResultDesc: "Accepted",
	};
	res.json(successResponse);

	OnlinePayment.findOne({
		where: {
			transId: req.body.TransID,
		},
	})
		.then((onlinePayment) => {
			if (onlinePayment) {
				return;
			}
			OnlinePayment.create({
				transType: req.body.TransactionType,
				transMode: "Mpesa-Online",
				transContact: req.body.MSISDN,
				transId: req.body.TransID,
				transTime: req.body.TransTime,
				transAmount: req.body.TransAmount,
				transSender: `${req.body.FirstName}-${req.body.MiddleName}-${req.body.LastName}`,
				transReceiver: req.body.BusinessShortCode,
				transRef: req.body.BillRefNumber,
				instLinker: req.params.instLinker,
				live: 1,
				linker: Date.now(),
				trace: Date.now(),
				deleted: 0,
				status: 0,
			})
				.then((payment) => {
					req.io.to(req.params.instLinker).emit("message", {
						...payment,
						messageType: "online-payment",
					});
					CompleteConfirmation(req);
				})
				.catch((err) => console.log(`Online Payment ${err}`));
		})
		.catch((err) => console.log(`OnlinePayment check : ${err}`));
});

//mpesa push
router.post(
	"/online/:houseNo/:shortCode/:instLinker/:invoiceLinker",
	(req, res) => {
		const merchantRequestID = req.body.Body.stkCallback.MerchantRequestID;
		const checkoutRequestID = req.body.Body.stkCallback.CheckoutRequestID;
		const resultCode = req.body.Body.stkCallback.ResultCode;
		const resultDesc = req.body.Body.stkCallback.ResultDesc;
		const callbackMetadata = req.body.Body.stkCallback.CallbackMetadata;
		const amount = callbackMetadata.Item[0].Value;
		const mpesaReceiptNumber = callbackMetadata.Item[1].Value;
		const transactionDate = callbackMetadata.Item[2].Value;
		const phoneNumber = callbackMetadata.Item[3].Value;

		OnlinePayment.findOne({
			where: {
				transId: mpesaReceiptNumber,
			},
		})
			.then((onlinePayment) => {
				if (onlinePayment) {
					return;
				}
				OnlinePayment.create({
					transType: resultDesc,
					transMode: "Mpesa-Online",
					transContact: phoneNumber,
					transId: mpesaReceiptNumber,
					transTime: transactionDate,
					transAmount: amount,
					transSender: `${req.body.FirstName}-${req.body.MiddleName}-${req.body.LastName}`,
					transReceiver: req.params.shortCode,
					transRef: req.params.houseNo,
					instLinker: req.params.instLinker,
					live: 1,
					linker: Date.now(),
					trace: Date.now(),
					deleted: 0,
					status: 0,
				})
					.then((payment) => {
						req.io.to(req.params.instLinker).emit("message", {
							...payment,
							messageType: "online-payment",
						});
						CompletePush(req, amount, mpesaReceiptNumber);
					})
					.catch((err) => console.log(`Online Payment ${err}`));
			})
			.catch((err) => console.log(`OnlinePayment check : ${err}`));
	}
);

module.exports = router;
