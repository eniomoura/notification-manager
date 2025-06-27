import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import routes from './routes/index';

dotenv.config();
const app = express();
const PORT = process.env.PORT ?? 8000;
const corsOptions = {
  origin: 'http://localhost:80',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
