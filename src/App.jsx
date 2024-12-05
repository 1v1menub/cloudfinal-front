import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance'; 
import './App.css';

function App() {
  const [lastNumber, setLastNumber] = useState(null);
  const [totalSum, setTotalSum] = useState(null);
  const [totalNumbers, setTotalNumbers] = useState(null);
  const [inputNumber, setInputNumber] = useState('');

  const [throttleInput, setThrottleInput] = useState('');
  const [throttleResult, setThrottleResult] = useState(null);

  const [serverError, setServerError] = useState(false);

  const fetchLastNumber = () => {
    axiosInstance.get('/last-number')
      .then(response => {
        setLastNumber(response.data.number);
        setTotalSum(response.data.total_sum);
        setServerError(false);
      })
      .catch(error => {
        console.error('Error fetching last number:', error);
        setServerError(true);
      });
  };

  const fetchTotalNumbers = () => {
    axiosInstance.get('/total-numbers')
      .then(response => {
        setTotalNumbers(response.data.totalNumbers);
        setServerError(false);
      })
      .catch(error => {
        console.error('Error fetching total numbers:', error);
        setServerError(true);
      });
  };

  const handleAddNumber = () => {
    const number = parseInt(inputNumber, 10);
    if (isNaN(number)) {
      alert('Please enter a valid whole number');
      return;
    }

    axiosInstance.post('/add-number', { number })
      .then(() => {
        fetchLastNumber();
        fetchTotalNumbers();
        setInputNumber('');
        setServerError(false); 
      })
      .catch(error => {
        console.error('Error adding number:', error);
        setServerError(true);
        alert('Failed to add the number. Please try again.');
      });
  };

  const handleThrottleTask = () => {
    const number = parseInt(throttleInput, 10);
    if (isNaN(number) || number <= 0) {
      alert('Please enter a positive number for the throttle task');
      return;
    }

    axiosInstance.post('/compute-heavy-task', { number })
      .then(response => {
        setThrottleResult(response.data);
        setThrottleInput('');
        setServerError(false); 
      })
      .catch(error => {
        console.error('Error executing throttle task:', error);
        setServerError(true); 
        alert('Failed to execute the throttle task. Please try again.');
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTotalNumbers();
      fetchLastNumber();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h2>Number Game</h2>

      {serverError && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          Server is having issues. Please try again later.
        </p>
      )}

      <div className="number-display">
        <h1>{lastNumber !== null ? lastNumber : 'Loading...'}</h1>
        <p>Total Sum: {totalSum !== null ? totalSum : 'Loading...'}</p>
        <p>Total Numbers: {totalNumbers !== null ? totalNumbers : 'Loading...'}</p>
      </div>

      <div className="number-input">
        <input
          type="number"
          value={inputNumber}
          onChange={(e) => setInputNumber(e.target.value)}
          placeholder="Enter a whole number"
        />
        <button onClick={handleAddNumber}>Submit Number</button>
      </div>

      <div className="throttle-input">
        <input
          type="number"
          value={throttleInput}
          onChange={(e) => setThrottleInput(e.target.value)}
          placeholder="Enter a number for throttle task"
        />
        <button onClick={handleThrottleTask}>Run Throttle Task</button>
      </div>

      {throttleResult && (
        <div className="throttle-result">
          <h3>Throttle Task Result</h3>
          <p>Input: {throttleResult.input}</p>
          <p>Computed Result: {throttleResult.computedResult}</p>
          <p>Message: {throttleResult.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
