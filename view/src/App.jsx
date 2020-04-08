import * as React from 'react';
import { HashRouter, BrowserRouter, Route, Link, Switch } from "react-router-dom";
import './App.css';
import Tree from './Tree.jsx';
import Api from './Api.jsx';
class App extends React.Component {
    componentDidMount() {

    }
    render() {
        return (
            <div className="App" id="app">
                <HashRouter>
                    <Switch>
                        <Route exact path="/" component={Tree}/>
                        <Route exact path="/api" component={Api}/>
                    </Switch>
                </HashRouter>
            </div>
        )
    }
}

export default App;
