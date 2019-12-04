import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'; 
import App from './Component/App/App';  //header component
import * as serviceWorker from './serviceWorker';

//displays the App component (centralizing all other components)

ReactDOM.render(<App />, document.getElementById('app'));

serviceWorker.unregister();
