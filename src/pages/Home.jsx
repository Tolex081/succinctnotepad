import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import pinkImage from '../assets/pink.png'; // Import team images
import blueImage from '../assets/blue.png';
import purpleImage from '../assets/purple.png';
import greenImage from '../assets/green.png';
import orangeImage from '../assets/orange.png';
import './Home.css';

function Home({ team, theme }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  // Map team names to images
  const teamImages = {
    'Pink Team': pinkImage,
    'Blue Team': blueImage,
    'Purple Team': purpleImage,
    'Green Team': greenImage,
    'Orange Team': orangeImage,
  };

  const storageKey = `succinct-notes-${team.name.toLowerCase().replace(' ', '-')}-${theme}`;

  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error(`Error parsing notes from ${storageKey}:`, error);
        setNotes([]);
      }
    }
  }, [storageKey]);

  const saveNotes = (updatedNotes) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error(`Error saving notes to ${storageKey}:`, error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const note = {
      id: editingNote ? editingNote.id : Date.now(),
      title,
      content,
      createdAt: editingNote ? editingNote.createdAt : new Date().toISOString(),
      updatedAt: editingNote ? new Date().toISOString() : undefined,
    };

    let updatedNotes;
    if (editingNote) {
      updatedNotes = notes.map((n) => (n.id === note.id ? note : n));
    } else {
      updatedNotes = [note, ...notes];
    }

    saveNotes(updatedNotes);
    setEditingNote(null);
    setTitle('');
    setContent('');
  };

  const startEditing = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveNotes(updatedNotes);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-content">
          <h2 style={{ color: team.color }}>
            {editingNote ? 'Edit Note' : 'Add New Note'}
          </h2>
          <input
            type="text"
            placeholder="Title (e.g., Succinct Daily Task)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ borderColor: team.color }}
          />
          <textarea
            placeholder="Write your note or task..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            style={{ borderColor: team.color }}
          />
          <button type="submit" style={{ backgroundColor: team.color }}>
            Save
          </button>
        </div>
        <img
          src={teamImages[team.name]}
          alt={`${team.name}`}
          className="team-image"
        />
      </form>

      <div className="note-list">
        {notes.length === 0 && (
          <p className="empty-message">No notes yet. Add one above!</p>
        )}
        {notes.map((note) => (
          <div key={note.id} className="note-card" style={{ borderColor: team.color }}>
            <h2 style={{ color: team.color }}>
              <Link to={`/note/${note.id}`} style={{ color: team.color }}>
                {note.title}
              </Link>
            </h2>
            <p>{note.content}</p>
            <p className="timestamp">
              {note.updatedAt
                ? `Updated: ${new Date(note.updatedAt).toLocaleString()}`
                : `Created: ${new Date(note.createdAt).toLocaleString()}`}
            </p>
            <div className="button-group">
              <button
                className="edit-button"
                onClick={() => startEditing(note)}
                style={{ backgroundColor: team.color }}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => deleteNote(note.id)}
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;