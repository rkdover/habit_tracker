import express from 'express';
import cors from 'cors';
import { Database } from './db.js';
import { HabitRoutes } from './routes.js';
import { CSVLogger } from './logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new Database();
const logger = new CSVLogger();
const habitRoutes = new HabitRoutes(db, logger);

// API Routes
app.get('/api/habits', (req, res) => habitRoutes.getAllHabits(req, res));
app.post('/api/habits', (req, res) => habitRoutes.createHabit(req, res));
app.put('/api/habits/:id', (req, res) => habitRoutes.updateHabit(req, res));
app.post('/api/habits/:id/complete', (req, res) => habitRoutes.completeHabit(req, res));
app.post('/api/habits/:id/archive', (req, res) => habitRoutes.archiveHabit(req, res));
app.post('/api/habits/:id/restore', (req, res) => habitRoutes.restoreHabit(req, res));
app.delete('/api/habits/:id', (req, res) => habitRoutes.deleteHabit(req, res));

app.listen(PORT, () => {
  console.log(`Habit Tracker server running at http://localhost:${PORT}`);
});
