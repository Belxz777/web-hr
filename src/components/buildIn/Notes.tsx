"use client";

import { useEffect, useState } from "react";

export const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const updatedNotes = [...notes, { id: Date.now(), text: newNote.trim() }];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNewNote("");
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-4 bg-gray-800 rounded-xl p-6 my-6 flex flex-col gap-4 border border-gray-700 ">
        <div>
          <h2 className="text-base font-medium text-gray-100">Заметки</h2>
          <h3 className="text-base font-medium text-gray-600">здесь вы можете написать заметки, которые будут видны только вам</h3>
        </div>

        <ul className="max-h-80 overflow-y-auto space-y-2">
          {notes.length === 0 ? (
            <li className="text-gray-400 text-center py-4 text-sm">
              Еще нет заметок
            </li>
          ) : (
            notes.map((note) => (
              <li
                key={note.id}
                className="flex items-center gap-3 p-2 bg-gray-700 rounded-xl"
              >
                <textarea
                  rows={3}
                  readOnly
                  value={note.text}
                  className="emailInputStyles flex-1 h-auto"
                  style={{ resize: "none" }}
                />
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="createButton"
                  aria-label="Delete note"
                >
                  Удалить
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="flex items-center gap-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Новая заметка..."
            className="emailInputStyles flex-1"
            rows={3}
          />
          <button
            onClick={handleAddNote}
            className="createButton"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};
