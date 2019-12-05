import React from "react";
import ReactDOM from "react-dom";
import Timer from "../Timer/Timer";
import Compteur from "../Score/Score";

import audioBase from "./media/audioBase.svg";
import audioWave1 from "./media/audioWave1.svg";
import audioWave2 from "./media/audioWave2.svg";
import audioWave3 from "./media/audioWave3.svg";

import './Choix.css';

class Emotion {
	
	constructor(name, audios, color/*, desc*/) {
		this.name = name;
		this.audios = audios == null ? [] : audios.map(function(audio) { return {source: audio, played: false} });
		this.color = color;
		this.desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt convallis magna at tempor. Praesent tempor leo in purus ultricies ullamcorper. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras rhoncus, nunc sit amet pharetra elementum, massa dolor iaculis dui, non commodo enim leo nec nunc. Aenean vestibulum quis leo quis rhoncus. Mauris diam nisi, sodales ultrices odio sit amet, tincidunt varius ex. Vivamus condimentum consectetur leo ut maximus. Quisque ultricies ligula felis, vitae feugiat urna elementum nec. Curabitur condimentum ac sem a commodo.";
	}
	
	getName() {
		return this.name;
	}
	
	hasAudioSourcesLeft() {
		for(let audio of this.audios) {
			if(!audio.played) {
				return true;
			}
		}
		return false;
	}
	
	getAudio() {
		let i = Math.floor(Math.random()*this.audios.length);
		while(this.audios[i].played) {
			i = Math.floor(Math.random()*this.audios.length);
		}
		this.audios[i].played = true;
		return this.audios[i].source;
	}
	
	getColor() {
		return this.color;
	}
	
	getDesc() {
		return this.desc;
	}
}

let sounds = {}
for(let emoname of ["colere", "tristesse", "joie", "peur"]) {
	sounds[emoname] = [];
	for(let i = 1; i <= 3; i++) {
		sounds[emoname].push(require("../../audio/" + emoname + "_" + i + ".ogg"));
	}
}

let emotions = [
    new Emotion("Colère", sounds["colere"], "red"),
    new Emotion("Tristesse", sounds["tristesse"], "lime"),
    new Emotion("Joie", sounds["joie"], "#3ba9cd"),
    new Emotion("Peur", sounds["peur"], "mediumpurple")
];

function randomEmotion() {
	return emotions[Math.floor(Math.random()*emotions.length)];
}

let dummyEmotion = new Emotion("", null, "black");

export class Choix extends React.Component {
    
	static INSTANCE;
	
    constructor(props) {
        super(props);
        this.emotions = [dummyEmotion, dummyEmotion];
        this.answer = null;
		this.showDefs = false;
		this.firstPlay = true;
		Choix.INSTANCE = this;
    }

    generateEmo() {
		this.answer = Math.floor(Math.random()*2);
		let valid = false;
		while(!valid) {
			this.emotions = [randomEmotion(), randomEmotion()];
			valid = this.emotions[0] != this.emotions[1] && this.emotions[this.answer].hasAudioSourcesLeft();
		}
		this.firstPlay = true;
    }

    generateSound() {
		let canContinue = false;
		for(let emotion of emotions) {
			if(emotion.hasAudioSourcesLeft()) {
				canContinue = true;
			}
		}
		
		if(canContinue) {
			let player = ReactDOM.findDOMNode(this).querySelector("#emotionPlayer");
			player.setAttribute("src", this.emotions[this.answer].getAudio());
			this.playAudio(true);
		}
    }

    updateState() {
        this.setState({
            emotions: this.emotions,
            answer: this.answer
        });
    }

    launch() {
        this.generateEmo();
        this.generateSound();
        this.updateState();
    }

    start() {
        this.launch();
		document.querySelector("#start").classList.add("hide");
		document.querySelector("#game").classList.remove("hide");
		document.querySelector("#controls").classList.remove("hide");
		document.querySelector("#score_compteur").classList.remove("hide");
		document.querySelector("#game").classList.add("d-flex");
		Timer.INSTANCE.init();
		
    }

    validate(i) {
		if(!Timer.INSTANCE.isPaused()) {
			let result = document.querySelector("#result");
			if(i == this.answer) {
				Compteur.INSTANCE.increment();
				Timer.INSTANCE.removeTime(1);
				result.textContent = "Bonne réponse";
			} else {
				Compteur.INSTANCE.decrement();
				result.textContent = "Mauvaise réponse";
			}
			result.classList.remove("hide");
			Timer.INSTANCE.stop();
			Timer.INSTANCE.freeze();
			setTimeout(function() {
				Timer.INSTANCE.reset();
				Choix.INSTANCE.launch();
				result.classList.add("hide");
			}, 5000);
		}
    }
	
	audioEnd() {
		if(Choix.INSTANCE.firstPlay) {
			Timer.INSTANCE.unfreeze();
			Timer.INSTANCE.start();
			Choix.INSTANCE.firstPlay = false;
		}
		document.getElementById("playAudio").classList.remove("playing");
	}

	playAudio(force = false) {
        if(!Timer.INSTANCE.isPaused() || force) {
            document.getElementById("emotionPlayer").play();
			document.getElementById("playAudio").classList.add("playing");
        }
    }

    render() {
        return (
			<div>
				<button id="start" onClick={() => {this.start()}}>PRESS START TO PLAY</button>
				<div id="game" className="hide">
					{(()=>{
						let items = [];
						for(let i = 0; i <= 1; i++) {
							if(this.emotions[i] != dummyEmotion) {
								items.push(
									<div key={"choix"+i} id={"choix"+i} className="bouton" onClick={() => {this.validate(i)}} style={{backgroundColor: this.emotions[i].getColor()}}>
										<p className="emoName">{this.emotions[i].getName()}</p>
										<p className={"emoDef " + (this.showDefs ? "" : "hide")}>{this.emotions[i].getDesc()}</p>
									</div>
								);
							}
						}
						return items;
					})()}
					<div className="control" id="playAudio" onClick={this.playAudio}>
						<img id="audioBase" src={audioBase} />
						<img id="audioWave1" src={audioWave1} />
						<img id="audioWave2" src={audioWave2} />
						<img id="audioWave3" src={audioWave3} />
					</div>
					<div className="control" id="defsToggle" onClick={() => {this.showDefs = !this.showDefs; this.updateState();}}><i className="material-icons">menu_book</i></div>
					<audio id="emotionPlayer" onEnded={this.audioEnd}></audio>
					<div id="result" className="hide"></div>
				</div>
			</div>
        )
    }
}

export default Choix;


