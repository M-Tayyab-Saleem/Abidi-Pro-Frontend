import React, { useState, useEffect, useRef } from "react";
import {
  FiTrash2,
  FiPlus,
  FiEdit2,
  FiMoreVertical,
  FiCheckSquare,
} from "react-icons/fi";

const defaultTasks = [
  {
    id: 1,
    title: "UI Designs",
    description: "Explore the designs for UI",
    dueDate: "2024-05-15",
    completed: true,
  },
  {
    id: 2,
    title: "Build a component",
    description: "Create input field and interactions",
    dueDate: "2024-05-20",
    completed: false,
  },
];

const ToDoCard = ({ onDelete }) => {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [editing, setEditing] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    setTasks(defaultTasks);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTask = () => {
    if (newTitle.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTitle.trim(),
          description: newDesc.trim(),
          dueDate: newDueDate || null,
          completed: false,
        },
      ]);
      setNewTitle("");
      setNewDesc("");
      setNewDueDate("");
      setShowAddForm(false);
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleFieldChange = (id, field, value) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleBlur = () => setEditing(null);

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3 w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <FiCheckSquare className="w-3 h-3 text-green-600" />
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">To-Do</h3>
          </div>
          <p className="text-[9px] font-medium text-slate-500 cursor-pointer">
            Enter Your to do list here
          </p>
        </div>

        {/* 3-dot Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-[0.4rem] hover:bg-slate-100 transition"
          >
            <FiMoreVertical className="h-3 w-3 text-slate-600" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-white shadow-md border border-slate-200 rounded-[0.6rem] z-50">
              <button
                onClick={() => {
                  onDelete();
                  setMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-1.5 text-[9px] text-red-500 hover:bg-red-50 font-medium"
              >
                <FiTrash2 className="w-2.5 h-2.5 mr-1.5" />
                Delete Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Form */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-2 text-[9px] text-green-600 hover:text-green-800 flex items-center gap-1 font-medium"
        >
          <FiPlus className="h-2.5 w-2.5" />
          Add Task
        </button>
      ) : (
        <div className="flex flex-col gap-1.5 mb-3">
          <input
            type="text"
            placeholder="Task name"
            className="border border-slate-300 px-2 py-1.5 rounded-[0.6rem] text-[9px] w-full bg-white"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Task description"
            className="border border-slate-300 px-2 py-1.5 rounded-[0.6rem] text-[9px] w-full bg-white"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <input
            type="date"
            className="border border-slate-300 px-2 py-1.5 rounded-[0.6rem] text-[9px] w-full bg-white"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-green-500 text-white px-3 py-1.5 rounded-[0.6rem] text-[9px] font-medium self-end"
          >
            Save Task
          </button>
        </div>
      )}

      {/* Task List */}
      <ul className="space-y-1.5 text-[9px]">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`rounded-[0.6rem] p-2 flex justify-between items-start gap-2 ${
              task.completed ? "bg-emerald-50 border border-emerald-100" : "bg-[#E0E5EA]/30"
            }`}
          >
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                className="mt-0.5 shrink-0"
              />
              <div className="min-w-0">
                {editing === task.id ? (
                  <>
                    <input
                      className="font-semibold bg-white px-1.5 py-1 rounded-[0.4rem] border border-slate-300 w-full text-[9px] mb-1"
                      value={task.title}
                      onChange={(e) =>
                        handleFieldChange(task.id, "title", e.target.value)
                      }
                      onBlur={handleBlur}
                    />
                    <input
                      className="text-[8px] text-slate-600 bg-white px-1.5 py-1 rounded-[0.4rem] border border-slate-300 w-full mb-1"
                      value={task.description}
                      onChange={(e) =>
                        handleFieldChange(task.id, "description", e.target.value)
                      }
                      onBlur={handleBlur}
                    />
                    <input
                      type="date"
                      className="text-[8px] text-slate-600 bg-white px-1.5 py-1 rounded-[0.4rem] border border-slate-300 w-full"
                      value={task.dueDate || ""}
                      onChange={(e) =>
                        handleFieldChange(task.id, "dueDate", e.target.value)
                      }
                      onBlur={handleBlur}
                    />
                  </>
                ) : (
                  <>
                    <div
                      className={`font-semibold cursor-pointer ${
                        task.completed ? "line-through text-slate-500" : "text-slate-700"
                      }`}
                      onClick={() => setEditing(task.id)}
                    >
                      {task.title}
                    </div>
                    <div
                      className="text-[8px] text-slate-600 cursor-pointer"
                      onClick={() => setEditing(task.id)}
                    >
                      {task.description}
                    </div>
                    {task.dueDate && (
                      <div className="text-[8px] text-slate-500 mt-0.5">
                        Due: {task.dueDate}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Edit + Delete Buttons */}
            <div className="flex flex-col gap-1 items-end">
              {!task.completed && (
                <button
                  onClick={() => setEditing(task.id)}
                  className="bg-green-100 text-green-700 p-1 rounded-[0.4rem] hover:bg-green-200"
                  title="Edit"
                >
                  <FiEdit2 className="h-2.5 w-2.5" />
                </button>
              )}
              <button
                onClick={() => removeTask(task.id)}
                className="bg-red-100 text-red-600 p-1 rounded-[0.4rem] hover:bg-red-200"
                title="Delete"
              >
                <FiTrash2 className="h-2.5 w-2.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoCard;