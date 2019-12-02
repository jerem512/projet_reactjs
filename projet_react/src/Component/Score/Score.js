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
		this.basePts = 1;

        Compteur.INSTANCE = this;
    }

    increment() {
		this.setState({
			nb: this.state.nb + (this.basePts * this.multiplier)
		});
		this.combo ++;
		this.multiplier = Math.pow(2, Math.min(this.combo - 1, 3));
		this.basePts ++;
    
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
