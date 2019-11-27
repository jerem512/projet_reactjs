import React from 'react';
import ReactDOM from 'react-dom';
import './Score.css';


class Compteur extends React.Component {
    constructor() {
        super()
        this.state = {
            nb: 0,
        }
    }
 
    increment() {
        this.setState({
            nb: this.state.nb + 1
        })
    }
 
    render() {
        return (
            <div className="score_compteur">
                <p>   
                Score : {this.state.nb}
                </p>
                <button onClick={ ( ) => this.increment() }>
                    +1
                </button>
            </div>
        )
    }
}


ReactDOM.render(
    <Compteur />, 
    document.getElementById('score')
);
