import BetterSqlite3 from 'better-sqlite3';

const db = new BetterSqlite3('./habits.db');

// Create a test habit that was completed ~23 hours and 59 minutes ago
// This will reach 100% (due) in about 1 minute
const almostDueAgo = Date.now() - (23 * 60 * 60 * 1000 + 59 * 60 * 1000);

const stmt = db.prepare(`
  INSERT INTO habits (name, recurrence, lastCompleted, createdAt, isRecurring, archived)
  VALUES (?, ?, ?, ?, ?, ?)
`);

stmt.run('Push Notification Test', 1, almostDueAgo, Date.now(), 1, 0);

console.log('✓ Test habit created!');
console.log('  Name: "Push Notification Test"');
console.log('  Recurrence: 1 day');
console.log('  Last completed: ~23h 59m ago');
console.log('  Expected progress: ~99.9%');
console.log('\n⏱️ This habit will reach 100% (due) in approximately 1 MINUTE');
console.log('\nTroubleshooting Push Notifications:');
console.log('1. Make sure your browser tab is in the BACKGROUND (switch away from it)');
console.log('2. Check your system notification settings - may need to allow notifications for localhost:3000');
console.log('3. Open browser DevTools (F12) and check the Console for any errors');
console.log('4. Verify "Notification API available, current permission: granted" appears in console');
console.log('5. Try checking your OS notification center directly');
console.log('6. Some browsers only show notifications if the tab was backgrounded BEFORE the notification fires');

db.close();
