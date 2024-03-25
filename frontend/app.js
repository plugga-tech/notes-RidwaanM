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
      {import React, { useState, useEffect } from 'react';
      import axios from 'axios';

function App() {
  const [documents, setDocuments] = useState([]);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [newDocumentContent, setNewDocumentContent] = useState('');

  useEffect(() => {
    fetchDocuments()
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error(error)
    }
  };

  const createDocument = async () => {
    try {
      await axios.post('http://localhost:5000/documents', {
        title: newDocumentTitle,
        content: newDocumentContent
      });
      setNewDocumentTitle('');
      setNewDocumentContent('');
      fetchDocuments();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDocument = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/documents/${id}`);
      fetchDocuments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Document Management System</h1>
      <h2>Create Document</h2>
      <input
        type="text"
        value={newDocumentTitle}
        onChange={(e) => setNewDocumentTitle(e.target.value)}
        placeholder="Enter title"
      />
      <textarea
        value={newDocumentContent}
        onChange={(e) => setNewDocumentContent(e.target.value)}
        placeholder="Enter content"
      ></textarea>
      <button onClick={createDocument}>Create Document</button>

      <h2>Document List</h2>
      <ul>
        {documents.map((document) => (
          <li key={document.id}>
            <div>
              <strong>{document.title}</strong>: {document.content}
              <button onClick={() => deleteDocument(document.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
}
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
  
