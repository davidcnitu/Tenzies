import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faStar } from '@fortawesome/free-solid-svg-icons';
import Confetti from "react-dom-confetti";

export default function GameCard() {

    const [diceFaces, setDiceFaces] = React.useState(allNewDice());
    const [rolls, setRolls] = React.useState(0);
    const [tenzies, setTenzies] = React.useState(false);
    const [bestScore, setBestScore] = React.useState(JSON.parse(localStorage.getItem("bestScore")) || "---");

    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 40,
        elementCount: 70,
        dragFriction: "0.09",
        duration: "1510",
        stagger: "4",
        width: "1rem",
        height: "1rem",
        perspective: "1000px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };

    React.useEffect(() => {
        const chosenValue = diceFaces[0].value;

        if (diceFaces.every(diceFace => diceFace.isHeld && diceFace.value === chosenValue)) {
            setTenzies(true);
            console.log("You won!");
            if (rolls < bestScore || bestScore === "---") {
                setBestScore(rolls);
                localStorage.setItem("bestScore", JSON.stringify(rolls));
            }
        }

    }, [diceFaces])

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push({
                id: nanoid(),
                value: Math.ceil(Math.random() * 6),
                isHeld: false
            })
        }
        return newDice
    }

    function rollDice() {
        if (tenzies) {
            setTenzies(false);
            setRolls(0);
            setDiceFaces(allNewDice());
        } else {
            setDiceFaces(prevDieFaces => prevDieFaces.map(dieFace => {
                return dieFace.isHeld ? dieFace : { ...dieFace, value: Math.ceil(Math.random() * 6) }
            }));
            setRolls(prevRolls => prevRolls + 1);
        }
    }

    function holdDie(id) {
        setDiceFaces(prevDieFaces => prevDieFaces.map(dieFace => {
            return (dieFace.id === id ? { ...dieFace, isHeld: !dieFace.isHeld } : dieFace);
        })
        )
    }

    return (
        <div className="game-card">
            <Confetti active={tenzies} config={confettiConfig} />
            <span className="turns"><FontAwesomeIcon icon={faRotateRight} size="xs" /> Rolls: {rolls}</span>
            <span className="high-score"><FontAwesomeIcon icon={faStar} size="xs" color="#F0A500" /> Highscore: {bestScore}</span>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceFaces.map(dieFace => <Die key={dieFace.id} value={dieFace.value} isHeld={dieFace.isHeld} handleClick={() => holdDie(dieFace.id)} />)}
            </div>
            <button className="roll-button" onClick={rollDice}>{tenzies ? "Reset game" : "Roll"}</button>
        </div>
    );
}