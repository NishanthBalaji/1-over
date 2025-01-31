import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/Toss.css'



export default function Toss() {
    const location = useLocation();
    const navigate = useNavigate();
    const { bet } = location.state || {};

    const [matchBet, setBet] = useState(bet)

    const [selectedValue, setSelectedValue] = useState('heads');
    const [result, setResult] = useState(null);
    const [tossResult, setTossResult] = useState(null); // Change default state to null
    const [showToss, setShowToss] = useState(true);
    const [message, setMessage] = useState("");
    const [chooseOptions, setChooseOptions] = useState(""); // Store opponent's choice

    const coin = ['heads', 'tails'];
    const options = ['Bat', 'Bowl'];

    const handleToss = (e) => {
        e.preventDefault();
        // if (!selectedValue && showToss) {
        //     setMessage("Please select heads or tails before flipping the coin.");
        //     return;
        // }
        const toss = coin[Math.floor(Math.random() * 2)];
        console.log("Toss Result:", toss);
        setResult(toss);
        setShowToss(false);

        if (selectedValue === toss) {
            setTossResult(true);
        } else {
            setTossResult(false);
            setChooseOptions(options[Math.floor(Math.random() * 2)]); // Set opponent's choice
        }
    };

    const handleChoice = (choice) => {
        console.log(`You chose to ${choice}`);
        navigate("/game", { state: { chooseOptions: choice, matchBet: bet } });
        // Handle the user's decision (Bat/Bowl)
    };

    return (
        <main className="toss" >
            <div id="container">

                <header className="box" id="header">
                    <h1>Coin Toss</h1>
                    <p>Choose Heads or Tails and Flip the Coin</p>
                </header>


                {showToss && (
                    <form className="box" id="heads-tails">
                        <div id="head">
                            <input
                                type="radio"
                                id="heads"
                                value="heads"
                                required
                                name="toss"
                                checked={selectedValue === "heads"}
                                onChange={(e) => setSelectedValue(e.target.value)}
                            />
                            <label htmlFor="heads">Heads</label>
                        </div>

                        <div id="tail">
                            <input
                                type="radio"
                                id="tails"
                                value="tails"
                                name="toss"
                                required
                                checked={selectedValue === "tails"}
                                onChange={(e) => setSelectedValue(e.target.value)}
                            />
                            <label htmlFor="tails">Tails</label>
                        </div>

                        <div id="flip">
                            <button onClick={handleToss}>Flip the coin</button>
                        </div>

                    </form>
                )}

                {message && <p style={{ color: "red" }}>{message}</p>}

                {!showToss && (
                    tossResult ? (
                        <section className="box" id="toss-won">
                            <p style={{ color: "green" }}>
                                You won the toss, Choose to Bat or Bowl
                            </p>
                            <button onClick={() => handleChoice("Bat")}>Bat</button>
                            <button onClick={() => handleChoice("Bowl")}>Bowl</button>
                        </section>
                    ) : (
                        <section className="box" id="toss-lost">
                            <p style={{ color: "red" }}>
                                Opponent won the toss and chose to {chooseOptions} first
                            </p>

                            <button onClick={() => handleChoice(chooseOptions === "Bat" ? "Bowl" : "Bat")}>
                                Start Match
                            </button>
                        </section>
                    )
                )}
            </div>
        </main >
    );
}
