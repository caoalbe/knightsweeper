import React, { useState, useEffect } from "react";
import { UNINTIALIZED, BLANK } from "./constants";
import { Settings, Tile, Score } from "./types";
import {
  leftClick,
  rightClick,
  restartGame,
  numToChar,
  generateSettings,
  generateScore,
  tileColour,
} from "./utils";
import Popup from "./Popup";

function Game(): JSX.Element {
  const [gameSettings, setGameSettings] = useState<Settings>({
    width: 18,
    height: 14,
    tileCount: 18 * 14,
    bombCount: 40,
    probability: 40 / (18 * 14),
  });
  const [tileData, setTileData] = useState<Array<Tile>>(
    new Array(gameSettings.tileCount)
      .fill(0)
      .map(() => ({ value: UNINTIALIZED, view: BLANK, adj_list: [] }))
  );
  const [hoveredTile, setHoveredTile] = useState<number>(-1);
  const [popupActive, setPopupActive] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [flagsRemaining, setFlagsRemaining] = useState<number>(40);
  const [finalScore, setFinalScore] = useState<Score>({
    flagCorrect: 0,
    flagIncorrect: 0,
    bombsRemaining: 0,
    victory: false,
  });

  useEffect(() => {
    setFinalScore(generateScore(tileData));
  }, [gameOver]);

  return (
    <>
      <div className="Board">
        <div>
          <span
            style={{
              fontSize: "25px",
            }}
          >
            🚩 {flagsRemaining}
          </span>
        </div>
        <div
          className="Board-playable"
          // suppress the right-click menu
          onContextMenu={(event) => {
            event.preventDefault();
          }}
          // suppress text selection (highlighting)
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          {new Array(gameSettings.height).fill(0).map((_, r) => (
            <div className="Board-row">
              {new Array(gameSettings.width).fill(0).map((_, c) => {
                const index = r * gameSettings.width + c;
                return (
                  <div
                    className="Board-tile"
                    style={{
                      backgroundColor: tileColour(
                        index,
                        hoveredTile,
                        tileData,
                        gameSettings.width
                      ),
                    }}
                    onMouseOver={() => setHoveredTile(index)}
                    onMouseLeave={() => setHoveredTile(-1)}
                    onClick={() =>
                      leftClick(
                        index,
                        tileData,
                        setTileData,
                        gameOver,
                        setGameOver,
                        setPopupActive,
                        gameSettings
                      )
                    }
                    onContextMenu={() =>
                      rightClick(
                        index,
                        tileData,
                        setTileData,
                        flagsRemaining,
                        setFlagsRemaining
                      )
                    }
                  >
                    {numToChar(tileData[index].view)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="Board-trim">
          <div
            style={{
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <button
              style={{
                fontSize: "18px",
              }}
              onClick={() => {
                const newSettings: Settings = generateSettings(10, 10, 10);
                setGameSettings(newSettings);
                restartGame(
                  newSettings,
                  setTileData,
                  setPopupActive,
                  setGameOver,
                  setFlagsRemaining
                );
              }}
            >
              Easy
            </button>
            <button
              style={{
                fontSize: "18px",
              }}
              onClick={() => {
                const newSettings: Settings = generateSettings(18, 14, 40);
                setGameSettings(newSettings);
                restartGame(
                  newSettings,
                  setTileData,
                  setPopupActive,
                  setGameOver,
                  setFlagsRemaining
                );
              }}
            >
              Medium
            </button>
            <button
              style={{
                fontSize: "18px",
              }}
              onClick={() => {
                const newSettings: Settings = generateSettings(24, 20, 99);
                setGameSettings(newSettings);
                restartGame(
                  newSettings,
                  setTileData,
                  setPopupActive,
                  setGameOver,
                  setFlagsRemaining
                );
              }}
            >
              Hard
            </button>
          </div>
          <div
            style={{
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <button
              style={{
                fontSize: "18px",
              }}
              onClick={() =>
                restartGame(
                  gameSettings,
                  setTileData,
                  setPopupActive,
                  setGameOver,
                  setFlagsRemaining
                )
              }
            >
              Restart
            </button>
            {gameOver ? (
              <button
                style={{
                  fontSize: "18px",
                }}
                onClick={() => setPopupActive(true)}
              >
                View Stats
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <Popup trigger={popupActive} setTrigger={setPopupActive}>
        <div>
          <span
            style={{
              fontSize: "27px",
            }}
          >
            {finalScore.victory ? "Victory!" : "Defeat"}
          </span>
        </div>
        <div>Mines Swepts: {finalScore.flagCorrect}</div>
        <div>Misflags: {finalScore.flagIncorrect}</div>
        <div>Mines Remaining: {finalScore.bombsRemaining}</div>
        <br />
        <button
          style={{
            fontSize: "18px",
          }}
          onClick={() =>
            restartGame(
              gameSettings,
              setTileData,
              setPopupActive,
              setGameOver,
              setFlagsRemaining
            )
          }
        >
          Restart
        </button>
      </Popup>
    </>
  );
}

export default Game;
