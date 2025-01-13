require("dotenv").config();
const express = require('express');
const { connectToMongoDB } = require("./database")

const port = process.env.PORT || 4292;
const app = express();
app.use(express.json());

const router = require('./routes');
app.use("/api", router)

async function startServer() {
    await connectToMongoDB();
    app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
    });
}

startServer();