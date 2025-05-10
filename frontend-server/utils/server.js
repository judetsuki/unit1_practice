import express from 'express';

const app = express();
app.use(express.json());

const FLASK_API = process.env.FLASK_API || 'https://task-tracker-daniel.loca.lt';

// POST task → forward to Flask
app.post('/tasks', async (req, res) => {
  try {
    const response = await fetch(FLASK_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ error: 'Unable to save task via Flask' });
  }
});

// GET tasks → fetch from Flask
app.get('/tasks', async (req, res) => {
  try {
    const response = await fetch(FLASK_API);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: 'Unable to fetch tasks from Flask' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const response = await fetch(`${FLASK_API}/${req.params.id}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: 'Unable to fetch task from Flask' });
  }
})

app.delete('/tasks/:id', async (req, res) => {
  try {
    const response = await fetch(`${FLASK_API}/${req.params.id}`, {
      method: 'DELETE'
    });
    res.status(response.status);
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Unable to delete task via Flask' });
  }
})

app.put('/tasks/:id', async (req, res) => {
  try {
    const response = await fetch(`${FLASK_API}/${req.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    res.status(response.status);
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Unable to update task via Flask' });
  }
})


app.listen(3000, () => {
  console.log('FREAKY Express listening at http://localhost:3000');
});