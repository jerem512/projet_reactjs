import React from 'react';
import ReactDOM from 'react-dom';
import './Score.css';

class Compteur extends React.Component {
    
    constructor() {
        super()
        this.state = {
            nb: 0,
        }
        this.multiplier = 1;
        this.combo = 0;
    }

    increment() {
        /*if(this.multiplier < 8) {
            this.combo ++;
            if(this.combo == 2) {
                this.combo = 0;
                this.multiplier *= 2;
            }
        }*/
        this.combo ++;
        this.multiplier = Math.pow(2, Math.min(this.combo - 1, 3));
        //this.multiplier = Math.pow(2, this.combo - 1);
        this.setState({
            nb: this.state.nb + 1 * this.multiplier    
        });
    }

    decrement() {
        this.setState({
            nb: this.state.nb - 1
        })
        this.combo = 0;
        this.multiplier = 1;
    }

    render() {
        return (
            <div className="score_compteur">
                <p>   
                Score(x{this.multiplier}) : {this.state.nb}
                </p>
                <button className="btn btn-warning" onClick={ ( ) => this.increment() }>
                    +1
                </button>
                <button className="btn btn-danger" onClick={ ( ) => this.decrement() }>
                    -1
                </button>

            </div>
        )
    }
}


ReactDOM.render(<Compteur />, document.getElementById('score'));
