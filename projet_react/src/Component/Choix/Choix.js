import React from "react";
import ReactDOM from "react-dom";
import Timer from "../Timer/Timer";
import Compteur from "../Score/Score";

import audioBase from "./media/audioBase.svg";
import audioWave1 from "./media/audioWave1.svg";
import audioWave2 from "./media/audioWave2.svg";
import audioWave3 from "./media/audioWave3.svg";

import colere from "../../audio/colere.ogg";
import joie from "../../audio/joie.ogg";
import peur from "../../audio/peur.ogg";
import tristesse from "../../audio/tristesse.ogg";

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

let emotions = [
    new Emotion("Colère", [colere], "red"),
    new Emotion("Tristesse", [tristesse], "lime"),
    new Emotion("Joie", [joie], "#3ba9cd"),
    new Emotion("Peur", [peur], "mediumpurple")
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
		Choix.INSTANCE = this;
    }

    generateEmo() {
		this.answer = Math.floor(Math.random()*2);
		let valid = false;
		while(!valid) {
			this.emotions = [randomEmotion(), randomEmotion()];
			valid = this.emotions[0] != this.emotions[1] && this.emotions[this.answer].hasAudioSourcesLeft();
		}
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
		Timer.INSTANCE.unfreeze();
		Timer.INSTANCE.start();
		document.getElementById("playAudio").classList.remove("playing");
	}

	playAudio(force = false) {
        if(!Timer.INSTANCE.isPaused() || force) {
            document.getElementById("emotionPlayer").play();
			document.getElementById("playAudio").classList.add("playing");
        }
    }

/*
<div className="mt-5">
	<div id="help" className="hide">
		<button onClick={()=>this.exitDefinition()} className="btn exit m-2">x</button>
		<div className="text-warning p-2">
			<legend>{this.emotions[0].getName()} :</legend>
			<p>{this.emotions[0].getDesc()}</p>
		</div>
		<div className="text-warning p-2">
			<legend>{this.emotions[1].getName()} :</legend>
			<p>{this.emotions[1].getDesc()}</p>
		</div>
	</div>
	<legend id="txtrgl" className="mx-auto text-danger txtrgl">! Veuillez lire les règles du jeu avant de commencer !</legend>
	<legend id="mid" className="mx-auto">Le test démarre directement à l'appui du bouton "Commencez".</legend>
	<div id="functions" className="row col-12">
		<button id="arrowPlay" className="btn btn-warning col-md-4 mx-auto" onClick={() => this.start()}><span className="glyphicon glyphicon-play"></span>Commencez</button>
		<div id="play" className="hide mx-auto">
			<img src={icoAudio} alt="logo" onClick={this.audioRestart}/>
		</div>
	</div>
	<div id="choix_gen_js" className="hide">
		<h2 id="selectText" className="text-center mt-5">Sélectionnez une réponse (une seule est correcte).</h2>
		<h2 id="endText" className="text-center mt-5 hide">Fin du jeu!</h2>
		<p id="answer" className="invisible">Aucune réponse</p>
		<div className="firstdivdef my-2">
			<button className="btn text-center def" onClick={(this.definition)}>Définitions</button>
		</div>
		<div className="d-flex justify-content-center">
			<button type="button" className="btn bouton mx-3" style={{backgroundColor: this.emotions[0].getColor()}} onClick={() => this.validate(0)}>
				<p className="emo">{this.emotions[0].getName()}</p>
			</button>
			<button type="button" className="btn bouton mx-3" style={{backgroundColor: this.emotions[1].getColor()}} onClick={() => this.validate(1)}>
				<p className="emo">{this.emotions[1].getName()}</p>
			</button>
		</div>
	</div>
</div>
*/


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


