require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// Database
const db = require("./config/database");
const http = require("http");

const app = express();

app.use(
	cors({
		origin: "*",
	})
);

const server = http.createServer(app);

const socketIo = require("socket.io");
const SocketJoinRoom = require("./utils/SocketJoinRoom");

//create server for io
const io = socketIo(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

// Test DB
db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch((err) => console.log("Error: " + err));

//json parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//add socket io middleware
app.use((req, res, next) => {
	req.io = io;
	next();
});

// Index route
app.get("/", (req, res) => res.send("school techsystem"));

// auth routes
app.use("/auth", require("./routes/auth"));

// institution routes
app.use("/inst", require("./routes/inst"));

// staff routes
app.use("/staff", require("./routes/staff"));

// structure routes
app.use("/structure", require("./routes/structure"));

// subject routes
app.use("/subject", require("./routes/subject"));

// activity routes
app.use("/activity", require("./routes/activity"));

// grade routes
app.use("/grade", require("./routes/grades"));

// mode routes
app.use("/mode", require("./routes/mode"));

// setting up online pay
app.use("/online-pay", require("./routes/mpesa/online"));

// initiating online pay by students
app.use("/client-pay", require("./routes/mpesa/mpesapay"));

//capturing and verifying online payments
app.use("/verify-pay", require("./routes/mpesa/onlinePayments"));

// student routes
app.use("/student", require("./routes/student"));

// guardian routes
app.use("/guardian", require("./routes/guardian"));

// invoice routes
app.use("/invoice", require("./routes/invoice"));

// payment routes
app.use("/payment", require("./routes/payment"));

// expenses cats
app.use("/expense-categories", require("./routes/expenseCat"));

// expenses
app.use("/expense", require("./routes/expense"));

// exams
app.use("/exam", require("./routes/exam"));

// intervals
app.use("/interval", require("./routes/interval"));

// lessons
app.use("/lesson", require("./routes/lesson"));

// library cats
app.use("/library-categories", require("./routes/libraryCat"));

// books
app.use("/book", require("./routes/book"));

// store categories
app.use("/store-categories", require("./routes/storecat"));

// store items
app.use("/store-items", require("./routes/storeItems"));

// store entries
app.use("/store-entries", require("./routes/storeEntries"));

// payroll categories
app.use("/payroll-categories", require("./routes/payrollcat"));

// payroll items
app.use("/payroll-items", require("./routes/payrollitems"));

// payroll entries
app.use("/payroll-entries", require("./routes/payrollEntry"));

// notification
app.use("/notification", require("./routes/notifications"));

// sms
app.use("/sms", require("./routes/sms"));

// student api
app.use("/client", require("./routes/client"));

// agent api
app.use("/agent", require("./routes/agents"));

// subs
app.use("/sub", require("./routes/subs"));

//paypal
app.use("/api", require("./routes/paypal"));

//jenga api
app.use("/jenga", require("./routes/jenga"));

//manual activations route
app.use("/activation", require("./routes/activation"));

//online mpesa sub pay
app.use("/pay", require("./routes/mpesaSub"));

//manual activations by system admin
app.use("/pro", require("./routes/pro"));

const PORT = process.env.PORT || 5000;

//app.listen(PORT, console.log(`Server started on port ${PORT}`));

io.on("connection", (socket) => {
	socket.on("joinRoom", (data) => {
		console.log(data);
		SocketJoinRoom(data, socket);
	});
});

server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
