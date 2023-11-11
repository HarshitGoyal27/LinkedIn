// server.js
import express from 'express';
import cors from 'cors';
import { runPuppeteer } from './posts.mjs';

const app = express();
app.use(express.json());
const port = 3000;
// Use CORS middleware
app.use(cors());
app.post('/run-script', async (req, res) => {
  try {
    let {data}=req.body;
    console.log('data',data);
    await runPuppeteer(data);
    res.status(200).send('Puppeteer script executed successfully.');
    console.log('hello');
  } catch (error) {
    console.error('Error running Puppeteer script:', error);
    res.status(500).send('Internal server error.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
