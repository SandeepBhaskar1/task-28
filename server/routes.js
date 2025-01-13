const express = require('express');
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("todosdb").collection("todos");
    return collection;
}

// Get Todos
router.get("/todos", async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
})

// Post Todos
router.post("/todos", async (req, res) => {
    const collection = getCollection();
    let { todo } = req.body;

    if (!todo) {
        return res.status(400).json({ Message: "Error, No todo found" })
    }
    todo = (typeof todo === "string") ? todo : JSON.stringify(todo)

    const newTodo = await collection.insertOne({ todo: todo, status: false });
    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
})

// Delete Todos /:id
router.delete("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const deletedTodo = await collection.deleteOne({ _id });
    res.status(200).json({ deletedTodo });
})

//  Edit Todos /:id
router.put("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const { todo, status } = req.body;

    const updateFields = {};
    if (todo) updateFields.todo = todo;
    if (typeof status !== "undefined") updateFields.status = status;

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ Message: "No updates provided" });
    }

    const updatedTodo = await collection.updateOne(
        { _id },
        { $set: updateFields }
    );

    if (updatedTodo.modifiedCount === 0) {
        return res.status(404).json({ Message: "Todo not updated" });
    }

    res.status(200).json({ acknowledged: true });
});

module.exports = router;