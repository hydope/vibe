const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('<h1>Hello from Vibe 👋</h1><p>Detected, installed and served with zero config.</p>');
});

app.listen(port, () => console.log(`hello-express listening on ${port}`));
