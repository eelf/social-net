import Event from './Event'

export default new class Transport {
    seqId = 0
    websocket = null
    connected = false
    pendingRequests = []
    rcvCallbacks = {}
    connectTimeout = null

    onMessage = (evt) => {
        let reply = JSON.parse(evt.data);

        console.log('Transport.get', reply);

        if (this.rcvCallbacks[reply.SeqId]) {
            this.rcvCallbacks[reply.SeqId](reply);
            delete this.rcvCallbacks[reply.SeqId];
        } else {
            Event.emit(reply.Type, reply);
        }
        /*
        if (reply.Type == 'EVENT_ONLINE_USERS_LIST') {
            for (var i = 0; i < reply.Users.length; i++) {
                onUserConnect(reply.Users[i])
            }
        } else if (reply.Type == 'EVENT_USER_CONNECTED') {
            onUserConnect(reply)
        } else if (reply.Type == 'EVENT_USER_DISCONNECTED') {
            onUserDisconnect(reply)
        } else if (reply.Type == 'EVENT_NEW_MESSAGE') {
            onNewMessage(reply)
        } else if (reply.Type == 'EVENT_NEW_TIMELINE_EVENT') {
            onNewTimelineEvent(reply)
        } else if (reply.Type == 'EVENT_FRIEND_REQUEST') {
            showNotification("User wants to add you to friends")
            friendsRequestsCount++
            redrawFriendsRequestCount()
        } else {
                if (reply.Type == 'REPLY_ERROR') {
                    showError(reply.Message)
                }
            }
        }

        redrawUsers()
        */
    }

    sendReq = (reqType, reqData, replyCb) => {
        let cb = () => {
            let msg = reqType + " " + this.seqId + "\n" + JSON.stringify(reqData);

            console.log('Transport.send', msg);

            this.websocket.send(msg);
            this.rcvCallbacks[this.seqId] = replyCb;
            this.seqId++;
        };

        if (this.connected) {
            cb();
        } else {
            if (!this.connectTimeout) {
                this.connectTimeout = setTimeout(this.setWebsocketConnection, 0);
            }
            this.pendingRequests.push(cb);
        }
    }


    setWebsocketConnection = () => {
        let uri = "ws" + (window.location.protocol.indexOf("https") >= 0 ? "s" : "") + "://" + window.location.host + "/events";
        this.websocket = new WebSocket(uri);
        this.websocket.onopen = (evt) => {

            console.log('Transport.connect');

            this.connected = true;
            Event.emit('CONNECTED');

            this.pendingRequests.forEach(cb => cb());
        };
        this.websocket.onclose = (evt) => {
            console.log('Transport.close');

            this.pendingRequests = [];
            this.connected = false;
            Event.emit('DISCONNECTED');

            this.connectTimeout = setTimeout(this.setWebsocketConnection, 1000);
        }
        this.websocket.onmessage = this.onMessage;
        this.websocket.onerror = (evt) => {
            console.log("WebSocket Error: ", evt);
        };
    }

    ajaj(method, url, data, cb, errCb, ctx)  {
        let x = new XMLHttpRequest();

        x.open(method, url);
        x.ontimeout = (...a) => errCb.call(ctx, 'timeout', a);
        x.onerror = (...a) => errCb.call(ctx, 'ajaj error', a);
        x.onload = function () {
            try {
                x.responseJson = JSON.parse(x.response);
            } catch (e) {
                errCb.call(ctx, 'json.parse failed', e, x.response);
                return;
            }
            cb.call(ctx, x.responseJson);
        };
        x.withCredentials = true;
        if (data !== null) {
            x.setRequestHeader('Content-Type', 'application/json');
            x.send(JSON.stringify(data));
        } else {
            x.send();
        }
    }
}
