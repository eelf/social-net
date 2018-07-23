import React from 'react';
import Route from './misc/Route'
import Transport from "./misc/Transport";

export default class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    }
    renderRow = (msg) => {
        console.log('Timeline.row', msg);
        let hashRegex = /(#[^ ]+)/g

        let dt = new Date(msg.Ts / 1e6);

        let msg_parts = msg.Text.split(hashRegex).map(part => {
            if (hashRegex.test(part)) {
                let hash = part.substr(1);
                return <a href="#" onClick={e => {this.go('/timeline/hash/' + hash); e.preventDefault();}}>{part}</a>;
            } else {
                return part;
            }
        });

        return <div className="timeline_event">
            <div className="timeline_username">
                <a href={Route.pageToUrl(Route.PAGE_PROFILE, [msg.UserId])}
                   onClick={e => Route.go(Route.PAGE_PROFILE, [msg.UserId], e)}>{msg.UserName}</a>
            </div>
            <div className="ts">{dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()}</div>
            <div className="timeline_msg">{msg_parts}</div>
        </div>;
    }

    handleSend() {
        Transport.sendReq("REQUEST_ADD_TO_TIMELINE", {Text: this.state.text}, (reply) => {
            console.log("Add to timeline: ", reply)
        })
    }

    handleChange(e) {
        if (e.keyCode == 13) {
            this.handleSend();
            e.target.value = '';
        }
        this.setState({text:e.target.value})
    }

    render() {
        return <div className="timeline" id="timeline">
            <div className="timeline_form">
                <b>How you are feeling today?</b>
                <textarea onChange={this.handleChange}>{this.state.text}</textarea>
                <button onClick={this.handleSend}>Send</button>
            </div>

            <div className="timeline_texts" id="timeline_texts">
                {this.props.d.Messages.map(this.renderRow)}
            </div>
        </div>;
    }
}
