import { useState } from "react";
import "./App.css";

const HEADS = "orzel";
const TAILS = "reszka";

export default function App() {
  const [result, setResult] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [guess, setGuess] = useState(null);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const doFlip = () => {
    if (!guess || isFlipping) return;
    
    setIsFlipping(true);
    setLastCorrect(null);
    setAnimKey((k) => k + 1);

    setTimeout(() => {
      const newResult = Math.random() < 0.5 ? HEADS : TAILS;
      const correct = guess === newResult;
      const newStreak = correct ? streak + 1 : 0;

      setResult(newResult);
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      setLastCorrect(correct);
      setHistory((h) =>
        [{ result: newResult, guess, correct, id: Date.now() }, ...h].slice(0, 10)
      );
      setIsFlipping(false);
      setGuess(null);
    }, 1500);
  };

  const probRows = Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    const prob = 100 / Math.pow(2, n);
    const display = prob >= 1 ? prob.toFixed(prob % 1 === 0 ? 0 : 2) : prob.toFixed(3);
    return { n,
       display,
        isAchieved: n <= streak, 
        isCurrent: n === streak,
         isNext: n === streak + 1 };
  });

  const lastTenStats = (() => {
    if (history.length === 0) return { heads: 0, tails: 0 };
    const headsCount = history.filter(h => h.result === HEADS).length;
    const tailsCount = history.length - headsCount;
    return {
      heads: Math.round((headsCount / history.length) * 100),
      tails: Math.round((tailsCount / history.length) * 100)
    };
  })();

  return (
    <div className="app-container">
      <div className="max-width-container">
        <div className="header">
          <h1 className="header-title">Rzut Monetą</h1>
          <p className="header-subtitle"></p>
        </div>

        <div className="main-layout">
          <div className="left-column">
            {/* Sekcja Monety */}
            <div key={animKey} className={`coin-base ${isFlipping ? "coin-spin" : result !== null ? "pop-in" : ""}`}>
              {isFlipping ? (
                <div className="flipping-text">ORZEŁ<br/>RESZKA</div>
              ) : result === null ? (
                <>
                  <div className="placeholder-q">?</div>
                  <div className="placeholder-text">CZEKA NA RZUT</div>
                </>
              ) : (
                <>
                  <div className="coin-symbol">{result === HEADS ? "⚜" : "◉"}</div>
                  <div className="coin-label">{result === HEADS ? "ORZEŁ" : "RESZKA"}</div>
                </>
              )}
            </div>

            {lastCorrect !== null && !isFlipping && (
              <div className={`feedback-badge slide-in ${lastCorrect ? "correct" : "incorrect"}`}>
                {lastCorrect ? "✓ TRAFIONE!" : "✗ PUDŁO — SERIA ZERUJE SIĘ"}
              </div>
            )}

            <div className="guess-buttons-container">
              {[HEADS, TAILS].map((opt) => (
                <button
                  key={opt}
                  disabled={isFlipping}
                  onClick={() => setGuess(opt)}
                  className={`guess-btn ${guess === opt ? "active" : ""}`}
                >
                  {opt === HEADS ? "⚜ Orzeł" : "◉ Reszka"}
                </button>
              ))}
            </div>

            <button onClick={doFlip} disabled={!guess || isFlipping} className="flip-button">
              {isFlipping ? "— leci —" : "Rzuć monetą"}
            </button>

            {history.length > 0 && (
              <div className="history-section">
                <p className="history-label">Historia rzutów</p>
                <div className="history-list">
                  {history.map((item, i) => (
                    <div key={item.id} className={`history-row ${i === 0 ? "newest" : ""}`} style={{ opacity: Math.max(0.25, 1 - i * 0.05) }}>
                      <span className="history-index">#{history.length - i}</span>
                      <span>{item.result === HEADS ? "⚜ Orzeł" : "◉ Reszka"}</span>
                      <span className="history-arrow">→ {item.guess === HEADS ? "Orzeł" : "Reszka"}</span>
                      <span className={`history-status ${item.correct ? "correct" : "incorrect"}`}>{item.correct ? "✓" : "✗"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="right-column">
            <div className="card">
              <p className="card-title">Aktualna seria</p>
              <p className={`streak-number ${streak > 0 ? "active" : "inactive"}`}>{streak}</p>
              <div className="streak-footer">
                <span>Rekord</span>
                <span className="gold-text">{maxStreak}</span>
              </div>
            </div>

            <div className="card">
              <p className="card-title">Szansa na trafienie</p>
              {probRows.map(({ n, display, isCurrent, isNext }) => (
                <div key={n} className={`prob-row ${isCurrent ? "current" : isNext ? "next" : ""}`}>
                  <span>Seria {n}</span>
                  <span className="prob-val">{display}%</span>
                </div>
              ))}
            </div>
            <div className="card">
              <p className="card-title">Ostatnie {history.length} rzutów</p>
              <div className="stats-bar-container">
                <div className="stats-bar-labels">
                  <span>Orzeł: {lastTenStats.heads}%</span>
                  <span>Reszka: {lastTenStats.tails}%</span>
                </div>
                <div className="stats-bar-track">
                  <div 
                    className="stats-bar-fill heads" 
                    style={{ width: `${lastTenStats.heads}%` }}
                  ></div>
                  <div 
                    className="stats-bar-fill tails" 
                    style={{ width: `${lastTenStats.tails}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}