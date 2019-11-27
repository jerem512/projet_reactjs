import React from 'react';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {addClass: false}
    }
    toggle() {
        this.setState({addClass: !this.state.addClass});
    }
    render() {

        let boxClass = ["box"];
        if(this.state.addClass) {
            boxClass.push('hide');
        }
        let divClass = ["backdiv"];
        if(this.state.addClass) {
            divClass.push('hide');
        }
        let pClass = ["paragraphe"];
        if(this.state.addClass) {
            pClass.push('show');
        }
        return(


            <div>
                <div  className={ divClass.join(' ')} onClick={this.toggle.bind(this)}>
                    <div className={ boxClass.join(' ')} onClick={this.toggle.bind(this)}>
                        <p className="jouer">JOUER</p>
                    </div>
                </div>
                <div>
                    <p>code de Andrei</p>
                </div>
            </div>

        );

    }
}
export default App;
