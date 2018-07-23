import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Transport from './misc/Transport'
import Event from './misc/Event'
import Route from './misc/Route'

import Header from './Header'
import Error from './Error'
import Notification from './Notification'
import Onlines from './Onlines'

import LoginRegister from './LoginRegister'

import Timeline from './Timeline'
import Profile from './Profile'

var DEFAULT_TIMELINE_LIMIT = 10;

class App extends Component {
    constructor() {
        super();
        this.state = {
            page: null,
            page_data: null,
            login_err: null,
            connection: false,
            name: '',
            user_id: 0,
        };

        Transport.ajaj('GET', '/init', {}, this.handleInit, this.handleError);

        Event.on('CONNECTED', () => this.setState({connection: true}));
        Event.on('DISCONNECTED', () => this.setState({connection: false}));
        Event.on('PAGE', (page, args) => {
            console.log('event page', page, args);
            if (page === Route.PAGE_TIMELINE) {
                Transport.sendReq("REQUEST_GET_TIMELINE", {Limit: DEFAULT_TIMELINE_LIMIT + 1}, this.handleTimeline);
            } else if (page === Route.PAGE_PROFILE) {
                if (args && args[0]) {
                    Transport.sendReq("REQUEST_GET_PROFILE", {UserId: args[0]}, this.handleProfile);
                } else {
                    Transport.sendReq("REQUEST_GET_PROFILE", {UserId: "" + this.state.user_id}, this.handleProfile);
                }
            }
        });

        if (false) this.setupEndlessScroll();
    }

    setupEndlessScroll() {
        window.onscroll = (ev) => {
            if ((window.innerHeight + window.scrollY) < document.body.offsetHeight) {
                return;
            }

            if (isLoading) {
                return;
            }

            if (loadMoreFunc) {
                isLoading = true
                loadMoreFunc()
                isLoading = false
            }
        }
        window.onresize = window.onscroll;
    }

    handleInit = (r) => {
        console.log('handleInit', r);
        if (!r.Id) {
            this.setState({page:Route.PAGE_LOGIN});
            return;
        }
        this.setState({name: r.Name, user_id: r.Id});
        let res = Route.urlToPage(location.pathname);
        console.log('handleInit urlToPage', res);
        Route.popstate({state: res});
    }

    handleTimeline = (r) => {
        console.log('handleTimeline', r);
        this.setState({page:Route.PAGE_TIMELINE, page_data: r});
    }

    handleProfile = (r) => {
        console.log('handleProfile', r);
        this.setState({page:Route.PAGE_PROFILE, page_data: r});
    }

    handleLogin = (d) => {
        console.log('handleLogin', d);
        Transport.ajaj('POST', '/login', d,
            j => {
                if (j.ok) {
                    this.setState({page: Route.PAGE_TIMELINE, page_data: {Messages:[]}, login_err: null});
                }
                if (j.error) {
                    this.setState({login_err: j.error});
                }
            }, this.handleError
        );
    }

    handleError = (...a) => {
        console.log('handleError', a);
    }

    renderLoading() {
        return <div>
            <div id="loading"></div>
            <div id="loading_overlay">Loading...</div>
        </div>;
    }

    renderUnauth() {
        return <LoginRegister login={this.handleLogin} err={this.state.login_err}/>;
    }

    render() {
        if (this.state.page === null) return this.renderLoading();

        if (this.state.page == Route.PAGE_LOGIN) return this.renderUnauth();

        let page;
        if (this.state.page == Route.PAGE_MESSAGES) page = <Messages/>;
        else if (this.state.page == Route.PAGE_TIMELINE) page = <Timeline d={this.state.page_data}/>;
        else if (this.state.page == Route.PAGE_FRIENDS) page = <Friends/>;
        else if (this.state.page == Route.PAGE_USERSLIST) page = <UserList/>;
        else if (this.state.page == Route.PAGE_PROFILE) page = <Profile d={this.state.page_data} user_id={this.state.user_id}/>;

        console.log('header rendering');
        let header = <Header connection={this.state.connection} name={this.state.name}/>;
        console.log('header rendered');

        return <div>
            {header}
            <Error/>
            <Notification/>
            <Onlines/>
            <div className="content">{page}</div>
        </div>;
    }

}

ReactDOM.render(<App />, document.getElementById('react_root'));
