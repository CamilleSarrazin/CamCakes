import express from 'express';
import path from 'path';
import { getInstagramFeed } from './instagram.mjs';

const app = express();
const port = 3000;
const __dirname = path.resolve();
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/insta', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(await getInstagramFeed());
});

app.get('/apropos', async (req, res) => {
  const options = {
      root: publicPath
  };
  res.sendFile('apropos.html', options);
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

