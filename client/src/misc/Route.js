import Event from "./Event";
import FastRoute from 'fast-route';

export default new class Route {
    constructor() {
        this.PAGE_LOGIN = 'login';
        this.PAGE_TIMELINE = 'timeline';
        this.PAGE_PROFILE = 'profile';
        this.PAGE_MESSAGES = 'messages';
        this.PAGE_FRIENDS = 'friends';
        this.PAGE_USERSLIST = 'users_list';
        this.PAGE_LOGOUT = 'logout';

        this.route = new FastRoute;
        this.route.addRoute('GET', '/', this.PAGE_TIMELINE);
        this.route.addRoute('GET', '/timeline', this.PAGE_TIMELINE);
        this.route.addRoute('GET', '/profile', this.PAGE_PROFILE);
        this.route.addRoute('GET', '/profile/{user_id:string}', this.PAGE_PROFILE);

        window.addEventListener('popstate', this.popstate, false);
    }

    pageToUrl(page, args) {
        if (page === this.PAGE_TIMELINE) return '/timeline';
        else if (page === this.PAGE_PROFILE) {
            console.log('Route.pageToUrl', page, args);
            let s = '/profile' + (args && args[0] ? ('/' + args[0]) : '');
            console.log(s);
            return s;
        }
        else if (page === this.PAGE_LOGOUT) return '/logout';
        return '/';
    }

    urlToPage(url) {
        let result = this.route.dispatch('GET', url);
        console.log('urlToPage', url, result);
        if (result.status === 200) {
            return {page: result.handler, args: Object.values(result.params || {})};
        }
        return {page: this.PAGE_TIMELINE, args: []};
    }

    popstate = popsev => {
        console.log('popstate', popsev);
        let page = popsev.state && popsev.state.page || 'init';
        let args = popsev.state && popsev.state.args || [];
        console.log('popstate', page, args);

        Event.emit('PAGE', page, args);
    }

    go = (page, args, e) => {
        console.log('go', this, page, args);
        history.pushState({page: page, args: args}, 'vbambuke: ' + page, this.pageToUrl(page, args));
        this.popstate({state: {page: page, args: args}});
        if (e && e.preventDefault) e.preventDefault();
    }
}
