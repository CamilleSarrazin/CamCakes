import express from 'express';
import { getInstagramFeed } from './instagram.mjs';

const app = express();
const port = 3000;
app.use(express.static('public'));

app.get('/insta', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(await getInstagramFeed());
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

