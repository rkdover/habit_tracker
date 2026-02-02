# Habit Tracker

A simple full-stack web application for tracking daily habits with visual feedback and detailed logging.

99% vibecoded. Shoutout to demon tech!

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

## Scripts

- **Test Habit**: Quickly add a nearly-due test habit for notification/progress bar testing
  ```bash
  npm run test-habit
  ```
- **Reset Database**: Remove all habits and logs for a clean slate
  ```bash
  npm run reset-db
  ```

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

## Docker Deployment

You can run this app in a containerized environment using Docker. A pre-built image is available from GitHub Container Registry.

### Pull the image from GitHub Container Registry
```bash
docker pull ghcr.io/rkdover/habit_tracker:latest
```

### Run the container (default port 3000)
```bash
docker run -d -p 3000:3000 --name habit_tracker ghcr.io/rkdover/habit_tracker:latest
```

### Run on a custom port (e.g. 8080)
```bash
docker run -d -p 8080:8080 -e PORT=8080 --name habit_tracker ghcr.io/rkdover/habit_tracker:latest
```

### Run with persistent data (recommended)
To keep your database and logs between container runs, mount a local folder (e.g. `./data`) to `/app/data` in the container:
```bash
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data --name habit_tracker ghcr.io/rkdover/habit_tracker:latest
```
- Your SQLite database and logs will be stored in the `data/` folder on your host machine.
- You can change the port and volume path as needed.

> **Note:** Do not mount the entire `/app` directory, only `/app/data` for persistence.

### Building locally (optional)
If you prefer to build the image yourself:
```bash
docker build -t habit_tracker .
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data --name habit_tracker habit_tracker
```
