export class HabitRoutes {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  getAllHabits(req, res) {
    try {
      const archived = req.query.archived === 'true';
      const habits = this.db.all(
        'SELECT * FROM habits WHERE archived = ?',
        archived ? 1 : 0
      );
      const now = Date.now();
      
      // Calculate status for each habit
      const habitsWithStatus = habits.map(habit => ({
        ...habit,
        isDue: this.isHabitDue(habit, now),
        progress: this.getProgress(habit, now)
      }));
      
      res.json(habitsWithStatus);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  createHabit(req, res) {
    try {
      const { name, recurrence, isRecurring } = req.body;
      const now = Date.now();
      
      const id = this.db.run(
        'INSERT INTO habits (name, recurrence, createdAt, isRecurring) VALUES (?, ?, ?, ?)',
        name, recurrence, now, isRecurring ? 1 : 0
      );
      
      this.logger.logCreate(id, name, recurrence, isRecurring);
      
      res.json({ 
        id, 
        name, 
        recurrence, 
        isRecurring: isRecurring ? 1 : 0,
        lastCompleted: null, 
        createdAt: now, 
        isDue: true,
        archived: 0,
        progress: 0
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  completeHabit(req, res) {
    try {
      const { id } = req.params;
      const now = Date.now();
      
      const habit = this.db.get('SELECT * FROM habits WHERE id = ?', id);
      
      if (habit.isRecurring) {
        this.db.run(
          'UPDATE habits SET lastCompleted = ? WHERE id = ?',
          now, id
        );
        this.logger.logComplete(id, habit.name);
        
        const updated = this.db.get('SELECT * FROM habits WHERE id = ?', id);
        res.json({ ...updated, isDue: false, progress: 0 });
      } else {
        // Single task - archive it
        this.db.run(
          'UPDATE habits SET lastCompleted = ?, archived = 1 WHERE id = ?',
          now, id
        );
        this.logger.logArchive(id, habit.name);
        
        const updated = this.db.get('SELECT * FROM habits WHERE id = ?', id);
        res.json({ ...updated, archived: 1 });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  deleteHabit(req, res) {
    try {
      const { id } = req.params;
      const habit = this.db.get('SELECT * FROM habits WHERE id = ?', id);
      if (!habit) {
        return res.status(404).json({ error: 'Habit not found' });
      }
      this.db.run('DELETE FROM habits WHERE id = ?', id);
      this.logger.logDelete(id, habit.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  updateHabit(req, res) {
    try {
      const { id } = req.params;
      const { name, recurrence } = req.body;
      const habit = this.db.get('SELECT * FROM habits WHERE id = ?', id);

      if (name && name !== habit.name) {
        this.db.run('UPDATE habits SET name = ? WHERE id = ?', name, id);
        this.logger.logEdit(id, habit.name, 'name', habit.name, name);
      }

      if (recurrence && recurrence !== habit.recurrence) {
        this.db.run('UPDATE habits SET recurrence = ? WHERE id = ?', recurrence, id);
        this.logger.logEdit(id, name || habit.name, 'recurrence', habit.recurrence, recurrence);
      }

      const updated = this.db.get('SELECT * FROM habits WHERE id = ?', id);
      const now = Date.now();
      res.json({ ...updated, isDue: this.isHabitDue(updated, now), progress: this.getProgress(updated, now) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  isHabitDue(habit, now) {
    if (!habit.lastCompleted) return true;
    
    const daysSinceLastCompleted = (now - habit.lastCompleted) / (1000 * 60 * 60 * 24);
    return daysSinceLastCompleted >= habit.recurrence;
  }

  archiveHabit(req, res) {
    try {
      const { id } = req.params;
      const habit = this.db.get('SELECT * FROM habits WHERE id = ?', id);
      this.db.run('UPDATE habits SET archived = 1 WHERE id = ?', id);
      this.logger.logArchive(id, habit.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  restoreHabit(req, res) {
    try {
      const { id } = req.params;
      const habit = this.db.get('SELECT * FROM habits WHERE id = ?', id);
      this.db.run('UPDATE habits SET archived = 0 WHERE id = ?', id);
      this.logger.log(id, habit.name, 'RESTORE', '', '');
      const restored = this.db.get('SELECT * FROM habits WHERE id = ?', id);
      const now = Date.now();
      res.json({ ...restored, isDue: this.isHabitDue(restored, now), progress: this.getProgress(restored, now) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  getProgress(habit, now) {
    if (!habit.lastCompleted || !habit.isRecurring) return 0;
    
    const daysSinceLastCompleted = (now - habit.lastCompleted) / (1000 * 60 * 60 * 24);
    const progress = Math.min((daysSinceLastCompleted / habit.recurrence) * 100, 100);
    return Math.round(progress);
  }
}
