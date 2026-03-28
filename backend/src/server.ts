import express from 'express';
import cors from 'cors';
import path from 'path';
import type { Request, Response } from 'express';
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
app.use(express.static(path.join(__dirname, '../../' , 'frontend')));

//Frontend Serve
app.get('/', (req: Request, res: Response)=>{
  res.sendFile(path.join(__dirname, '../../', 'frontend', 'index.html'));
});

// Routes
app.use('/api', eventRoutes);
app.use('/api', testRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
