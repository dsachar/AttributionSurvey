# Context Attribution User Study Web Application

This web application is designed to collect human evaluations (ratings) on context sentence attributions. These human ratings serve as ground-truth data to validate, calibrate, and compare various automated LLM context attribution algorithms (such as Shapley Values, Banzhaf, Leave-One-Out, and ContextCite).

---

## 🎯 Goals

1. **Human Ground-Truth Collection**: Quantify how human participants attribute importance/contribution to individual context sentences when determining a specific answer to a question.
2. **Attribution Benchmark**: Provide a benchmark to evaluate LLM context attribution methods.
3. **Robustness Evaluation**: Study the effects of different sentence variations (Adversarial, Syntactic, and Semantic) on both human and machine-generated attributions.

---

## 🛠️ How It Was Created & Technology Stack

The web application was developed as a modern, lightweight SPA (Single Page Application):
- **Core Framework**: React 18
- **Build Tool & Bundler**: Vite (for extremely fast development and optimized production bundles)
- **Styling**: Vanilla CSS, configured with a responsive dark-theme design system featuring clean cards, smooth gradients, and interactive states for rating buttons.
- **Form Submission**: Integration with [Web3Forms API](https://web3forms.com/) for zero-config serverless submission of study responses.
- **Export Formats**: Client-side conversion of responses to CSV and JSON formats to support offline fallbacks if network requests fail.

---

## 🔄 Study Session Workflow

1. **Intro Screen**: Greets the user, explains the task, describes the rating scale, and shows the total number of tasks in the session.
2. **Dynamic Task Generation**:
   - The application reads from the pool of 10 structured examples in `src/data/tasks.json`.
   - Each example contains three variants (Case A/Adversarial, Case B/Syntactic, and Case C/Semantic).
   - The app dynamically selects **7 random unique examples** for each user study session.
   - For each selected example, it picks **one random variant** (Case A, B, or C).
   - The final set of 7 tasks is shuffled.
3. **Interactive Task Screen**:
   - Displays the Question (Q) and the Target Response (A).
   - Displays three context sentences ($S_1$, $S_2$, $S_3$) in a **randomized layout order** to prevent positioning bias.
   - Requires the participant to rate each sentence on a 5-point Likert scale:
     - `+2` : **Strongly Helpful** (Necessary piece of the puzzle to derive the Answer)
     - `+1` : **Slightly Helpful** (Provides helpful context but isn't needed to derive the Answer)
     - ` 0` : **Neutral / Irrelevant** (Has no effect on the answer)
     - `-1` : **Slightly Misleading** (Distracting, but doesn't block the answer)
     - `-2` : **Strongly Misleading** (Contradicts or points to an incorrect answer)
   - Disables the "Next Task" button until all three sentences are rated.
   - Tracks the time spent on each task (in seconds) for analysis.
4. **Results Export Screen**:
   - Automatically posts the aggregated payload (containing ratings, elapsed times, user UUID, and example/variant IDs) to Web3Forms.
   - Displays a success state if the submission is recorded.
   - Shows fallback buttons to download the data directly as **CSV** or **JSON** in case of network errors.

---

## 📁 Directory Structure

```
user_study_app/
├── src/
│   ├── components/
│   │   ├── ResultsExport.jsx  # Handles Web3Forms submission and CSV/JSON export
│   │   └── TaskView.jsx       # Renders a single task, shuffles sentences, manages ratings
│   ├── data/
│   │   └── tasks.json         # Pool of study tasks (10 examples x 3 cases = 30 tasks)
│   ├── App.jsx                # Main entry, manages study state, picks 7 random tasks
│   ├── App.css                # Visual design system (colors, layout, buttons)
│   ├── index.css              # Reset and global typographic rules
│   └── main.jsx               # React DOM render mounting point
├── package.json               # Dependencies and scripts (React, Vite)
├── index.html                 # HTML shell
└── vite.config.js             # Vite configurations
```

---

## 🚀 How to Run the App Locally

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
From the `user_study_app` directory, run:
```bash
npm install
```

### Running in Development Mode
To start the hot-reloading development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
To build the optimized static assets in the `dist/` folder:
```bash
npm run build
```
You can preview the built site using:
```bash
npm run preview
```
