import React from 'react';
import ReactDOM from 'react-dom';

import './Score.css';

class Compteur extends React.Component {

    static INSTANCE; //makes an object accesible from the outside of a component

    constructor() { //sets he initial state
        super()
        this.state = {
            nb: 0, //score = 0
        }
        this.multiplier = 1; //mutiplier => score x 1
        this.combo = 0; // No of succesive correct responses that triggers the mutiplier
        this.basePts = 1; //points won by the first correct response

        Compteur.INSTANCE = this; //makes the Compteur entirely accesible
    }

    increment() { //when it's called/triggered... in case of a correct response
        this.setState({ //changes the state of 'nb' as follows...
            nb: this.state.nb + (this.basePts * this.multiplier) //e.g. nb = 0 + ( 1 * 1 ) or nb = 0 + ( 2 + 1 ) etc.
        });
        this.combo ++; //'combo' gets incremented 
        this.multiplier = Math.pow(2, Math.min(this.combo - 1, 3)); //IN THIS CASE: the multiplier must be at least 1. Math.pow(base, exponent) => the exp Math.min() must be at least 0. 
                                                                    //having a given multiplier of 1x, 2x, 4x, 8x, they are all exponents of 2, =>exp to be used are: 0, 1, 2, 3. 
                                                                        //Math.min() selects the minimum value of a given number chain;
                                                                        //after a correct response, 'combo' sets (from 0) to 1 => Math.min(1 - 1, 3) = 0;
                                                                        //after a second succesive response, 'combo' sets (from 1) to 2 => Math.min(2 - 1, 3) = 1 ... so on ... Math.min(x - 1, 3) = 3, where x >= 3. The max value to be selected is 3 (2^3 = 8)
        this.basePts ++; //same as 'combo'
    }

    decrement() {//when is called... in case of a wrong response
        this.combo = 0;
        this.multiplier = 1;
        this.setState({
            nb: this.state.nb //remains unchanged
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