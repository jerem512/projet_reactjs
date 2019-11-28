import React from 'react';
import ReactDOM from 'react-dom';
import './Choix.css'

let emotions = ['emo1', 'emo2', 'emo3', 'emo4'];
let soundFragments = ['soundEx1', 'soundEx2', 'soundEx3', 'soundEx4', 'soundEx5', 'soundEx6', 'soundEx7', 'soundEx8', 'soundEx9']
    
let soundIco = {
    icoSrcON: './media/icoAudio.png',
    icoSrcOFF: './media/icoNoAudio.png'
}

function randomEmotions() {
    return emotions[Math.floor(Math.random() * emotions.length)]
}

function randomSound() {
    return soundFragments[Math.floor(Math.random() * soundFragments.length)]
}

class Choix extends React.Component {
    
    constructor(props) {
        super(props);
        this.emotion = [null, null];
        this.soundFragment = null;
    }

    generateEmo() {
        this.emotion = [randomEmotions(), randomEmotions()];
        while(this.emotion[0] == this.emotion[1]) {
            this.emotion[1] = randomEmotions();
        }
    }

    generateSound() {
        this.soundFragment = randomSound();
    }

    updateState() {
        this.setState({
            emotions: this.emotions,
            soundFragment: this.soundFragment
        });
    }

    getSndFrg() {
        return this.soundFragment;
    }

    render() {
        return (
            <div id="choix_gen_js" className="d-flex flex-row justify-content-around mr-auto ml-auto">
                <div>
                    <h2>Réponse une</h2>
                    <button type="button" className="choix_sec_js btn btn-primary btn-lg btn-block mr-5">
                        <p className="BscEmo">{this.emotion[0]}</p>
                        <p className="CpxEmo"></p>
                    </button>
                </div>
                <div>
                    <h2>Réponse deux</h2>
                    <button type="button" className="choix_sec_js btn btn-primary btn-lg btn-block">
                        <p className="BscEmo">{this.emotion[1]}</p>
                        <p className="CpxEmo"></p>
                    </button>
                </div>
                
                <div id="functions" className="d-flex flex-column mr-auto ml-auto">
                <button type="button" id="playButt" className="btn btn-primary btn-lg btn-block" onClick={() => {this.generateEmo(); this.generateSound(); this.updateState();}}>Jouer</button>
                <div id="soundLogo">
                    <img src={soundIco.icoSrcON} alt="logo"/>
                    <div>{"Hello world " + this.soundFragment}</div>
                </div>
            </div>
            </div>
            
        )
    }
}

ReactDOM.render(<Choix/>, document.getElementById('choix_html'));


