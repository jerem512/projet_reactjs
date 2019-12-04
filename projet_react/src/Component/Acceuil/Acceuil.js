import React from 'react';
import ReactDOM from "react-dom";

import './Acceuil.css'; 
import '../App/App';


class Acceuil extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {addClass: false} //sets the initial state => 'false' 
    }
    toggle() { //changes the initial state
        this.setState({addClass: !this.state.addClass});
    }
    render() {

        let divClass = ["backdiv"]; //declares an array variable
        if(this.state.addClass) {   //if addClass is (changed to) 'true', execute the code
            divClass.push("hide");  //inserts a value inside the divClass array
        }
        let boxClass = ["box"];     //same as above
        if(this.state.addClass) {
            boxClass.push("hide");
        }
        
        return(

            <div>
                <div className={ divClass.join(' ')}> {/*a class named "backdiv" is added (using the divClass values) that enriches by "hide" after the call/triggered of the following event listener. The two classes are set in the CSS sheet*/}
                    <div className={ boxClass.join(' ')} onClick={this.toggle.bind(this)}> {/*listener => changes the addClass state from 'false' to 'true' => executes the two 'if' forementioned*/}
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
ReactDOM.render(<Acceuil />, document.getElementById('root'));
