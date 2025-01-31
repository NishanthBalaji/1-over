import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import '../styles/Game.css'
import { useNavigate } from "react-router-dom";

export default function Game() {
    const location = useLocation();
    const { chooseOptions, matchBet } = location.state || {}; // Get toss option from the previous page

    const navigate = useNavigate();

    const [balance, setBalance] = useState(() => {
        const storedBalance = localStorage.getItem("balance");
        return storedBalance ? parseInt(storedBalance) : 0;
    });



    // Initializing state variables
    const [side, setSide] = useState(null);  // null means no choice yet
    const [playerScore, setPlayerScore] = useState(0);
    const [playerWickets, setPlayerWickets] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [opponentWickets, setOpponentWickets] = useState(0);
    const [ballsLeft, setBallsLeft] = useState(6);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [innings, setInnings] = useState(1);

    // Set side based on toss choice, if it's not already set
    useEffect(() => {
        if (chooseOptions && side === null) {
            setSide(chooseOptions.toLowerCase());  // 'bat' or 'bowl'
        }
    }, [chooseOptions, side]);

    // Switch innings after each 6 balls
    useEffect(() => {
        if (ballsLeft === 0) {
            if (innings < 2) {
                // Switch innings after each 6 balls
                if (side === 'bat') {
                    setSide('bowl');
                } else if (side === 'bowl') {
                    setSide('bat');
                }
                setBallsLeft(6);
                setInnings(innings + 1);
            } else if (innings === 2) {
                // Set winner after both innings
                setGameOver(true);
                checkWinner();
            }
        }
        if (innings === 2 && side === 'bat' && playerScore > opponentScore) {
            checkWinner();
        }
        if (innings === 2 && side === 'bowl' && opponentScore > playerScore) {
            checkWinner();
        }
    }, [ballsLeft, innings, side, playerScore, opponentScore]);

    // Function to check winner
    const checkWinner = () => {
        if (playerScore > opponentScore) {
            setGameOver(true);
            setWinner('You');
        } else if (playerScore < opponentScore) {
            setGameOver(true);
            setWinner('Opponent');
        } else {
            setGameOver(true);
            setWinner('Tie');
        }
    };

    // Handle player's shot
    const handlePlayerShot = (shot) => {
        if (side === 'bat' && ballsLeft > 0) {
            const ball = Math.floor(Math.random() * 6) + 1;
            if (shot !== ball) {
                setPlayerScore(prevScore => prevScore + shot);
            } else {
                setPlayerWickets(prevWicket => prevWicket + 1);
            }
            setBallsLeft(prevBalls => prevBalls - 1);
        }
    };

    // Handle opponent's shot while bowling
    const handleOpponentShot = (ball) => {
        if (side === 'bowl' && ballsLeft > 0) {
            const shot = Math.floor(Math.random() * 6) + 1;
            if (shot !== ball) {
                setOpponentScore(prevScore => prevScore + shot);
            } else {
                setOpponentWickets(prevWicket => prevWicket + 1);
            }
            setBallsLeft(prevBalls => prevBalls - 1);
        }
    };

    const [isBalanceUpdated, setIsBalanceUpdated] = useState(false); // Flag to track balance update

    useEffect(() => {
        if (winner === "You" && !isBalanceUpdated) {
            const newBalance = balance + matchBet * 2;
            setBalance(newBalance); // Update state
            localStorage.setItem("balance", newBalance); // Update localStorage
            setIsBalanceUpdated(true); // Set the flag to prevent further updates
        }

        if (winner === "Tie" && !isBalanceUpdated) {
            const newBalance = balance + matchBet;
            setBalance(newBalance); // Update state
            localStorage.setItem("balance", newBalance); // Update localStorage
            setIsBalanceUpdated(true); // Set the flag to prevent further updates
        }
    }, [winner, balance, matchBet, isBalanceUpdated]);

    const handleHome = () => {
        navigate("/");
    }

    return (
        <div className={`game ${side === 'bowl' ? 'bowling-bg' : 'batting-bg'} ${winner === 'You' ? 'win' : ''} ${winner === 'Opponent' ? 'loss' : ''}`}>
            <main id="container">
                <header className="box" id="header">
                    <h1>1 Over</h1>
                </header>

                {!gameOver && <section className="box" id="current-role">
                    <p>{side === 'bat' ? 'You are batting' : 'You are bowling'}</p>
                </section>}


                {!gameOver ? (
                    <>
                        <section className="box playbutton" id="batting" style={{ visibility: side === 'bat' || gameOver ? 'visible' : 'hidden' }}>
                            {side === 'bat' && ballsLeft > 0 && (
                                <>
                                    <p>Choose your shot: </p>
                                    <div className="play-button">
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <button key={num} onClick={() => handlePlayerShot(num)}>
                                                Shot {num}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </section>

                        <section className="box playbutton" id="bowling" style={{ visibility: side === 'bowl' || gameOver ? 'visible' : 'hidden' }}>
                            {side === 'bowl' && ballsLeft > 0 && (

                                <>
                                    <p>Choose the ball number to bowl: </p>
                                    <div className="play-button">
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <button key={num} onClick={() => handleOpponentShot(num)}>
                                                Ball {num}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </section>

                        <section>
                            {innings != 2 && < p > Balls Left: {ballsLeft}</p>}
                            <p style={{ visibility: playerScore > 0 || playerWickets > 0 ? 'visible' : 'hidden' }}>Your Score : {playerScore} - {playerWickets}</p>


                            <p style={{ visibility: opponentScore > 0 || opponentWickets > 0 ? 'visible' : 'hidden' }}>Opponent Score : {opponentScore} - {opponentWickets}</p>
                        </section>

                        {!gameOver && innings === 2 && (
                            <section>
                                <p style={{ fontSize: '14px' }}>
                                    {side === "bowl"
                                        ? `Opponent needs to Score ${(playerScore - opponentScore) + 1} runs with ${ballsLeft} balls to Win`
                                        : `You need to Score ${(opponentScore - playerScore) + 1} runs with ${ballsLeft} balls to Win`
                                    }
                                </p>
                            </section>
                        )}

                    </>

                ) : (
                    <section className="box" id="result">
                        {winner &&
                            (
                                winner === "You" ?
                                    <>
                                        <h2>Congratulations, You Won!</h2>
                                        <p>You won {matchBet * 2}</p>
                                        <p>Current Balance: {balance}</p>
                                    </>
                                    :
                                    winner === "Opponent" ?
                                        <>
                                            <h2>
                                                Better Luck Next Time, Opponent Won!
                                            </h2>
                                            <p>You lost {matchBet}</p>
                                            <p>Current Balance: {balance}</p>
                                        </>
                                        :
                                        <>
                                            <p>It's a tie!</p>
                                            <p>Since the march is tied you get your {matchBet} bet amount back</p>
                                            <p>Current Balance: {balance}</p>
                                        </>

                            )}
                        {winner && <button id="home-button" onClick={handleHome}>Home</button>}
                    </section>
                )}
            </main>
        </div >
    );
}
