import React from 'react';
import ReactDOM from 'react-dom';
import Timer from "../Timer/Timer";
import Compteur from "../Score/Score";

import icoAudio from './media/icoAudio.svg';
import icoNoAudio from './media/icoNoAudio.svg';

import './Choix.css'

let emotions = [
    "Colère",
    "Tristesse",
    "Joie",
    "Peur"
];

function randArr(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomEmotions() {
    return randArr(emotions);
}

export class Choix extends React.Component {
    
    constructor(props) {
        super(props);
        this.emotions = [null, null];
        this.soundFragment = null;
    }

    generateEmo() {
        this.emotions = [randomEmotions(), randomEmotions()];
        while(this.emotions[0] == this.emotions[1]) {
            this.emotions[1] = randomEmotions();
        }
    }

    generateSound() {
        this.soundFragment = Math.floor(Math.random()*2);
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
                            <img src={icoAudio} alt="logo" /* className="w-100"*//>
                            <div className="mx-auto">{this.soundFragment}</div>
                        </div>
                    </div>
                    <div id="choix_gen_js" className="hide">
                        <h2 className="text-center mt-5">Sélectionnez une réponse (une seule est correcte).</h2>
                        <div className="d-flex justify-content-center">
                            <button type="button" className="btn btn-warning bouton mx-3" onClick={() => this.validate(0)}>
                                <p className="emo">{this.emotions[0]}</p>
                            </button>
                            <button type="button" className="btn btn-warning bouton mx-3" onClick={() => this.validate(1)}>
                                <p className="emo">{this.emotions[1]}</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

ReactDOM.render(<Choix/>, document.getElementById('choix_html'));

export default  Choix;


