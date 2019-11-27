import React from 'react';
import ReactDOM from 'react-dom';
import './Choix.css';

let emotions = {
    emo1: {
        name: 'emo1',
        complEmo1: ['1.1', '1.2']
    },
    emo2: {
        name: 'emo2',
        complEmo2: ['2.1', '2.2']
    },
    emo3: {
        name: 'emo3',
        complEmo3: ['3.1', '3.2']
    },
    emo4: {
        name: 'emo4',
        complEmo4: ['4.1', '4.2']
    }
}
let choix1 = { name: 'Option 1' }
let choix2 = { name: 'Option 2' }
let sound = {
    icoSrcON: './media/icoAudio.png',
    icoSrcOFF: './media/icoNoAudio.png'
}
let play = {
    playON: './media/icoPlay.png',
    playOFF: './media/icoStop.png'
}

class Choix1 extends React.Component {
    render() {
        return (
            <div className="Choix">
                <h2>{choix1.name}</h2>
                <button type="button" className="div_choix btn btn-primary btn-lg btn-block">
                    <p className="BasicEmo">{emotions.emo1.name}</p>
                    <p className="ComplEmo">{emotions.emo1.complEmo1[0]}</p>
                </button>
            </div>
        )
    }
}

class Sound extends React.Component {
    render() {
        return (
            <div>
                <img src={sound.icoSrcON}/>
            </div>
        )
    }
}

class Play extends React.Component {
    render() {
        return <button type="button" className="div_play btn btn-primary btn-lg btn-block">Jouer</button>
    }
}

class Choix2 extends React.Component {
    render() {
        return (
            <div className="Choix">
                <h2>{choix2.name}</h2>
                <button type="button" className="div_choix btn btn-primary btn-lg btn-block">
                    <p className="BasicEmo">{emotions.emo2.name}</p>
                    <p className="ComplEmo">{emotions.emo2.complEmo2[1]}</p>
                </button>
            </div>
        )
    }
}

class Valider extends React.Component {
    render() {
        return <button type="button" className="div_valider btn btn-primary btn-lg btn-block">Valider</button>
    }
}

ReactDOM.render(<Choix1/>, document.getElementById('div_choix1'));
ReactDOM.render(<Choix2/>, document.getElementById('div_choix2'));
//ReactDOM.render(<Sound/>, document.getElementById('soundLogo'));
ReactDOM.render(<Play/>, document.getElementById('play'));
ReactDOM.render(<Valider/>, document.getElementById('valider'));

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


