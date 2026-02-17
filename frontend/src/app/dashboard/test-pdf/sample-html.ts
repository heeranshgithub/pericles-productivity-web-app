export const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Geist Mono', monospace;
      background: white;
      color: #111;
      padding: 40px;
      line-height: 1.6;
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }

    h2 {
      font-size: 18px;
      font-weight: 600;
      margin-top: 32px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e5e5;
    }

    p { font-size: 14px; margin-bottom: 12px; }

    .subtitle {
      font-size: 13px;
      color: #666;
      margin-bottom: 32px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 16px;
    }

    .stat-label {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #888;
      margin-bottom: 4px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 12px;
    }

    th {
      text-align: left;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #888;
      padding: 8px 12px;
      border-bottom: 1px solid #e5e5e5;
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 9999px;
      border: 1px solid #e5e5e5;
    }

    .badge-done { color: #059669; border-color: #a7f3d0; background: #ecfdf5; }
    .badge-pending { color: #d97706; border-color: #fde68a; background: #fffbeb; }
    .badge-progress { color: #0d9488; border-color: #99f6e4; background: #f0fdfa; }

    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e5e5e5;
      font-size: 11px;
      color: #aaa;
    }
  </style>
</head>
<body>
  <h1>Yogesh Productivity Report</h1>
  <p class="subtitle">Generated on February 16, 2026 — Pericles App</p>

  <div class="stats-grid">
    <div class="stat-card">
      <p class="stat-label">Tasks Completed</p>
      <p class="stat-value">24</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Focus Time</p>
      <p class="stat-value">18h 45m</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Notes Created</p>
      <p class="stat-value">12</p>
    </div>
  </div>

  <h2>Recent Tasks</h2>
  <table>
    <thead>
      <tr>
        <th>Task</th>
        <th>Priority</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Set up CI/CD pipeline</td>
        <td>High</td>
        <td><span class="badge badge-done">Done</span></td>
      </tr>
      <tr>
        <td>Write unit tests for auth module</td>
        <td>Medium</td>
        <td><span class="badge badge-progress">In Progress</span></td>
      </tr>
      <tr>
        <td>Design settings page</td>
        <td>Low</td>
        <td><span class="badge badge-done">Done</span></td>
      </tr>
      <tr>
        <td>Optimize database queries</td>
        <td>High</td>
        <td><span class="badge badge-pending">Pending</span></td>
      </tr>
      <tr>
        <td>Add dark mode toggle</td>
        <td>Medium</td>
        <td><span class="badge badge-done">Done</span></td>
      </tr>
    </tbody>
  </table>

  <h2>Focus Sessions</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Duration</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Feb 15</td>
        <td>2h 30m</td>
        <td>Backend refactoring</td>
      </tr>
      <tr>
        <td>Feb 14</td>
        <td>1h 45m</td>
        <td>Frontend components</td>
      </tr>
      <tr>
        <td>Feb 13</td>
        <td>3h 15m</td>
        <td>API integration</td>
      </tr>
    </tbody>
  </table>

  <p class="footer">Pericles — Personal Productivity Suite</p>
</body>
</html>`;
