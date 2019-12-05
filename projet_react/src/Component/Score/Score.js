import React from 'react';
import ReactDOM from 'react-dom';
import './Score.css';


class Compteur extends React.Component {

    static INSTANCE;

	// Constructeur de la classe
    constructor() {
        super()
        this.state = {}
		this.score = 0;
        this.multiplier = 1;
        this.combo = 0;
        this.basePts = 1;

        Compteur.INSTANCE = this;
    }

	// ajoute un point, augemente le nombre de points de base et le multiplicateur
    increment() {
        this.score += this.basePts * this.multiplier;
		this.setState({score: this.score});
        this.combo ++;
        this.multiplier = Math.pow(2, Math.min(this.combo - 1, 3));
        this.basePts ++;

    }

	// remet à zéro le multiplicateur
    decrement() {
        this.combo = 0;
        this.multiplier = 1;
        this.setState({score: this.score});
    }

	// fait le rendu HTML de l'élément
    render() {
        return (
            <div id="score_compteur" className="hide">
                <p>
                    Score(x{this.multiplier}) : {this.score}
                </p>
            </div>
        )
    }
}

export default Compteur;