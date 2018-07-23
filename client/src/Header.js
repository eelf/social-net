import React from 'react';

import Route from './misc/Route'

export default class Header extends React.Component {
    getSimpleUrlHandler(page) {
        if (!this.handlers) this.handlers = {};
        if (!this.handlers[page]) this.handlers[page] = (ev) => {
            Route.go(page, [], ev);
        };
        return this.handlers[page];
    }

    render() {
        return <div className="header-wrapper">
            <div className="container">
                <ul>
                    <li><a href={Route.pageToUrl(Route.PAGE_TIMELINE)}
                           onClick={this.getSimpleUrlHandler(Route.PAGE_TIMELINE)}>Timeline</a></li>
                    <li><a href={Route.pageToUrl(Route.PAGE_PROFILE)}
                           onClick={this.getSimpleUrlHandler(Route.PAGE_PROFILE)}>Profile</a></li>
                    <li><a href={Route.pageToUrl(Route.PAGE_MESSAGES)}
                           onClick={this.getSimpleUrlHandler(Route.PAGE_MESSAGES)}>Messages</a></li>
                    <li><a href={Route.pageToUrl(Route.PAGE_FRIENDS)}
                           onClick={this.getSimpleUrlHandler(Route.PAGE_FRIENDS)}>Friends
                        <span id="friends_badge"
                              style={{display: 'none'}}></span></a>
                    </li>
                    <li><a href={Route.pageToUrl(Route.PAGE_USERSLIST)}
                           onClick={this.getSimpleUrlHandler(Route.PAGE_USERSLIST)}>Users</a></li>
                </ul>
                <div className="login_info">
                    <span id="status" style={{color: this.props.connection ? 'green' : 'red'}}>•</span>
                    <span className="logged_as">Logged in as <b>{this.props.name}</b></span>
                    [<a href={Route.pageToUrl(Route.PAGE_LOGOUT)}
                        onClick={this.getSimpleUrlHandler(Route.PAGE_LOGOUT)}>logout</a>]
                </div>
            </div>
        </div>;
    }
}
