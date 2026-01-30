import fs from 'fs';
import path from 'path';

export class CSVLogger {
  constructor() {
    this.logFile = './logs.csv';
    this.initLogFile();
  }

  initLogFile() {
    if (!fs.existsSync(this.logFile)) {
      const header = 'timestamp,habitId,habitName,action,previousValue,newValue\n';
      fs.writeFileSync(this.logFile, header);
    }
  }

  log(habitId, habitName, action, previousValue = '', newValue = '') {
    const timestamp = new Date().toISOString();
    const row = `${timestamp},${habitId},"${habitName.replace(/"/g, '""')}",${action},"${String(previousValue).replace(/"/g, '""')}","${String(newValue).replace(/"/g, '""')}"\n`;
    fs.appendFileSync(this.logFile, row);
  }

  logCreate(habitId, habitName, recurrence, isRecurring) {
    this.log(habitId, habitName, 'CREATE', '', `recurrence=${recurrence},recurring=${isRecurring}`);
  }

  logComplete(habitId, habitName) {
    this.log(habitId, habitName, 'COMPLETE', '', new Date().toISOString());
  }

  logEdit(habitId, habitName, field, previousValue, newValue) {
    this.log(habitId, habitName, `EDIT_${field.toUpperCase()}`, previousValue, newValue);
  }

  logArchive(habitId, habitName) {
    this.log(habitId, habitName, 'ARCHIVE', 'false', 'true');
  }

  logDelete(habitId, habitName) {
    this.log(habitId, habitName, 'DELETE', '', '');
  }
}
