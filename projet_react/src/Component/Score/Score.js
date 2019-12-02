import React from 'react';
import ReactDOM from 'react-dom';
import './Score.css';


class Compteur extends React.Component {
    
    static INSTANCE;

    constructor() {
        super()
        this.state = {
            nb: 0,
        }
        this.multiplier = 1;
        this.combo = 0;

        Compteur.INSTANCE = this;
    }

    increment() {
		this.combo ++;
		this.multiplier = Math.pow(2, Math.min(this.combo - 1, 3));
		this.setState({
			nb: this.state.nb + 1 * this.multiplier    
		});
    
}

    decrement() {
        this.combo = 0;
        this.multiplier = 1;
		this.setState({
            nb: this.state.nb
        });
    }

    render() {
        return (
            <div className="score_compteur">
                <p>
                Score(x{this.multiplier}) : {this.state.nb}
                </p>
            </div>
        )
    }
}


ReactDOM.render(<Compteur />, document.getElementById('score'));

export default Compteur;
