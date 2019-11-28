import React from 'react';
import ReactDOM from 'react-dom';
import Timer from "../Timer/Timer";

import icoAudio from './media/icoAudio.svg';
import icoNoAudio from './media/icoNoAudio.svg';

import './Choix.css'

let emotions = [
    "emo1",
    "emo2",
    "emo3",
    "emo4"
];

function randArr(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomEmotions() {
    return randArr(emotions);
}

class Choix extends React.Component {
    
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
		Timer.INSTANCE.start();
    }

    validate(i) {
        if(i == this.soundFragment) {
            alert("YAY");
        } else {
            alert("NAH");
        }
        this.launch();
    }

    render() {
        return (
            <div id="choix_gen_js" className="d-flex flex-row justify-content-around mr-auto ml-auto">
                <div>
                    <h2>Réponse une</h2>
                    <button type="button" className="choix_sec_js btn btn-primary btn-lg btn-block mr-5" onClick={() => this.validate(0)}>
                        <p className="emo">{this.emotions[0]}</p>
                    </button>
                </div>
                <div>
                    <h2>Réponse deux</h2>
                    <button type="button" className="choix_sec_js btn btn-primary btn-lg btn-block" onClick={() => this.validate(1)}>
                        <p className="emo">{this.emotions[1]}</p>
                    </button>
                </div>
                
                <div id="functions" className="d-flex flex-column mr-auto ml-auto">
                    <button id="arrowPlay" className="btn btn-info btn-lg" onClick={() => this.start()}><span className="glyphicon glyphicon-play"></span>Commencez</button>
                    <div id="play" className="hide mr-auto ml-auto">
                        <img src={icoAudio} alt="logo"/>
                        <div>{this.soundFragment}</div>
                    </div>
                </div>
            </div>
            
        )
    }
}

ReactDOM.render(<Choix/>, document.getElementById('choix_html'));


