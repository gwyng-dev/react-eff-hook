import { useReducer, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEff, wait } from 'react-eff-hook';

function Timer() {
  const [count, setCount] = useState(0);
  useEff(function*() {
    while (true) {
      yield* wait(new Promise(resolve => setTimeout(resolve, 1000)));
      
      console.log('tick');
      setCount((x) => x + 1);
    }
  }, [])

  return <div>{count}</div>;
}

function App() {
  const [isTimerOn, toggleTimer] = useReducer((x) => !x, false);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={toggleTimer}>
          {isTimerOn ? 'Kill Timer' : 'Start Timer'}
        </button>
        {isTimerOn ? <Timer /> : <div>{"\u2060"}</div>}
      </div>
    </>
  )
}

export default App
