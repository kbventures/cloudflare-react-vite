import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// │ id │ todo       │ is_completed │ created_at

interface Todo {
  id: number;
  todo: string;
  is_completed: 0 | 1;
  created_at: string;
}

function App() {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const url = "http://localhost:8787/todo";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Get response satus ${response.status}`);
        }
        const json = await response.json();
        const responseData = json.data;
        setTodos(responseData);
      } catch (err) {
        console.log(`An unknown error occured `, err);
      }
    };

    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo }),
      });

      if (!response.ok) {
        throw new Error(`Post response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(`Todo added succesfully: ${json}`);

      setErrorMessage(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        console.log(errorMessage);
      } else {
        console.log("An unknown error occorred");
      }
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Todo App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Enter Todo"
          required
        />
        <button type="submit">Add Todo</button>
      </form>
      <div>
        {todos.length > 0 ? (
          todos.map((e) => {
            return (
              <div key={e.id}>
                <i>
                  {e.id},{e.todo},{e.is_completed}
                </i>
              </div>
            );
          })
        ) : (
          <p>No todo's added yet</p>
        )}
      </div>
      {errorMessage ? <p style={{ color: "red" }}>{errorMessage}</p> : null}
    </>
  );
}

export default App;
