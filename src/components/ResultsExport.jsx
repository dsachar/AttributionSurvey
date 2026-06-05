import React, { useState, useEffect } from 'react';

const ResultsExport = ({ responses }) => {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const ACCESS_KEY = 'c8a3c326-b8dd-47ad-a8b6-ac2b968812aa';

  useEffect(() => {
    // Automatically submit on component mount
    if (responses.length > 0) {
      submitToWeb3Forms();
    }
  }, []);

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(responses, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "study_results.json");
    dlAnchorElem.click();
  };

  const downloadCSV = () => {
    if (responses.length === 0) return;
    
    // Get headers
    const headers = Object.keys(responses[0]).join(',');
    
    // Get rows
    const rows = responses.map(r => {
      return Object.values(r).map(val => 
        typeof val === 'string' ? `"${val}"` : val
      ).join(',');
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "study_results.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  const submitToWeb3Forms = async () => {
    setStatus('loading');
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: "New context attribution study completion",
          responses_json: JSON.stringify(responses, null, 2)
        })
      });
      
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="export-screen">
      <h1>{status === 'loading' ? 'Submitting...' : status === 'success' ? 'Study Completed! 🎉' : 'Submission Failed'}</h1>
      
      {status === 'loading' && (
        <p style={{marginBottom: "2rem"}}>Please wait while we record your responses...</p>
      )}

      {status === 'success' && (
        <p style={{marginBottom: "2rem"}}>Thank you for your time. Your responses have been successfully recorded!</p>
      )}

      {status === 'error' && (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', textAlign: 'left' }}>
          <p style={{color: '#ef4444', marginBottom: '1rem'}}>
            There was an error saving your responses automatically. Please download your results below and send them to the study coordinator.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn" onClick={downloadCSV} style={{ marginTop: '0', background: 'rgba(255,255,255,0.1)', flex: 1 }}>
              Download CSV
            </button>
            <button className="btn" onClick={downloadJSON} style={{ marginTop: '0', background: 'rgba(255,255,255,0.1)', flex: 1 }}>
              Download JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsExport;
