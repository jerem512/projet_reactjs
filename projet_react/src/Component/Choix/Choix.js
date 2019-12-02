import React from 'react';
import ReactDOM from 'react-dom';
import Timer from "../Timer/Timer";
import Compteur from "../Score/Score";

import icoAudio from './media/icoAudio.svg';
import icoNoAudio from './media/icoNoAudio.svg';

import colere from "../../audio/colere.ogg";
import joie from "../../audio/joie.ogg";
import peur from "../../audio/peur.ogg";
import tristesse from "../../audio/tristesse.ogg";

import './Choix.css'

let emotions = [
    ["Colère", colere, "red"],
    ["Tristesse", tristesse, "lime"],
    ["Joie", joie, "blue"],
    ["Peur", peur, "purple"]
];

let dummyEmotion = ["null", "null", "black"];

function randArr(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomEmotions() {
    return randArr(emotions);
}

export class Choix extends React.Component {
    
	static INSTANCE;
	
    constructor(props) {
        super(props);
        this.emotions = [dummyEmotion, dummyEmotion];
        this.soundFragment = null;
		
		Choix.INSTANCE = this;
    }

    generateEmo() {
        this.emotions = [randomEmotions(), randomEmotions()];
        while(this.emotions[0] == this.emotions[1]) {
            this.emotions[1] = randomEmotions();
        }
    }

    generateSound() {
        this.soundFragment = Math.floor(Math.random()*2);
		let player = ReactDOM.findDOMNode(this).querySelector("#emotionPlayer");
		player.setAttribute("src", this.emotions[this.soundFragment][1]);
		player.play();
    }

    updateState() {
        this.setState({
            emotions: this.emotions,
            soundFragment: this.soundFragment
        });
    }

    launch() {
        this.generateEmo();
        this.generateSound();
        this.updateState();
    }

    start() {
        this.launch();
        let thisdom = ReactDOM.findDOMNode(this);
        thisdom.querySelector("#arrowPlay").classList.add("hide");
        thisdom.querySelector("#play").classList.remove("hide");
        thisdom.querySelector("#choix_gen_js").classList.remove("hide");
        thisdom.querySelector("#mid").classList.add("hide");
        document.body.querySelector("#rules").classList.add("hide");
		Timer.INSTANCE.init();
		
    }

    validate(i) {
        if(i == this.soundFragment) {
            Compteur.INSTANCE.increment();
            alert('reponse juste');
            Timer.INSTANCE.removeTime(1);
        } else {
            Compteur.INSTANCE.decrement();
            alert('reponse fausse');
        }
        this.launch();
        Timer.INSTANCE.reset();
    }

    render() {
        return (
            <div>
                <div className="mt-5">
                    <legend id="mid" className="mx-auto">Le test démarre directement à l'appui du bouton "Commencez".</legend>
                    <div id="functions" className="row col-12">
                        <button id="arrowPlay" className="btn btn-warning col-md-4 mx-auto" onClick={() => this.start()}><span className="glyphicon glyphicon-play"></span>Commencez</button>
                        <div id="play" className="hide mx-auto">
                            <img src={icoAudio} alt="logo" />
                            <div className="mx-auto">{this.soundFragment}</div>
                        </div>
                    </div>
                    <div id="choix_gen_js" className="hide">
                        <h2 className="text-center mt-5">Sélectionnez une réponse (une seule est correcte).</h2>
                        <div className="d-flex justify-content-center">
                            <button type="button" className="btn btn-warning bouton mx-3" style={{backgroundColor: this.emotions[0][2]}} onClick={() => this.validate(0)}>
                                <p className="emo">{this.emotions[0][0]}</p>
                            </button>
                            <button type="button" className="btn btn-warning bouton mx-3" style={{backgroundColor: this.emotions[1][2]}} onClick={() => this.validate(1)}>
                                <p className="emo">{this.emotions[1][0]}</p>
                            </button>
                        </div>
                    </div>
                </div>
				//https://dl.dropboxusercontent.com/s/1glz5gg9x0y8dbk/princessmusicsmb2j.ogg
				<audio id="emotionPlayer" onEnded={() => Timer.INSTANCE.start()}></audio>
            </div>

        )
    }
}

ReactDOM.render(<Choix/>, document.getElementById('choix_html'));

export default  Choix;


