import React from 'react';
import './App.css';
import Acceuil from '../Acceuil/Acceuil';
import Choix from '../Choix/Choix';
import Timer from '../Timer/Timer';
import Score from '../Score/Score';

function App() {
	return (
		<div>
			<Acceuil />
			<Choix />
			<Timer />
			<Score />
		</div>
	);
}

export default App;
