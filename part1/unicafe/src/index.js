import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Statistic = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>;

const Statistics = ({ good, neutral, bad }) => {
  let all = good + neutral + bad;
  let average = (good + -bad) / all;
  let positive = good * 100 / all;

  return (
    <>
      <h1>Statistics</h1>
      {all === 0
      ?
        <div>No feedback given</div>
      :
        <>
          <table>
            <tbody>
            <Statistic text='good' value={good} />
            <Statistic text='neutral' value={neutral} />
            <Statistic text='bad' value={bad} />
            <Statistic text='all' value={all} />
            <Statistic text='average' value={average} />
            <Statistic text='positive (%)' value={positive} />
            </tbody>
          </table>
        </>
      }
    </>
  );
};

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
      <h1>Give Feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));