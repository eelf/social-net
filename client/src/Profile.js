import React from 'react';
import Route from './misc/Route'
import Transport from "./misc/Transport";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.SEX_TYPES = {
            1: 'Male',
            2: 'Female'
        }

        this.FAMILY_POSITION_TYPE = {
            1: 'Single',
            2: 'Married'
        }
    }
    inp(name, title, value) {
        return <tr><td><b>{title || name}</b></td>
                <td><input name={name} value={value} /></td></tr>;
    }
    inpdate(name, title, value) {
        let parts = value.split(/\-/g),
            day = +parts[2],
            month = +parts[1],
            year = (+parts[0]) || 1980;

        let range = (b, e, s) => {
            let r = {};
            for (let i = b; i <= e; i += s) r[i] = i;
            return r;
        };
        let days = range(1, 31, 1);

        let years = range(1800, (new Date()).getFullYear(), 1);

        let months = {
            1: 'Jan',
            2: 'Feb',
            3: 'Apr',
            4: 'Mar',
            5: 'May',
            6: 'Jun',
            7: 'Jul',
            8: 'Aug',
            9: 'Sep',
            10: 'Oct',
            11: 'Nov',
            12: 'Dec'
        };

        return <tr><td><b>{title || name}</b></td><td>
            {this.sel('Birthdate.Day', day, days)}
            {this.sel('Birthdate.Month', month, months)}
            {this.sel('Birthdate.Year', year, years)}
            </td></tr>;
    }

    sel(name, value, options) {
        return <select name={name}>
            {Object.keys(options).map(k => {
                let opts = {};
                if (value == k) opts['selected'] = null;
                return <option value={k} {...opts}>{options[k]}</option>
                }
            )}</select>;
    }
    seltd(name, title, value, options) {
        return <tr><td><b>{title || name}</b></td><td>{this.sel(name, value, options)}</td></tr>;
    }

    renderEditable() {
        return <form id="update_profile"><table>
            {this.inp('Name', null, this.props.d['Name'])}
            {this.inpdate('Birthdate', 'Birthdate', this.props.d['Birthdate'])}
            {this.seltd('Sex', 'Sex', this.props.d['Sex'], this.SEX_TYPES)}
            {this.inp('CityName', 'City')}
            {this.seltd('FamilyPosition', 'Position', this.props.d['FamilyPosition'], this.FAMILY_POSITION_TYPE)}
            <tr><td><b>Avatar</b></td><td><input type="file" id="profile_avatar" aonchange="handleAvatarUpload(this.files)" /></td></tr>
            <tr><td colspan="2"><input type="submit" value="Save" aonclick="return updateProfile()" /></td></tr>
            </table></form>;

    }
    render() {
        let editable = this.props.user_id == this.props.d.UserId;
        let content = editable ? this.renderEditable() : 'hi';
        return <div className="profile" id="profile">{content}
        </div>;
    }
}
