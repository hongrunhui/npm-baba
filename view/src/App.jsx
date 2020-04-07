import * as React from 'react';
import logo from './logo.svg';
import cytoscape from 'cytoscape';
import sbgnStylesheet from 'cytoscape-sbgn-stylesheet';
import './App.css';
import Tree from './Tree.jsx';
class App extends React.Component {
    componentDidMount() {

    }
    render() {
        return (
            <div className="App" id="app">
                <Tree/>
            </div>
        )
    }
}

export default App;
