import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Todo(props) {
    const { todo, setTodos } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [newEditedContent, setNewEditedContent] = useState(todo.todo);

    // Update todo status
    const updateTodo = async (todoId, todoStatus) => {
        const res = await fetch(`https://task-28.onrender.com/api/todos/${todoId}`, {
            method: "PUT",
            body: JSON.stringify({ status: !todoStatus }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await res.json();
        if (json.acknowledged) {
            setTodos((currentTodos) =>
                currentTodos.map((currentTodo) =>
                    currentTodo._id === todoId
                        ? { ...currentTodo, status: !todoStatus }
                        : currentTodo
                )
            );
        }
    };

    // Delete todo
    const deleteTodo = async (todoId) => {
        const res = await fetch(`https://task-28.onrender.com/api/todos/${todoId}`, {
            method: "DELETE",
        });

        const json = await res.json();

        if (json.deletedTodo && json.deletedTodo.acknowledged) {
            setTodos((currentTodos) =>
                currentTodos.filter((currentTodo) => currentTodo._id !== todoId)
            );
        }
    };

    // Save edited todo
    const saveEditedTodo = async () => {
        if (newEditedContent.trim().length > 0) {
            try {
                const res = await fetch(`https://task-28.onrender.com/api/todos/${todo._id}`, {
                    method: "PUT",
                    body: JSON.stringify({ todo: newEditedContent }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to update todo. Status: ${res.status}`);
                }

                const updatedTodo = await res.json();

                if (updatedTodo.acknowledged) {
                    setTodos((currentTodos) =>
                        currentTodos.map((t) =>
                            t._id === todo._id ? { ...t, todo: newEditedContent } : t
                        )
                    );
                    setIsEditing(false);
                }
            } catch (error) {
                console.error("Error updating todo:", error);
            }
        }
    };

    return (
        <div className="todo">
            {isEditing ? (
                <div className="todo-edit">
                    <input
                        type="text"
                        value={newEditedContent}
                        onChange={(e) => setNewEditedContent(e.target.value)}
                    />
                    <button className="todo__save" onClick={saveEditedTodo}>
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                </div>
            ) : (
                <div
                    className={`todo-text ${todo.status ? "completed" : ""}`}
                    onClick={() => updateTodo(todo._id, todo.status)}
                    style={{ textDecoration: todo.status ? 'line-through' : 'none' }}
                >
                    {todo.todo}
                </div>
            )}

            <div className="todo__actions">
                <button
                    className="todo__edit"
                    onClick={() => {
                        if (!todo.status) {
                            setIsEditing((prevState) => !prevState);
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                    className="todo__status"
                    onClick={() => updateTodo(todo._id, todo.status)}
                >
                    {todo.status ? "✅" : "☐"}
                </button>
                <button
                    className="todo__delete"
                    onClick={() => deleteTodo(todo._id)}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
}
