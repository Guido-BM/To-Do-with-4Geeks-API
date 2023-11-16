import React, { useState, useEffect } from "react";
import "./App.css";

const BASE_URL = "https://playground.4geeks.com/apis/fake/todos/user/";

const styles = {
  listContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: "0 auto",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  button: {
    marginLeft: "20px",
  },
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("Guidoncio");

  const getAllUsers = async () => {
    setLoading(true);
    const response = await fetch(`${BASE_URL}`);
    const data = await response.json();
    setUsers(data);
    setLoading(false);
  };
  const deleteUser = async (usernameToDelete) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${usernameToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await getAllUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTodos = () => {
    setLoading(true);
    fetch(`${BASE_URL}${username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTodos(data);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching todos:", error))
      .finally(() => setLoading(false));
  };

  const createUser = async () => {
    setLoading(true);
    const response = await fetch(`${BASE_URL}${username}`, {
      method: "POST",
      body: JSON.stringify([]),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    getTodos();
    setUsername("");
    setLoading(false);
  };

  const deleteTodo = async (id) => {
    console.log("Deleting todo with id:", id);
    setLoading(true);
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    console.log("Updated todos:", updatedTodos);
    const response = await fetch(`${BASE_URL}${username}`, {
      method: "PUT",
      body: JSON.stringify(updatedTodos),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setTodos(updatedTodos);
    setLoading(false);
  };

  const addTodo = async () => {
    setLoading(true);
    const updatedTodos = [...todos, { label: todo, done: false }];
    const response = await fetch(`${BASE_URL}${username}`, {
      method: "PUT",
      body: JSON.stringify(updatedTodos),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setTodo("");
    getTodos();
    setLoading(false);
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={styles.listContainer}>
          <h1>Todo List</h1>{" "}
          <form>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="on"
            />
          </form>
          <button onClick={getTodos}>Get Todos</button>
          <button onClick={createUser}>Create User</button>
          <ul style={{ width: "100%" }}>
            {Array.isArray(todos) &&
              todos.map((todo, index) => (
                <li key={`${todo.id}-${index}`} style={styles.listItem}>
                  <div>{todo.label}</div>
                  <div>
                    <button
                      style={styles.button}
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
      <input
        type="text"
        id="todo"
        name="todo"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        placeholder="New todo"
      />
      <button onClick={addTodo}>Add Todo</button>
      <h1>Users registered in the API</h1>

      <button onClick={getAllUsers}>Get All Users</button>
      <div style={styles.listContainer}>
        <ul id="users-list" style={{ width: "100%" }}>
          {users.map((user, index) => (
            <li key={index} style={styles.listItem}>
              <div>{user}</div>
              <div>
                <button style={styles.button} onClick={() => deleteUser(user)}>
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
