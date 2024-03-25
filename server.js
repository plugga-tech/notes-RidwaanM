const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Anslut till MySQL-databasen
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'dokumenthanteringssystem'
});

// Endpoint för inloggning
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, 'your_secret_key');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware för att verifiera JWT-token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Skapa användare
app.post('/users', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Hämta alla användare
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Uppdatera användare
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, hashedPassword, id]);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Ta bort användare
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Starta servern
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Endpoint för att hämta alla dokument för en användare
app.get('/documents', verifyToken, async (req, res) => {
    try {
      const userId = req.userId;
      const [rows] = await db.promise().query('SELECT * FROM documents WHERE user_id = ?', [userId]);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Endpoint för att skapa ett nytt dokument
  app.post('/documents', verifyToken, async (req, res) => {
    try {
      const { content } = req.body;
      const userId = req.userId;
      await db.promise().query('INSERT INTO documents (content, user_id) VALUES (?, ?)', [content, userId]);
      res.status(201).json({ message: 'Document created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Endpoint för att uppdatera ett befintligt dokument
  app.put('/documents/:id', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      await db.promise().query('UPDATE documents SET content = ? WHERE id = ?', [content, id]);
      res.json({ message: 'Document updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Endpoint för att ta bort ett dokument
  app.delete('/documents/:id', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      await db.promise().query('DELETE FROM documents WHERE id = ?', [id]);
      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  