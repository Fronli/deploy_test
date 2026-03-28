import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes';
import testRoutes from './routes/testRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());

// Routes
app.use('/api', eventRoutes);

app.use('/api', testRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
