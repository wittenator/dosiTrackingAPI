import React from 'react';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

    const style = {
      marginLeft: 20,
    };

    var axiosinstance = axios.create({
        headers:{'Access-Control-Allow-Origin':'*', 'Content-Type':'text/plain'},
        auth:{
            username:"trollmaster",
            password:"123456"},
        withCredentials: true
    });

export default class DividerExampleForm extends React.Component{

    constructor(props) {
      super(props);
      this.state = {value: ''};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }


    handleSubmit(event) {
      event.preventDefault();
      axiosinstance.get('http://dositrackingapi.herokuapp.com/attendance')
        .then(function (response) {
        console.log(response);
        })
        .catch(function (error) {
        console.log(error);
        });
    }

    render() {
        return(
          <form onSubmit={this.handleSubmit}>
            <TextField hintText="Vorname" style={style} underlineShow={false} value={this.state.value} onChange={this.handleChange}/>
            <Divider />
            <TextField hintText="Nachname" style={style} underlineShow={false} value={this.state.value} onChange={this.handleChange}/>
            <Divider />
            <TextField hintText="Ressort" style={style} underlineShow={false} />
            <RaisedButton label="Submit" type="submit" style={style} />
          </form>
        )
    }

}

