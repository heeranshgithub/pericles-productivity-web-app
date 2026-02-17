export const KICKBOXING_HTML = `<!DOCTYPE html>
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

    .badge-mastered { color: #059669; border-color: #a7f3d0; background: #ecfdf5; }
    .badge-learning { color: #d97706; border-color: #fde68a; background: #fffbeb; }
    .badge-drilling { color: #0d9488; border-color: #99f6e4; background: #f0fdfa; }

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
  <h1>Kickboxing Training Session</h1>
  <p class="subtitle">Generated on February 16, 2026 — Pericles Combat</p>

  <div class="stats-grid">
    <div class="stat-card">
      <p class="stat-label">Total Punches</p>
      <p class="stat-value">1,248</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Calories Burned</p>
      <p class="stat-value">642 kcal</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Active Time</p>
      <p class="stat-value">1h 15m</p>
    </div>
  </div>

  <h2>Combinations Practiced</h2>
  <table>
    <thead>
      <tr>
        <th>Combination</th>
        <th>Reps</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Jab - Cross - Left Hook - Low Kick</td>
        <td>50</td>
        <td><span class="badge badge-mastered">Mastered</span></td>
      </tr>
      <tr>
        <td>Double Jab - Right Cross - Left Upper</td>
        <td>40</td>
        <td><span class="badge badge-drilling">Drilling</span></td>
      </tr>
      <tr>
        <td>Check - Left Hook - Right Cross</td>
        <td>30</td>
        <td><span class="badge badge-learning">Learning</span></td>
      </tr>
      <tr>
        <td>Teep - Step In - Elbow - Knee</td>
        <td>25</td>
        <td><span class="badge badge-drilling">Drilling</span></td>
      </tr>
      <tr>
        <td>Slip - Right Uppercut - Left Hook</td>
        <td>45</td>
        <td><span class="badge badge-mastered">Mastered</span></td>
      </tr>
    </tbody>
  </table>

  <h2>Sparring Rounds</h2>
  <table>
    <thead>
      <tr>
        <th>Round</th>
        <th>Duration</th>
        <th>Intensity</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Round 1 (Technical)</td>
        <td>3m 00s</td>
        <td>Moderate</td>
      </tr>
      <tr>
        <td>Round 2 (Hard Spar)</td>
        <td>3m 00s</td>
        <td>High</td>
      </tr>
      <tr>
        <td>Round 3 (Clinch Work)</td>
        <td>3m 00s</td>
        <td>High</td>
      </tr>
    </tbody>
  </table>

  <p class="footer">Pericles — Combat Sports Performance Tracker</p>
</body>
</html>\`;`;
