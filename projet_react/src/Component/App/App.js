import React from 'react';
//no ReactDOM.render() to display => no need for ReactDOM library

import './App.css';
import '../Acceuil/Acceuil';
import '../Choix/Choix';
import '../Timer/Timer';
import '../Score/Score';

//imports & centralizes all ReactJS components and delivers them to index.js

        //header component
        function App() {
            return (
                <div>
                    <header className="App-header">
                        <h1>Premier niveau</h1>
                    </header>
                </div>
            );
    }
export default App;
