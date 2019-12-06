import React from "react";
import ReactDOM from "react-dom";
import Timer from "../Timer/Timer";
import Compteur from "../Score/Score";

import audioBase from "./media/audioBase.svg";
import audioWave1 from "./media/audioWave1.svg";
import audioWave2 from "./media/audioWave2.svg";
import audioWave3 from "./media/audioWave3.svg";

import './Choix.css';

// classe définissant une émotion (sera créée via contenu dans la base de données)
class Emotion {
	
	constructor(name, audios, color/*, desc*/) {
		this.name = name;
		this.audios = audios == null ? [] : audios.map(function(audio) { return {source: audio, played: false} });
		this.color = color;
		this.desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt convallis magna at tempor. Praesent tempor leo in purus ultricies ullamcorper. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras rhoncus, nunc sit amet pharetra elementum, massa dolor iaculis dui, non commodo enim leo nec nunc. Aenean vestibulum quis leo quis rhoncus. Mauris diam nisi, sodales ultrices odio sit amet, tincidunt varius ex. Vivamus condimentum consectetur leo ut maximus. Quisque ultricies ligula felis, vitae feugiat urna elementum nec. Curabitur condimentum ac sem a commodo.";
	}
	
	// renvoie le nom de l'émotion
	getName() {
		return this.name;
	}
	
	// renvoie si il reste des sources audio à jouer
	hasAudioSourcesLeft() {
		for(let audio of this.audios) {
			if(!audio.played) {
				return true;
			}
		}
		return false;
	}
	
	// renvoie une source audio aléatoire
	getAudio() {
		let i = Math.floor(Math.random()*this.audios.length);
		while(this.audios[i].played) {
			i = Math.floor(Math.random()*this.audios.length);
		}
		this.audios[i].played = true;
		return this.audios[i].source;
	}
	
	// renvoie la couleur de l'émotion
	getColor() {
		return this.color;
	}
	
	// renvoie la description de l'émotion
	getDesc() {
		return this.desc;
	}
}

// charge les sources audios
let sounds = {}
for(let emoname of ["colere", "tristesse", "joie", "peur"]) {
	sounds[emoname] = [];
	for(let i = 1; i <= 3; i++) {
		sounds[emoname].push(require("../../audio/" + emoname + "_" + i + ".ogg"));
	}
}

// créé les émotions
const emotions = [
    new Emotion("Colère", sounds["colere"], "red"),
    new Emotion("Tristesse", sounds["tristesse"], "lime"),
    new Emotion("Joie", sounds["joie"], "#3ba9cd"),
    new Emotion("Peur", sounds["peur"], "mediumpurple")
];

// renvoie une émotion aléatore
function randomEmotion() {
	return emotions[Math.floor(Math.random()*emotions.length)];
}

// "fausse émotion" pour éviter que la page plante si il n'y a pas d'émotion
let dummyEmotion = new Emotion("", null, "black");

export class Choix extends React.Component {
    
	// contient l'instance de cette classe
	static INSTANCE;
	
	// Constructeur de la classe
    constructor(props) {
        super(props);
        this.emotions = [dummyEmotion, dummyEmotion];
        this.answer = null;
		this.showDefs = false;
		this.firstPlay = true;
		Choix.INSTANCE = this;
    }

	// selectionne deux émotions aléatoires si il reste des sources audios, puis la joue
    loadEmotions() {
		// reste-t-il des sources audios ?
		let canContinue = false;
		for(let emotion of emotions) {
			if(emotion.hasAudioSourcesLeft()) {
				// oui, il reste au moins une source audio
				canContinue = true;
			}
		}
		
		if(canContinue) {
			// choix de la bonne réponse
			this.answer = Math.floor(Math.random()*2);
			
			let valid = false;
			while(!valid) {
				// selectionne les émotions
				this.emotions = [randomEmotion(), randomEmotion()];
				// le choix est valide si les deux émotions sont différentes et que la réponse a au moins une source audio restante
				valid = this.emotions[0] != this.emotions[1] && this.emotions[this.answer].hasAudioSourcesLeft();
			}
			// sert à empécher le timer de se relancer si la source audio fini après que l'utilisateur a répondu
			this.firstPlay = true;
			// joue la source audio
			let player = ReactDOM.findDOMNode(this).querySelector("#emotionPlayer");
			player.setAttribute("src", this.emotions[this.answer].getAudio());
			this.playAudio(true);
		}
    }

	// force un rendu de l'élément
    updateState() {
        this.setState({
            emotions: this.emotions,
            answer: this.answer
        });
    }

	// lance une question
    launch() {
        this.loadEmotions();
        this.updateState();
    }

	// affiche les éléments au début du jeu
    start() {
        this.launch();
		// cache le bouton "PRESS START TO PLAY"
		document.querySelector("#start").classList.add("hide");
		// affiche le jeu
		document.querySelector("#game").classList.remove("hide");
		document.querySelector("#game").classList.add("d-flex");
		document.querySelector("#controls").classList.remove("hide");
		document.querySelector("#score_compteur").classList.remove("hide");
		// initialise le timer
		Timer.INSTANCE.init();
		
    }

	// vérifie le choix de l'utilisateur
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
			// affiche le texte de résultat
			result.classList.remove("hide");
			Timer.INSTANCE.stop();
			Timer.INSTANCE.freeze();
			// cache le texte de résultat au bout de 5 secondes 
			setTimeout(function() {
				Timer.INSTANCE.reset();
				Choix.INSTANCE.launch();
				result.classList.add("hide");
			}, 5000);
		}
    }
	
	// désactive l'animation de lecture et relance le timer (la première fois)
	audioEnd() {
		if(Choix.INSTANCE.firstPlay) {
			Timer.INSTANCE.unfreeze();
			Timer.INSTANCE.start();
			Choix.INSTANCE.firstPlay = false;
		}
		document.getElementById("playAudio").classList.remove("playing");
	}

	// joue l'audio (par défaut, ne pas forcer)
	// si on force, ça peux passer outre la pause
	playAudio(forced = false) {
        if(!Timer.INSTANCE.isPaused() || forced == true) {
            document.getElementById("emotionPlayer").play();
			document.getElementById("playAudio").classList.add("playing");
        }
    }

	// fait le rendu HTML de l'élément
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
									<div key={"choix"+i} id={"choix"+i} className="bouton m-2" onClick={() => {this.validate(i)}} style={{backgroundColor: this.emotions[i].getColor()}}>
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


