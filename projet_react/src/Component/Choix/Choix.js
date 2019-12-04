import React from 'react';
import ReactDOM from 'react-dom';

import './Choix.css';

import Timer from "../Timer/Timer";
import Compteur from "../Score/Score";

import icoAudio from './media/icoAudio.svg';
import colere from "../../audio/colere.ogg";
import joie from "../../audio/joie.ogg";
import peur from "../../audio/peur.ogg";
import tristesse from "../../audio/tristesse.ogg";

class Emotion {
	
	constructor(name, audio, color/*, desc*/) { //sets parameters to be used and their sequence
		this.name = name;
		this.audio = audio;
		this.color = color; //background color
		this.desc = "Lorem ipsum dolor sit amet, consectetur adipisicing elit"; //(description) not yet established
		this.played = false; //base state => not selected
	}
	
	getName() { //returns * when triggered/called
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
		return this.played; //the return changes the it's state from 'false' to 'true'
	}
	
}

let emotions = [
    new Emotion("Colère", colere, "red"), //array element generated using the 'constructor' model (same parameter sequence)
    new Emotion("Tristesse", tristesse, "lime"),
    new Emotion("Joie", joie, "blue"),
    new Emotion("Peur", peur, "purple")
];

let dummyEmotion = new Emotion("", null, "black"); //initial state: no name, no audio, black background

function randomEmotions() {
    return emotions[Math.floor(Math.random() * emotions.length)]; //randomization of 'emotions'
}

class Choix extends React.Component {
    
	static INSTANCE;
	
    constructor(props) {
        super(props);
        this.emotions = [dummyEmotion, dummyEmotion]; //initial state of the two instances of 'emotions'
        this.soundFragment = null;
		this.enPAuse = false; //the game starts
		Choix.INSTANCE = this; //makes the Choix class accessible
    }

    generateEmo() {
        this.emotions = [randomEmotions(), randomEmotions()]; //the function is called two times at once
        while(this.emotions[0] == this.emotions[1]) { //if the two istances are similar...
            this.emotions[1] = randomEmotions(); //then submit the second one to (re)randomization
        }
    }

    generateSound() {
		let canContinue = false; //declares a variable
		for(let emotion of emotions) {//declares a variable part of 'emotions'
			if(!emotion.hasPlayed()) {//if this variable's state is true (see the function above)...
				canContinue = true; //... canContinue changes to true
			}
		}
		
		if(canContinue) { //if 'canContinue' becomes true...
			this.soundFragment = Math.floor(Math.random()*2); //...randomizes selection in relation to one of the two displayed 'emotions'
			let player = ReactDOM.findDOMNode(this).querySelector("#emotionPlayer");//declares a variable targeting the respective ided element
			player.setAttribute("src", this.emotions[this.soundFragment].getAudio());//sets its attributes 'src' linked to the respective audio chunk path... 
			player.play();//... and plays it (element.play() => predefined JS function that plays a media file)
		} else {
			//console.log("%cGG", "color: red; font-size: 10em;");
			document.querySelector("#selectText").classList.add("hide");//or else, add a 'hide' class to the targetted elements
			document.querySelector("#endText").classList.remove("hide");// -"-
		}
		Timer.INSTANCE.freeze(); //recovers and calls/triggers the 'freeze()' function from the 'Timer' component 
    }

    updateState() {
        this.setState({
            emotions: this.emotions, //changes the state of 'emotions' from [dummyEmotion] to randomEmotions()
            soundFragment: this.soundFragment// changes the state of 'soundFragment' from null to Math.floor(Math.random()*2)
        });
    }

    launch() { //gathers and calls the respective functions at once
        this.generateEmo();
        this.generateSound();
        this.updateState();
    }

    start() {
        this.launch();
        let thisdom = ReactDOM.findDOMNode(this); //targets all elements containing 'this.'
        thisdom.querySelector("#arrowPlay").classList.add("hide"); //specific selection from the aforementioned gathering; includes or deletes classes
        thisdom.querySelector("#play").classList.remove("hide");
        thisdom.querySelector("#choix_gen_js").classList.remove("hide");
        thisdom.querySelector("#mid").classList.add("hide");
        document.body.querySelector("#rules").classList.add("hide");
        document.body.querySelector("#txtrgl").classList.add("hide");
        document.body.querySelector('#controls').classList.remove("hide");
		Timer.INSTANCE.init(); //recovers and calls/triggers the 'init()' function from the 'Timer' component 
		
    }

    validate(i) {
        if(!Timer.INSTANCE.isPaused()) {//if Timer.INSTANCE is NOT paused (see the function isPaused() from Timer.js)...
            let answer = document.querySelector("#answer");// declares a variable targeting the respective ided JSX element
            answer.classList.remove("invisible");
            if(i == this.soundFragment) {//if the validate() function is triggered bi the correct 'emotions'-'audio' pair then...
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
                btn.blur(); //predefined JS function that removes keyboard focus from the current element
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
        if(!Timer.INSTANCE.isPaused()) {//if Timer.INSTANCE is NOT paused...
            document.getElementById("emotionPlayer").play();//...plays the media file
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
                        <button onClick={()=>this.exitDefinition()} className="btn exit m-2">x</button> {/*listener triggers/calls the respective function */}
                        <div className="text-warning p-2">
                            <legend>{this.emotions[0].getName()} :</legend> {/*display a relative emotion's name using the respective returning function*/}
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


