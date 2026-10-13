const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('vibe-demo is running — zero config, zero Dockerfile, zero YAML.');
});

app.listen(port, () => console.log(`vibe-demo listening on ${port}`));
