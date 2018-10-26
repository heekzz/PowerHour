import React from 'react';

export default class ToggleButton extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            checked: props.defaultChecked !== undefined ? props.defaultChecked : true // Default checked
        }
    }

    toggle() {
        this.setState({ checked: !this.state.checked }, () => {
            if (this.props.onToggle)
                this.props.onToggle(this.state.checked);
            console.log(this.state.checked)

        });
    }

    render() {
        return (
            <div className='toggle-wrapper'>
                <label className="switch">
                    <input type="checkbox" value={this.state.checked} onChange={this.toggle} checked={this.state.checked ? 'checked' : ''}/>
                    <span className="slider round" />
                </label>
            </div>
        )
    }
}