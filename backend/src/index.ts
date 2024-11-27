import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setupRoutes } from './routes';
import sequelize from './config/db';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Tables synchronized successfully!');
  })
  .catch((error) => {
    console.error('Error synchronizing tables:', error);
  });

setupRoutes(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
