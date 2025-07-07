import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import "./App.css";
import Die from "./Die";

function App() {
  const [dice, setDice] = useState(() => generateAllNewDice()); //to make sure you only call this one time only

  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

  const buttonRef = useRef(null);

  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
    }
  }, [gameWon]);

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  function rollDice() {
    if (gameWon) {
      setDice(generateAllNewDice());
    } else {
      setDice((oldDice) =>
        oldDice.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
        )
      );
    }
  }

  function hold(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  const dices = dice.map((dieObj) => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      onClickHold={() => hold(dieObj.id)}
    />
  ));

  return (
    <main>
      {gameWon && <Confetti />}
      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>Congratulations! You won! Press "New Game" to start again.</p>
        )}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{dices}</div>
      <button className="btn roll-dice" onClick={rollDice} ref={buttonRef}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
