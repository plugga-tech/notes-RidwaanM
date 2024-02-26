import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: 'exampleUser',
        password: 'examplePassword'
      });
      setToken(response.data.token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <button onClick={handleLogin}>Login</button>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/">
            <Home token={token} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home({ token }) {
  if (!token) {
    return <p>Please log in to access the documents</p>;
  }

  return (
    <div>
      <h2>Document List</h2>
      {/* Implementera dokumentlista och CRUD-operationer här */}
    </div>
  );
}


function Home({ token }) {
    const [documents, setDocuments] = useState([]);
    const [newDocument, setNewDocument] = useState('');
  
    useEffect(() => {
      if (!token) return;
  
      const fetchDocuments = async () => {
        try {
          const response = await axios.get('http://localhost:5000/documents', {
            headers: { Authorization: token }
          });
          setDocuments(response.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchDocuments();
    }, [token]);
  
    const handleCreateDocument = async () => {
      try {
        await axios.post('http://localhost:5000/documents', { content: newDocument }, {
          headers: { Authorization: token }
        });
        setNewDocument('');
        fetchDocuments();
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleDeleteDocument = async (documentId) => {
      try {
        await axios.delete(`http://localhost:5000/documents/${documentId}`, {
          headers: { Authorization: token }
        });
        fetchDocuments();
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div>
        <h2>Document List</h2>
        <ul>
          {documents.map(document => (
            <li key={document.id}>
              {document.content}{' '}
              <button onClick={() => handleDeleteDocument(document.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <input type="text" value={newDocument} onChange={(e) => setNewDocument(e.target.value)} />
        <button onClick={handleCreateDocument}>Create Document</button>
      </div>
    );
  }
  
  export default App;
  
