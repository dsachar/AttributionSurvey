import React, { useState, useEffect } from 'react';

const shuffle = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const TaskView = ({ task, userId, onNext }) => {
  const [shuffledSentences, setShuffledSentences] = useState([]);
  const [ratings, setRatings] = useState({ s1: null, s2: null, s3: null });
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    // Prepare the sentences with their original IDs so we can track ratings
    const sentences = [
      { id: 's1', text: task.s1 },
      { id: 's2', text: task.s2 },
      { id: 's3', text: task.s3 }
    ];
    setShuffledSentences(shuffle(sentences));
    setStartTime(Date.now());
  }, [task]);

  const handleRate = (sentenceId, val) => {
    setRatings(prev => ({ ...prev, [sentenceId]: val }));
  };

  const isComplete = ratings.s1 !== null && ratings.s2 !== null && ratings.s3 !== null;

  const handleSubmit = () => {
    if (!isComplete) return;
    
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    onNext({
      user_id: userId,
      example_id: task.example_id,
      variant_id: task.variant_id,
      rating_s1: ratings.s1,
      rating_s2: ratings.s2,
      rating_s3: ratings.s3,
      time_taken_seconds: timeTaken
    });
  };

  return (
    <div className="task-view">
      <div className="task-header">
        <div className="qa-box">
          <div style={{fontWeight: 600, color: '#fff', marginBottom: '0.5rem'}}>Q: {task.question}</div>
          <div style={{color: '#a78bfa'}}>A: {task.response}</div>
        </div>
      </div>
      
      <p className="instruction-text">Please read all three context sentences below before providing your ratings.</p>

      <div className="sentences-container">
        {shuffledSentences.map(sentence => (
          <div key={sentence.id} className="sentence-item">
            <div className="sentence-text">
              {sentence.text}
            </div>
            <div className="scale-container">
              {[
                { val: -2, label: 'Strongly Misleading' },
                { val: -1, label: 'Slightly Misleading' },
                { val: 0, label: 'Neutral / Irrelevant' },
                { val: 1, label: 'Helpful Background' },
                { val: 2, label: 'Direct Support' }
              ].map(opt => (
                <button 
                  key={opt.val}
                  className={`scale-btn ${ratings[sentence.id] === opt.val ? 'selected' : ''}`}
                  data-val={opt.val}
                  onClick={() => handleRate(sentence.id, opt.val)}
                >
                  <span>{opt.val > 0 ? `+${opt.val}` : opt.val}</span>
                  <span className="scale-label">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="action-row">
        <button 
          className="btn" 
          onClick={handleSubmit} 
          disabled={!isComplete}
        >
          Next Task
        </button>
      </div>
    </div>
  );
};

export default TaskView;
