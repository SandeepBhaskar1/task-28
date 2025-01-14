require("dotenv").config();
const express = require('express');
const { connectToMongoDB } = require("./database")

const port = process.env.PORT || 4292;
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(cors({
    origin: "https://todo-list-by-sandeepbhaskar.netlify.app" 
}));


const router = require('./routes');
app.use("/api", router)

async function startServer() {
    await connectToMongoDB();
    app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
    });
}

startServer();