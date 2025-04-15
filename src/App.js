import React, { useState } from 'react';
import MetricsDashboard from './MetricsDashboard';
import axios from 'axios';

const App = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [content, setContent] = useState('');
  const [resp, setResp] = useState('');
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [showForm, setShowFrom] = useState(true);
  const [totalRequest, setTotalRequest] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response = await axios.post('http://localhost:5000/createNote', {
        title: title,
        content: content
      });
      setResp(response.data.message);
      setTitle('');
      setContent('');

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred, please try again later', err);
      }
    }
    setTotalRequest(totalRequest + 1);
  };

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const handleSearch = async () => {
    try {
      // console.log('searchText', text);
      let response = await axios.get('http://localhost:5000/findNotes', {
        params: {
          searchText: text
        }
      });
      // console.log('search result', response.data);
      const searchedNotes = response.data;
      setNotes(searchedNotes);

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred, please try again later', err);
      }
    }
    setTotalRequest(totalRequest + 1);
  }

  const handleDelete = async (searchTerm) => {
    try {
      const res = await axios.delete('http://localhost:5000/deleteNote', {
        params: { q: searchTerm }
      });

      const data = res.data;

      if (res.status === 200) {
        setNotes(prev =>
          prev.filter(note =>
            !(note.title.includes(searchTerm) || note.content.includes(searchTerm))
          )
        );
      } else {
        console.error(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error deleting note:', err.response?.data || err.message);
    }
    setTotalRequest(totalRequest + 1);
  };

  const getAllNotes = async () => {
    try {
      let response = await axios.get('http://localhost:5000/getAllNotes');
      // console.log('all notes', response.data);
      const searchedNotes = response.data;
      setNotes(searchedNotes);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred, please try again later', err);
      }
    }
    setTotalRequest(totalRequest + 1);
  }

  return (
    <>
    <div>
      <button onClick={()=> setShowFrom(!showForm)} >{!showForm? 'Show': 'Hide'} Form to Add Notes</button>
      <br/>
      {showForm && 
        <form onSubmit={handleSubmit}>
        <h2>ADD NOTE</h2>
          <div>
            <label>Note Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Note Title"
              required
            />
          </div>

          <div>
            <label>Note Content</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter Note Content"
              required
            />
          </div>
          <button type="submit">ADD NOTE</button>
          
          {error && <p style={{ color: 'red' }}>{error}</p> }
          { <p>{resp}</p>}

        </form>
      }

      <h2>Search Notes</h2>
      <input type='text' placeholder='type text to search notes' value={text} onChange={handleChange}  />
      <button onClick={handleSearch} >SEARCH</button>
      
      <br/>
      <br/>
      <button onClick={getAllNotes} >GET ALL NOTES</button>

      <h2>Notes</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>CatFact</th>
          </tr>
        </thead>
        <tbody>
          {notes.length === 0 ? (
            <tr>
              <td colSpan="3">No notes found, please search for notes OR click get all notes button</td>
            </tr>
          ) : (
            notes.map((note, idx) => (
              <tr key={idx}>
                <td>{note.title}</td>
                <td>{note.content}</td>
                <td>{note.catfact}</td>
                <td>
                  <button onClick={() => handleDelete(note.title)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>

    <MetricsDashboard req={totalRequest} />
    </>
  );
};

export default App;
