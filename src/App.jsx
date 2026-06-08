import React, { useState, useEffect } from 'react';
import TaskView from './components/TaskView';
import ResultsExport from './components/ResultsExport';
import allTasks from './data/tasks.json';
import './index.css';

// Helper to shuffle array
const shuffle = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Helper to pick 7 random tasks (one from each of 7 unique examples)
const generateStudySet = () => {
  const examplesMap = new Map();
  allTasks.forEach(task => {
    if (!examplesMap.has(task.example_id)) {
      examplesMap.set(task.example_id, []);
    }
    examplesMap.get(task.example_id).push(task);
  });
  
  const selectedTasks = [];
  examplesMap.forEach(variants => {
    // pick 1 random variant
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    selectedTasks.push(randomVariant);
  });
  
  // Shuffle and select 7 tasks
  return shuffle(selectedTasks).slice(0, 7);
};

// Generate UUID for user
const generateUUID = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

function App() {
  const [studyTasks, setStudyTasks] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(-1); // -1 means intro screen, >= 10 means export screen
  const [responses, setResponses] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    setStudyTasks(generateStudySet());
    setUserId(generateUUID());
  }, []);

  const startStudy = () => {
    setCurrentIdx(0);
  };

  const handleTaskSubmit = (taskResponse) => {
    setResponses([...responses, taskResponse]);
    setCurrentIdx(currentIdx + 1);
  };

  const progress = currentIdx >= 0 && currentIdx < studyTasks.length 
    ? ((currentIdx) / studyTasks.length) * 100 
    : (currentIdx >= studyTasks.length ? 100 : 0);

  return (
    <div className="app-container">
      {currentIdx >= 0 && currentIdx < studyTasks.length && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      
      {currentIdx >= 0 && currentIdx < studyTasks.length && (
        <div className="progress-text">Task {currentIdx + 1} of {studyTasks.length}</div>
      )}

      {currentIdx === -1 && (
        <div className="intro-screen">
          <h1>Context Attribution Study</h1>
          <p className="intro-desc">
            Help us evaluate context attribution models by providing human judgments.
          </p>

          <div className="instructions-card">
            <h2>Instructions</h2>
            <ul>
              <li>
                You will be presented with a <strong>Question</strong>, an <strong>Answer</strong>, and exactly three <strong>Sentences</strong> providing context.
              </li>
              <li>
                Your task is to rate how much each individual <strong>Sentence</strong> contributes to deducing the <strong>Answer</strong>.
              </li>
              <li>
                <strong>Read First:</strong> Please read all three <strong>Sentences</strong> carefully before providing individual ratings.
              </li>
              <li>
                <strong>Information Synthesis:</strong> Note that the <strong>Answer</strong> might be derived from combining information across multiple <strong>Sentences</strong>.
              </li>
            </ul>
          </div>

          <div className="scale-guide-card">
            <h2>Rating Scale</h2>
            <div className="scale-guide-grid">
              <div className="scale-guide-row" data-val="2">
                <span className="scale-guide-badge">+2</span>
                <div className="scale-guide-text">
                  <strong>Strongly Helpful</strong>: The Sentence provides crucial, necessary information to deduce the Answer.
                </div>
              </div>
              <div className="scale-guide-row" data-val="1">
                <span className="scale-guide-badge">+1</span>
                <div className="scale-guide-text">
                  <strong>Slightly Helpful</strong>: The Sentence provides useful context or supporting info, but is not strictly necessary.
                </div>
              </div>
              <div className="scale-guide-row" data-val="0">
                <span className="scale-guide-badge">0</span>
                <div className="scale-guide-text">
                  <strong>Neutral / Irrelevant</strong>: The Sentence has no relation to the Answer and does not help or hinder.
                </div>
              </div>
              <div className="scale-guide-row" data-val="-1">
                <span className="scale-guide-badge">-1</span>
                <div className="scale-guide-text">
                  <strong>Slightly Misleading</strong>: The Sentence is distracting, introduces noise, or slightly leads away from the Answer.
                </div>
              </div>
              <div className="scale-guide-row" data-val="-2">
                <span className="scale-guide-badge">-2</span>
                <div className="scale-guide-text">
                  <strong>Strongly Misleading</strong>: The Sentence directly contradicts the Answer or leads to a completely wrong conclusion.
                </div>
              </div>
            </div>
          </div>

          <p className="study-info">
            There are <strong>{studyTasks.length} short tasks</strong> in this study, which should take no more than 10 minutes. Thank you for your participation!
          </p>
          <button className="btn" onClick={startStudy}>Start Study</button>
        </div>
      )}

      {currentIdx >= 0 && currentIdx < studyTasks.length && (
        <TaskView 
          key={currentIdx} // Force remount on new task
          task={studyTasks[currentIdx]} 
          userId={userId}
          onNext={handleTaskSubmit} 
        />
      )}

      {currentIdx >= studyTasks.length && (
        <ResultsExport responses={responses} />
      )}
    </div>
  );
}

export default App;
