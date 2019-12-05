import React from 'react';
import './Acceuil.css';
import '../App/App';
import ReactDOM from "react-dom";
import App from "../App/App";

class Acceuil extends React.Component {
	
	// Constructeur de la classe
    constructor(props) {
        super(props);
        this.state = {addClass: false}
    }
	
	// activé lorsqu'on clique sur le "JOUER"
    toggle() {
        this.setState({addClass: !this.state.addClass});
    }
	
	// fait le rendu HTML de l'élément
    render() {
        let boxClass = ["box"];
        if(this.state.addClass) {
            boxClass.push('hide');
        }
		
        let divClass = ["backdiv"];
        if(this.state.addClass) {
            divClass.push('hide');
        }
		
        return (
            <div>
                <div className={divClass.join(' ')}>
                    <div className={ boxClass.join(' ')} onClick={this.toggle.bind(this)}>
                        <p className="jouer">JOUER</p>
                    </div>
                </div>
				<div id="pauseText" className="hide">
					<p>PAUSE</p>
				</div>
            </div>
        );
    }
	
}

export default Acceuil;