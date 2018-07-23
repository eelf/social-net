
class Messages extends React.Component {
    render() {
        return <div className="messages" id="messages">
            <div className="users" id="users">
                <!--<div class="user">
                    userName1
                </div>
            --></div>
            <div className="messages_texts" id="messages_texts">
                <div id="message-content"></div>
                <div className="message_form">
                    <b>Write message:</b>
                    <textarea id="msg"></textarea>
                    <button id="send_msg">Send</button>
                </div>
            </div>
        </div>
    }
}