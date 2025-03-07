import { useState, useEffect, use } from "react";
import { v4 as uuidv4 } from "uuid";
import { BiEdit, BiTrash } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  // List of todos
  const [todos, setTodos] = useState([]);
  // set single todo
  const [todo, setTodo] = useState("");
  // options to delete todos
  const [toDelete, setToDelete] = useState("");
  // edit id to edit todo item
  const [editId, setEditId] = useState("");
  // Track Completed Task
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("todos") != null) {
      setTodos(JSON.parse(sessionStorage.getItem("todos")));
      setCompleted(todos.filter((item) => item.isCompleted == true).length);
    }
  }, []);

  useEffect(() => {
    setCompleted(todos.filter((item) => item.isCompleted == true).length);
  }, [todos]);

  /**
   * To add new todo item in the list
   * @param {event} e
   */
  const addTodo = (e) => {
    e.preventDefault();

    if (editId == "") {
      const newTodo = {
        id: uuidv4(),
        title: todo,
        isCompleted: false,
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      sessionStorage.setItem("todos", JSON.stringify(updatedTodos));
    } else {
      const updatedTodos = todos.map((item) => {
        if (item.id == editId) {
          return { ...item, title: todo };
        }
        return item;
      });
      setTodos(updatedTodos);
      sessionStorage.setItem("todos", JSON.stringify(updatedTodos));
      setEditId("");
    }
    setTodo("");
  };

  /**
   * To delete todo item from the list
   * @param {id} todoid
   */
  const deleteTodo = (id) => {
    const updatedTodos = [...todos.filter((item) => item.id != id)];
    setTodos(updatedTodos);
    sessionStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  /**
   * To edit element from the list
   * @param {id} todoid
   */
  const editTodo = (id) => {
    setEditId(id);
    setTodo(todos.filter((item) => item.id == id)[0].title);
  };

  /**
   * Handle Checkbox check event
   */
  const handleChange = (id) => {
    const updatedTodos = todos.map((item) => {
      if (item.id == id) {
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item;
    });

    setCompleted(
      updatedTodos.filter((item) => item.isCompleted == true).length
    );

    setTodos(updatedTodos);
    sessionStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  /**
   * Apply Delete Functionality
   */
  const applyDelete = (e) => {
    e.preventDefault();

    if (toDelete == "all") {
      setTodos([]);
      sessionStorage.setItem("todos", JSON.stringify([]));
    }

    if (toDelete == "selected") {
      const updatedTodos = [
        ...todos.filter((item) => item.isCompleted == false),
      ];
      setTodos(updatedTodos);
      sessionStorage.setItem("todos", JSON.stringify(updatedTodos));
    }

    setToDelete("");
  };

  const percentage = Math.floor((completed / todos.length) * 100);

  return (
    <div className="min-h-screen flex flex-col justify-start pt-5 items-center bg-gray-800">
      <h1 className="text-4xl font-bold text-gray-400 drop-shadow-lg">
        To-Do List
      </h1>
      {/* Status */}
      <div className="mt-3 w-[80vw] md:w-[57vw] flex items-center justify-between">
        <div className="ms-auto h-3 bg-gray-900 w-[80%] md:w-[90%] rounded-2xl flex items-center p-1">
          <div
            style={{ width: `${percentage}%` }}
            className="h-1 bg-green-500 rounded-2xl transition-all duration-500 ease-in-out"
          ></div>
        </div>
        <div className="rounded-full border-4 border-green-500 absolute w-[50px] h-[50px] flex items-center justify-center text-green-500">
          <span>{completed}</span>/<span>{todos.length}</span>
        </div>
      </div>
      {/* Form to add new todo item */}
      <motion.form
        onSubmit={addTodo}
        className="flex mt-5 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="border border-gray-400 p-2 w-[65vw] md:w-[50vw] rounded-md outline-0 focus:ring-2 focus:ring-blue-400 text-white"
          placeholder="Enter your todo"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-sm bg-blue-600 hover:bg-blue-800 text-white uppercase cursor-pointer transition-colors duration-500 ms-2"
        >
          {editId != "" ? "Update" : "Add"}
        </button>
      </motion.form>
      <div className="mt-4">
        {/* For to select to delete items from the list */}
        <motion.form
          onSubmit={applyDelete}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <select
            value={toDelete}
            onChange={(e) => setToDelete(e.target.value)}
            className="border p-2 border-gray-400 rounded-md text-gray-400"
          >
            <option>Choose Option</option>
            <option value="all">Delete All</option>
            <option value="selected">Delete Selected</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-sm bg-blue-600 hover:bg-blue-800 text-white uppercase cursor-pointer transition-colors duration-500 ms-2"
          >
            Apply
          </button>
        </motion.form>

        {/* To-Do List */}
        <div className="w-[90vw] mt-6">
          <AnimatePresence>
            {todos.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-xl flex justify-between items-center shadow-md mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-blue-500"
                    onChange={() => handleChange(item.id)}
                    checked={item.isCompleted}
                  />
                  <span
                    className={`ml-3 text-lg ${
                      item.isCompleted ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
                <div>
                  <button
                    className="p-2 text-lg rounded-md bg-blue-600 hover:bg-blue-700 text-white transition duration-300 ms-2 cursor-pointer"
                    onClick={() => editTodo(item.id)}
                  >
                    <BiEdit />
                  </button>
                  <button
                    className="p-2 text-lg rounded-md bg-red-500 hover:bg-red-600 text-white transition duration-300 ms-2 cursor-pointer"
                    onClick={() => deleteTodo(item.id)}
                  >
                    <BiTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
