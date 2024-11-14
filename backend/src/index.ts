import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setupRoutes } from './routes';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

setupRoutes(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
