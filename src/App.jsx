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

// Helper to pick 10 random tasks (one from each unique example)
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
  
  // Shuffle the 5 selected tasks
  return shuffle(selectedTasks).slice(0, 5);
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
          <p>In this study, you will be presented with a Question and an Answer.</p>
          <br/>
          <p>You will also see three sentences that serve as context. Your task is to rate how much each sentence <b>contributes</b> to deducing the Answer.</p>
          <br/>
          <p>There are {studyTasks.length} short tasks. Thank you for your help!</p>
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
