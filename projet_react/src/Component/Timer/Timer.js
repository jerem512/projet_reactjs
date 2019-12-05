import React from 'react';
import ReactDOM from 'react-dom';
import './Timer.css';
import Choix from "../Choix/Choix";
import Compteur from "../Score/Score";

// Permet de calculer la valeur linéaire entre `from` et `to`
function interpolate(from, to, progress) {
	if(progress <= 0) {
		return from;
	} else if(progress >= 1) {
		return to;
	} else {
		return from + (to-from)*progress;
	}
}

class Timer extends React.Component {
	
	// contient l'instance de cette classe
	static INSTANCE;
	
	// Constructeur de la classe
	constructor(props) {
		super(props);
		
		this.ticks = 0;
		this.time = 15;
		this.paused = true;
		this.pauseAnimTimer = 15;
		
		this.radius = 70;
		this.border = 5;
		
		this.state = {};
		
		this.frozen = false;
		
		this.className = "hide";
		
		Timer.INSTANCE = this;
	}
	
	// Permet d'initialialiser le timer
	init() {
		// va appeller la fonction update 60 fois par secondes (utilisée surtout pour les animations)
		setInterval(() => { this.update() }, 1000/60);
		// ajoute la fonction d'appui sur espace pour mettre en pause
		document.body.addEventListener("keydown", function(e) {
			if(e.key == " ") {
				Timer.INSTANCE.pauseClick();
			}
		});
		// ajoute le rendu "flex" sur cet element (grâce à Bootstrap)
		this.className = "d-flex";
		// force le rendu de l'élément
		this.updateState();
	}
	
	update() {
		if(!this.paused) {
			// compter le temps et faire le rendu seulement si le jeu n'est pas en pause
			this.ticks ++;
			if(this.ticks == this.time*60) {
				// le temps est écoulé, automatiquement "perdre"
				let result = document.querySelector("#result");
				result.textContent = "Temps écoulé";
				result.classList.remove("hide");
				this.paused = true;
				this.freeze();
				// va cacher le message 5 secondes après son apparition
				setTimeout(function() {
					Timer.INSTANCE.reset();
					Choix.INSTANCE.launch();
					Compteur.INSTANCE.decrement();
					result.classList.add("hide");
				}, 5000);
			} else if(this.ticks == (2*this.time/3)*60) {
				// changer la couleur de fond en rouge
				this.className = "d-flex lowTime";
			} else if(this.ticks == (this.time/3)*60) {
				// changer la couleur de fond en orange
				this.className = "d-flex midTime";
			}
			// animation du bouton de pause à lecture
			if(this.pauseAnimTimer > 0) {
				this.pauseAnimTimer --;
			}
		} else {
			// animation du bouton de lecture à pause
			if(this.pauseAnimTimer < 15) {
				this.pauseAnimTimer ++;
			}
		}
		// force le rendu de l'élément
		this.updateState();
	}
	
	updateState() {
		// compare les valeurs actuelles avec celles du dernier rendu
		let newState = {};
		for(let value of ["ticks", "time", "paused", "pauseAnimTimer"]) {
			if(!this.state[value] || this.state[value] != this[value]) {
				newState[value] = this[value];
			}
		}
		
		// verifie qu'il y ai des changements (pour éviter un re-rendu "inutile")
		if(Object.keys(newState).length > 0) {
			this.setState(newState);
		}
	}
	
	// créé le chemin de remplissage du timer
	getPath() {
		let angle = Math.PI*2 * (1-(this.ticks/(this.time*60)));
		// Pour que le zéro se trouve en haut et non à droite
		angle = angle - Math.PI/2;

		// rayon total du cercle (en comptant la bordure)
		let halfSize = this.radius+this.border;
		
		// création du chemin SVG
		let path = "M" + halfSize + "," + halfSize + " L" + halfSize + "," + this.border + " ";
		// Il y a besoin de faire deux courbres quand le cercle est rempli à plus de la moitié
		if(angle > Math.PI/2) {
			path = path + "A" + this.radius + "," + this.radius + " 1 0,1 " + halfSize + "," + (this.radius*2 + this.border) + " ";
		}
		path = path + "A" + this.radius + "," + this.radius + " 1 0,1 ";
		path = path + (halfSize + this.radius*Math.cos(angle)) + "," + (halfSize + this.radius*Math.sin(angle)) + " z";
		
		return path;
	}
	
