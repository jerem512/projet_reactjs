import React from 'react';
import ReactDOM from 'react-dom';
import './Choix.css'

let emotions = ['emo1', 'emo2', 'emo3', 'emo4'];
    
let soundIco = {
    icoSrcON: './media/icoAudio.png',
    icoSrcOFF: './media/icoNoAudio.png'
}

let play = {
    playON: './media/icoPlay.png',
    playOFF: './media/icoStop.png'
}

let game;

function randomEmotions() {
    return emotions[Math.floor(Math.random()*emotions.length)]
}

class Choix extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            emotions: [null, null]
        };
        game = this;
    }

    generate() {
        let emotions = [randomEmotions(), randomEmotions()];
        while(emotions[0] == emotions[1]) {
            emotions[1] = randomEmotions();
        }
        this.setState({emotions: emotions});
    }

    render() {
        return (
            <div id="choix_gen_js" className="d-flex flex-row justify-content-around mr-auto ml-auto">
                <div>
                    <h2>Option 1</h2>
                    <button type="button" className="choix_sec_js btn btn-primary btn-lg btn-block mr-5">
                        <p className="BscEmo">{this.state.emotions[0]}</p>
                        <p className="CpxEmo"></p>
                    </button>
                </div>
                <div>
                    <h2>Option 2</h2>
                    <button type="button" className="choix_sec_js btn btn-primary btn-lg btn-block">
                        <p className="BscEmo">{this.state.emotions[1]}</p>
                        <p className="CpxEmo"></p>
                    </button>
                </div>
            </div>
            
        )
    }
}

class Audio_Play_js extends React.Component {
    render() {
        return (
            <div id="functions" className="d-flex flex-column mr-auto ml-auto">
                <button type="button" id="playButt" className="btn btn-primary btn-lg btn-block" onClick={() => game.generate()}>Jouer</button>
                <div id="soundLogo">
                    <img src={soundIco.icoSrcON} alt="logo"/>
                </div>
            </div>
        )
    }
}


ReactDOM.render(<Choix/>, document.getElementById('choix_html'));
ReactDOM.render(<Audio_Play_js/>, document.getElementById('audio_play_html'));


/*
let valider = {
    name: 'Valider la réponse'
}
class Valider extends React.Component {
    render() {
        return
    }
}

let expl1 = {
    name: 'Afficher l\'explication du choix 1'
}
class Expl1 extends React.Component {
    render() {
    }
}

let expl2 = {
    name: 'Afficher l\'explication du choix 2'
}
class Expl2 extends React.Component {
    render() {
    }
}

class Sound extends React.Component {
    render() {
    }
}*/


