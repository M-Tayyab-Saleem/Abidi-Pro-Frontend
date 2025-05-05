import React, { useState, useRef, useEffect } from "react";
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";

const NotesCard = ({ onDelete }) => {
  const [notes, setNotes] = useState([
    { id: 1, text: "Buy milk and snacks." },
    { id: 2, text: "Schedule 1:1 with manager." },
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), text: newNote.trim() }]);
      setNewNote("");
    }
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    setEditingText(note.text);
  };

  const saveEdit = (id) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, text: editingText } : n)));
    setEditingId(null);
    setEditingText("");
  };

  const removeNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md p-5 pt-10 w-full">
      {/* Floating Icon */}
      <div className="absolute -top-4 left-4 bg-yellow-100 text-yellow-700 w-10 h-10 flex items-center justify-center rounded-md shadow z-10">
        📝
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold">Notes</h2>
          <p className="text-sm text-gray-500">Write and edit personal notes</p>
        </div>

        {/* Custom Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md border rounded-md z-50">
              <button
                onClick={() => {
                  onDelete();
                  setMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Input */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          className="flex-1 border px-3 py-2 rounded text-sm"
          placeholder="Write a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
        />
        <button
  onClick={addNote}
  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition"
>
  Add
</button>
      </div>

      {/* Notes List */}
      <ul className="space-y-3 text-sm">
        {notes.map((note) => (
          <li
            key={note.id}
            className="bg-gray-100 p-3 rounded flex justify-between items-start gap-3"
          >
            <div className="flex-1">
              {editingId === note.id ? (
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={editingText}
                  autoFocus
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => saveEdit(note.id)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(note.id)}
                />
              ) : (
                <p
                  className="text-gray-800 cursor-pointer"
                  onClick={() => startEditing(note)}
                >
                  {note.text}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 items-end">
              {editingId !== note.id ? (
                <button
                  onClick={() => startEditing(note)}
                  className="text-green-600 hover:text-green-800"
                  title="Edit"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => saveEdit(note.id)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Save"
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => removeNote(note.id)}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesCard;
