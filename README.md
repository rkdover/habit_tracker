# Habit Tracker

A simple full-stack web application for tracking daily habits with visual feedback and detailed logging.

## Features

- **Add Habits**: Create new habits with custom recurrence (in days)
- **Recurring vs Single Tasks**: 
  - Recurring habits reset after completion
  - Single tasks are archived when completed
- **Visual Feedback**: 
  - Red buttons = habit is due
  - Green buttons = habit is done
  - Progress bar shows time until next due
- **Editable Habits**: Double-click to edit habit name and recurrence
- **Archive System**: Completed single tasks automatically go to archive
- **Activity Logging**: All changes logged to CSV file (name edits, completions, etc.)
- **Persistent Storage**: SQLite database stores all habit data

## Tech Stack

- **Frontend**: Vue.js 3 (CDN version)
- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Logging**: CSV file

## Setup & Running

1. Install Node.js if not already installed
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## How It Works

### Habit Types
- **Recurring Habits**: Resets after you complete it, based on your recurrence interval
- **One-time Tasks**: Gets archived after completion

### Progress Bar
Shows the time elapsed since last completion as a percentage of the recurrence interval:
- 0% = just completed
- 100% = due for completion

### Editing Habits
Double-click any habit to edit:
- Change the name
- Change the recurrence period

### Archiving
- Single tasks automatically archive when marked complete
- View archived tasks in the "Archived" tab
- Delete archived tasks permanently

## Activity Log

All changes are logged to `logs.csv` including:
- Habit creation
- Completion times
- Name and recurrence edits
- Archival events
- Deletions

## API Endpoints

- `GET /api/habits?archived=false` - Get active habits
- `GET /api/habits?archived=true` - Get archived habits
- `POST /api/habits` - Create a new habit
- `PUT /api/habits/:id` - Edit habit name/recurrence
- `POST /api/habits/:id/complete` - Mark habit as completed
- `DELETE /api/habits/:id` - Delete a habit
