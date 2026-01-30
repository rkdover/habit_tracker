import BetterSqlite3 from 'better-sqlite3';

const db = new BetterSqlite3('./habits.db');

// Delete all habits and logs
const deleteHabits = db.prepare('DELETE FROM habits');
const deleteLogs = db.prepare('DELETE FROM logs');

deleteHabits.run();
deleteLogs.run();

console.log('✓ Database reset complete!');
console.log('  All habits removed');
console.log('  All activity logs cleared');
console.log('\nRefresh the habit tracker page to see a clean slate.');

db.close();
