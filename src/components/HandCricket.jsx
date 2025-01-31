import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

import '../styles/HandCricket.css'

export default function HandCricket() {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(() => {
        const storedBalance = localStorage.getItem("balance");
        return storedBalance ? parseInt(storedBalance) : 0;
    });
    const [bet, setBet] = useState(0);

    useEffect(() => {
        localStorage.setItem("balance", balance);
    }, [balance]);

    const addBalance = () => {
        setBalance(balance + 1000)
    }

    const subBalance = () => {
        setBalance(balance - 1000)
    }

    const addBet = () => {
        setBet(bet + 100)
        setBalance(balance - 100)
    }

    const subBet = () => {
        setBet(bet - 100)
        setBalance(balance + 100)
    }

    const handleStart = () => {
        navigate("/toss", { state: { bet } });
    }

    const enableStart = (bet >= 1)

    const enableWithdraw = (balance > 999)

    const enableAddBet = (balance > 0)

    const enableSubBet = (bet > 0)

    return (

        <main className="hand-cricket">
            <div id="container">
                <header className="box" id="header">
                    <h1>1 Over</h1>
                </header>

                <section className="box" id="current-balance">
                    <p>Current Balance: {balance}</p>
                </section>

                <section className="box" id="balance-btn">
                    <button className="balance-button add" id="add-balance" onClick={addBalance}>Add Balance (+1000)</button>

                    <button
                        className="balance-button sub"
                        id="withdraw-balance"
                        onClick={subBalance}
                        style={{ visibility: enableWithdraw ? 'visible' : 'hidden' }}>
                        Withdraw Amount (-1000)
                    </button>
                </section>


                {enableAddBet && <section className="box" id="bet-btn">
                    {enableStart ? <p>Bet Amount: {bet}</p> : <p>Add Bet Amount To Play</p>}
                    <button
                        className="bet-button add"
                        onClick={addBet}
                        style={{ visibility: enableAddBet ? 'visible' : 'hidden' }}>Add Bet (+100)</button>

                    <button
                        className="bet-button sub"
                        onClick={subBet}
                        style={{ visibility: enableSubBet ? 'visible' : 'hidden' }}>Reduce Bet (-100)

                    </button>
                </section>}

                <section className="box" id="start-btn">
                    <button
                        className="start-button"
                        style={{ visibility: enableStart ? 'visible' : 'hidden' }}
                        onClick={handleStart}>Start a {bet} Game
                    </button>
                </section>

            </div>
        </main>
    )
}