	// paused prends par défaut l'inverse de l'état de pause actuel (ce qui permet d'appeller
	// la fonction sans avoir à passer d'argument)
	setPaused(paused = !this.paused) {
		// si le jeu n'est pas fini et que l'état est différent
		if(this.ticks < this.time*60 && this.paused != paused) {
			this.paused = paused;
			this.updateState();
		}
	}
	
	pauseClick() {
		// si le jeu n'est pas bloqué (pour empécher le joueur de relancer le timer quand il n'est pas censé pouvoir)
		if(!this.frozen) {
			// met le jeu en pause/lecture
			this.setPaused();
			// affiche/cache le "PAUSE" (en fonction de l'état actuel)
			document.getElementById("pauseText").classList[this.paused ? "remove" : "add"]("hide");
		}
	}
	
	// anime le bouton de pause (aussi avec su SVG)
	getPlayPausePath(i) {
		let animProgress = this.pauseAnimTimer/15;
		if(i == 0) {
			// quadrilatère gauche
			let center = interpolate(10, 15, animProgress);
			let path = "M0 0";
			path = path + " L" + center + " " + 7.5*animProgress;
			path = path + " L" + center + " " + interpolate(30, 22.5, animProgress);
			path = path + " L0 30 Z";
			return path;
		} else {
			// quadrilatère droite
			let center = interpolate(20, 15, animProgress);
			let path = "M" + center + " " + 7.5*animProgress;
			path = path + " L30 " + 15*animProgress;
			path = path + " L30 " + interpolate(30, 15, animProgress);
			path = path + " L" + center + " " + interpolate(30, 22.5, animProgress);
			return path;
		}
	}
	
	// réduit le temps pour répondre (jusqu'a 3 secondes)
	removeTime(time) {
		this.time = Math.max(this.time - time, 3);
	}

	// remet le timer à zéro
	reset() {
		this.ticks = 0;
		this.className = "d-flex";
		this.stop();
		this.updateState();
	}
	
	// renvoie si le timer est en pause
	isPaused() {
		return this.paused;
	}
	
	// met le timer en lecture
	start() {
		this.setPaused(false);
	}
	
	// met le timer en pause
	stop() {
		this.setPaused(true);
	}
	
	// bloque le timer (pour empécher des actions indésirables)
	freeze() {
		this.frozen = true;
		this.stop();
	}
	
	// débloque le timer
	unfreeze() {
		this.frozen = false;
		this.start();
	}

/*
<ul className="mt-1">
	<legend><u>Objectifs pédagogiques :</u></legend>
	<li>Savoir identifier une émotion à la voix</li>
	<li>Savoir reconnaître le besoin lié à une émotion</li>
	<li>Savoir réagir à un besoin exprimé par une émotion</li>
</ul>
<ul>
	<legend><u>Règles :</u></legend>
	<li>Choisir une réponse parmis les deux, <br/>une seule correspond à l'émotion dans l'audio. </li>
	<li>L'audio peut être réécouté une nouvelle fois <br/> en cliquant sur l'image d'ondes.</li>
	<li>Le multiplicateur s'incrémente en fonctions <br/>de vos réponses :</li>
	<ul>
		<li>Plus vous donnez de bonnes réponses <br/> plus vous gagnez de points.</li>
		<li>Le temps diminue à chaque réponses. <br/> Plus le temps diminue, plus le gain de points <br/> est important.</li>
	</ul>
</ul>
*/

	// fait le rendu HTML de l'élément
	render() {
		return (
			<div>
				<div id="controls" className="hide">
					<svg id="playpause" onClick={() => this.pauseClick()}>
						<path id="pause1" d={this.getPlayPausePath(0)}></path>
						<path id="pause2" d={this.getPlayPausePath(1)}></path>
					</svg>
					<span id="timer" className={this.className}>
					<svg style={{width:(this.radius+this.border)*2, height:(this.radius+this.border)*2}}>
						<clipPath id="clip">
							<path d={this.getPath()}></path>
						</clipPath>
						<circle cx={this.radius+this.border} cy={this.radius+this.border} r={this.radius} style={{strokeWidth: this.border + "px"}}></circle>
						<path d={this.getPath()}></path>
						<circle cx={this.radius+this.border} cy={this.radius+this.border} r={this.radius} style={{strokeWidth: this.border + "px"}}></circle>
					</svg>
					<div style={{fontSize: this.radius/15 + "em"}} className="text">{this.time - Math.floor(this.ticks/60)}</div>
					<div style={{fontSize: this.radius/15 + "em"}} className="text white">{this.time - Math.floor(this.ticks/60)}</div>
				</span>
				</div>
			</div>
		);
	}
	
}

export default Timer;