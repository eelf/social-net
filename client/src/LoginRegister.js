import React from 'react';

export default class LoginRegister extends React.Component {
    constructor() {
        super();
        this.state = {
            page: 'login',
            login_email: '',
            login_password: '',
        };
    }

    handleSubmitLogin = ev => {
        this.props.login({email: this.state.login_email, password: this.state.login_password});
        ev.preventDefault();
        ev.stopPropagation();
    }

    renderLoginForm() {
        return <form onSubmit={this.handleSubmitLogin}>
            {this.props.err}
            <div>E-mail: <input type="text" name="email" value={this.state.login_email}
                                onChange={e => {
                                    this.setState({login_email: e.target.value})
                                }}/></div>
            <div>Password: <input type="password" name="password" value={this.state.login_password}
                                  onChange={e => this.setState({login_password: e.target.value})}/></div>
            <div><input type="submit" value="Login"/></div>
        </form>;
    }

    renderRegisterForm() {
        return <form action="/do-register" method="POST">
            <table>
                <tr>
                    <td>Name:</td>
                    <td><input type="text" name="name"/></td>
                </tr>
                <tr>
                    <td>E-mail:</td>
                    <td><input type="text" name="email"/></td>
                </tr>
                <tr>
                    <td>Password:</td>
                    <td><input type="password" name="password"/></td>
                </tr>
                <tr>
                    <td>Repeat Password:</td>
                    <td><input type="password" name="password2"/></td>
                </tr>
                <tr>
                    <td colSpan="2">
                        <div style={{textAlign: 'right'}}><input type="submit" value="Register"/></div>
                    </td>
                </tr>
            </table>
        </form>
    }

    render() {
        let page = this.state.page == 'login' ? this.renderLoginForm() : this.renderRegisterForm();
        return <div>
            <h2><span className="link" onClick={() => this.setState({page: 'login'})}>Login</span>
                {' '}/{' '}
                <span className="link" onClick={() => this.setState({page: 'register'})}>Register</span></h2>
            {page}
        </div>;
    }
}
