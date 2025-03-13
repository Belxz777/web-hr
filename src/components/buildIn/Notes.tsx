"use client"

import { useEffect, useState } from "react"

export const Notes = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState("")

    useEffect(() => {
        const savedNotes = localStorage.getItem("notes")
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes))
        }
    }, [])

    const handleAddNote = () => {
        if (!newNote.trim()) return

        const updatedNotes = [...notes, { id: Date.now(), text: newNote.trim() }]
        setNotes(updatedNotes)
        localStorage.setItem("notes", JSON.stringify(updatedNotes))
        setNewNote("")
    }

    const handleDeleteNote = (id) => {
        const updatedNotes = notes.filter((note) => note.id !== id)
        setNotes(updatedNotes)
        localStorage.setItem("notes", JSON.stringify(updatedNotes))
    }

    return (
        <div className="relative w-full max-w-sm mx-auto rounded-xl border border-red-200 shadow-sm m-4 mt-6">
            <div className="px-4 py-3  rounded-t-xl">
                <h2 className="font-medium text-white-800">Замерки</h2>
            </div>

            <ul className="max-h-80 overflow-y-auto px-4 py-2 ">
                {notes.length === 0 ? (
                    <li className="text-gray-400 text-sm text-center py-4">Еще нет заметок</li>
                ) : (
                    notes.map((note) => (
                        <li key={note.id} className="flex items-center justify-between gap-2 py-2">
                            <input
                                readOnly
                                value={note.text}
                                className="flex-grow p-2 text-sm text-gray-700 border border-red-200 rounded-lg focus:outline-none focus:ring focus:ring-red-200"
                            />
                            <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="text-sm text-white bg-red-600 px-3 py-1 rounded-lg hover:bg-red-500 transition-colors"
                                aria-label="Delete note"
                            >
                                Удалить
                            </button>
                        </li>
                    ))
                )}
            </ul>

            <div className="flex gap-2 p-4  rounded-b-xl">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Добавить новую заметку"
                    className="flex-grow p-2 text-sm border border-red-200 rounded-lg text-gray-800 focus:outline-none focus:ring focus:ring-red-300 placeholder-red-300"
                />
                <button
                    onClick={handleAddNote}
                    className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
                >
                    Добавить
                </button>
            </div>
        </div>
    )
}

