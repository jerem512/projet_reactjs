import React from 'react';
import ReactDOM from 'react-dom';
import './Timer.css';
import Choix from "../Choix/Choix";
import Compteur from "../Score/Score";

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
	
	static INSTANCE;
	
	constructor(props) {
		super(props);
		
		this.ticks = 0;
		this.time = 15;
		this.paused = true;
		this.pauseAnimTimer = 15;
		
		this.radius = 45;
		this.border = 3;
		
		this.state = {};
		
		this.frozen = false;
		
		this.className = "hide";
		
		this.updateState();
		
		Timer.INSTANCE = this;
	}
	
	init() {
		setInterval(() => { this.update() }, 1000/60);
		document.body.addEventListener("keydown", function(e) {
			if(e.key == " ") {
				Timer.INSTANCE.setPaused();
			}
		});
		this.className = "d-flex";
		this.updateState();
	}
	
	update() {
		if(!this.paused) {
			this.ticks ++;
			if(this.ticks == this.time*60) {
				Compteur.INSTANCE.decrement();
				Choix.INSTANCE.launch();
				this.reset();
			} else if(this.ticks == (2*this.time/3)*60) {
				this.className = "d-flex lowTime";
			} else if(this.ticks == (this.time/3)*60) {
				this.className = "d-flex midTime";
			}
			if(this.pauseAnimTimer > 0) {
				this.pauseAnimTimer --;
			}
		} else {
			if(this.pauseAnimTimer < 15) {
				this.pauseAnimTimer ++;
			}
		}
		this.updateState();
	}
	
	updateState() {
		let newState = {};
		for(let value of ["ticks", "time", "paused", "pauseAnimTimer"]) {
			if(!this.state[value] || this.state[value] != this[value]) {
				newState[value] = this[value];
			}
		}
		
		if(Object.keys(newState).length > 0) {
			this.setState(newState);
		}
	}
	
	getPath() {
		let angle = Math.PI*2 * (1-(this.ticks/(this.time*60)));
		// Pour que le zéro se trouve en haut et non à droite
		angle = angle - Math.PI/2;

		let halfSize = this.radius+this.border;
		
		let path = "M" + halfSize + "," + halfSize + " L" + halfSize + "," + this.border + " ";
		// Il y a besoin de faire deux courbres quand le cercle est rempli à plus de la moitié
		if(angle > Math.PI/2) {
			path = path + "A" + this.radius + "," + this.radius + " 1 0,1 " + halfSize + "," + (this.radius*2 + this.border) + " ";
		}
		path = path + "A" + this.radius + "," + this.radius + " 1 0,1 ";
		path = path + (halfSize + this.radius*Math.cos(angle)) + "," + (halfSize + this.radius*Math.sin(angle)) + " z";
		
		return path;
	}
	
	setPaused(paused = !this.paused) {
		if(!this.frozen && this.ticks < this.time*60 && this.paused != paused) {
			this.paused = paused;
			this.updateState();
		}
	}
	
	getPlayPausePath(i) {
		let animProgress = this.pauseAnimTimer/15;
		if(i == 0) {
			let center = interpolate(10, 15, animProgress);
			let path = "M0 0";
			path = path + " L" + center + " " + 7.5*animProgress;
			path = path + " L" + center + " " + interpolate(30, 22.5, animProgress);
			path = path + " L0 30 Z";
			return path;
		} else {
			let center = interpolate(20, 15, animProgress);
			let path = "M" + center + " " + 7.5*animProgress;
			path = path + " L30 " + 15*animProgress;
			path = path + " L30 " + interpolate(30, 15, animProgress);
			path = path + " L" + center + " " + interpolate(30, 22.5, animProgress);
			return path;
		}
	}
	
	removeTime(time) {
		this.time = Math.max(this.time - time, 3);
	}

	reset() {
		this.ticks = 0;
		this.className = "d-flex";
		this.stop();
		this.updateState();
	}
	
	isPaused() {
		return this.paused;
	}
	
	start() {
		this.setPaused(false);
	}
	
	stop() {
		this.setPaused(true);
	}
	
	freeze() {
		this.frozen = true;
	}
	
	unfreeze() {
		this.frozen = false;
	}

	enterRules(){
		let thisdom = ReactDOM.findDOMNode(this);
		thisdom.querySelector("#regles").classList.remove("hide");
	}
	exitRules(){
		let thisdom = ReactDOM.findDOMNode(this);
		thisdom.querySelector("#regles").classList.add("hide");
	}
	
	render() {
		return (
			<div>
				<div className="parentregles">
					<div className="mx-auto rglmid my-2">
						<button id="rules" className="btn btn-warning rgl" onClick={()=> this.enterRules()}>Règles</button>
					</div>
					<div id="regles" className="regles hide">
						<div>
							<div>
								<button className="btn exit" onClick={()=> this.exitRules()}>x</button>
							</div>
							<ul className="mt-1">
								<legend><u>Objectifs pédagogiques :</u></legend>
								<li>Savoir identifier une émotion à la voix</li>
								<li>Savoir reconnaître le besoin lié à une émotion</li>
								<li>Savoir réagir à un besoin exprimé par une émotion</li>
							</ul>
						</div>
					</div>
				</div>
				<div id="controls">
					<svg id="playpause" onClick={() => this.setPaused()}>
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

ReactDOM.render(<Timer />, document.getElementById('time'));

export default Timer;