import React from 'react';
import ReactDOM from 'react-dom';
import Timer from "../Timer/Timer";
import Compteur from "../Score/Score";
import icoAudio from './media/icoAudio.svg';
import colere from "../../audio/colere.ogg";
import joie from "../../audio/joie.ogg";
import peur from "../../audio/peur.ogg";
import tristesse from "../../audio/tristesse.ogg";

import './Choix.css';

class Emotion {
	
	constructor(name, audio, color/*, desc*/) {
		this.name = name;
		this.audio = audio;
		this.color = color;
		this.desc = "Lorem ipsum dolor sit amet, consectetur adipisicing elit";
		this.played = false;
	}
	
	getName() {
		return this.name;
	}
	
	getAudio() {
		this.played = true;
		return this.audio;
	}
	
	getColor() {
		return this.color;
	}
	
	getDesc() {
		return this.desc;
	}
	
	hasPlayed() {
		return this.played;
	}
	
}

let emotions = [
    new Emotion("Colère", colere, "red"),
    new Emotion("Tristesse", tristesse, "lime"),
    new Emotion("Joie", joie, "blue"),
    new Emotion("Peur", peur, "purple")
];

let dummyEmotion = new Emotion("", null, "black");

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
		this.enPAuse = false;
		Choix.INSTANCE = this;
    }

    generateEmo() {
        this.emotions = [randomEmotions(), randomEmotions()];
        while(this.emotions[0] == this.emotions[1]) {
            this.emotions[1] = randomEmotions();
        }
    }

    generateSound() {
		let canContinue = false;
		for(let emotion of emotions) {
			if(!emotion.hasPlayed()) {
				canContinue = true;
			}
		}
		
		if(canContinue) {
			this.soundFragment = Math.floor(Math.random()*2);
			let player = ReactDOM.findDOMNode(this).querySelector("#emotionPlayer");
			player.setAttribute("src", this.emotions[this.soundFragment].getAudio());
			player.play();
		} else {
			//console.log("%cGG", "color: red; font-size: 10em;");
			document.querySelector("#selectText").classList.add("hide");
			document.querySelector("#endText").classList.remove("hide");
		}
		Timer.INSTANCE.freeze();
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
        document.body.querySelector("#txtrgl").classList.add("hide");
		Timer.INSTANCE.init();
		
    }

    validate(i) {
        if(!Timer.INSTANCE.isPaused()) {
            let answer = document.querySelector("#answer");
            answer.classList.remove("invisible");
            if(i == this.soundFragment) {
                Compteur.INSTANCE.increment();
                Timer.INSTANCE.removeTime(1);

                answer.classList.remove("answerWrong");
                answer.classList.add("answerGood");
                answer.textContent = "Bonne réponse !";
            } else {
                Compteur.INSTANCE.decrement();
                answer.classList.remove("answerGood");
                answer.classList.add("answerWrong");
                answer.textContent = "Mauvaise réponse !";
            }
            for(let btn of document.body.querySelectorAll("button.btn")) {
                btn.blur();
            }
			Timer.INSTANCE.reset();
            Timer.INSTANCE.stop();
            this.launch();
        }
    }
	
	audioEnd() {
		Timer.INSTANCE.unfreeze();
		Timer.INSTANCE.start();
	}

	audioRestart() {
        if(!Timer.INSTANCE.isPaused()) {
            document.getElementById("emotionPlayer").play();
        }
    }
	
    definition() {
        let help  = document.querySelector("#help");
        help.classList.remove("hide");
        help.classList.add("divdef");
        Choix.INSTANCE.enPAuse = Timer.INSTANCE.isPaused();
        Timer.INSTANCE.stop();
        Timer.INSTANCE.freeze();
    }
	
    exitDefinition() {
        let exit = document.querySelector("#help");
        exit.classList.add("hide");
        Timer.INSTANCE.unfreeze();
        if(!Choix.INSTANCE.enPAuse){
            Timer.INSTANCE.start();
        }
    }


    render() {
        return (
            <div>
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
				<audio id="emotionPlayer" onEnded={this.audioEnd}></audio>
            </div>

        )
    }
}

ReactDOM.render(<Choix/>, document.getElementById('choix_html'));

export default  Choix;


