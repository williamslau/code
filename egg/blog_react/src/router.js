import React, {Component} from 'react';

// import {HashRouter as Router,Route,Switch} from 'react-router-dom';
import {Router as Router, Route, Switch} from 'react-router-dom';
import Home from './pages/home';
import Admin from './pages/admin'
import createHistory from 'history/createHashHistory';
const history = createHistory();
history.listen(loc => {
    if (loc.pathname === '/admin' && !sessionStorage.getItem('username')) {
        history.push('/');
    }
});
// HashRouter 内置了history hashHistory
export default class Routers extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/admin" component={Admin}/>
                </Switch>
            </Router>
        )
    }
}


