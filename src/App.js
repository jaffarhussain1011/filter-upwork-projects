import logo from './logo.svg';
import './App.css';
import React from 'react';
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: [],
      upwork:  false
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Countries List From Current Page
          <button onClick={this.filterProjects}>
            Retreive
          </button>
          <div >
            <ul>
              {this.state.countries.map(country => <li>{country}</li>)}
            </ul>
          </div>
        </header>
      </div>
    );
  }
  handleMessage(response) {
    // Handle received messages
    if (response.countries) {
      this.setState({ countries: response.countries });
    }
  }
  componentDidMount() {
    // Add listener when component mounts
    window.chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }
  componentWillUnmount() {
    // Remove listener when this component unmounts
    window.chrome.runtime.onMessage.removeListener(this.handleMessage);
  }
  filterProjects() {
    window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      var activeTab = tabs[0];
      console.log(activeTab);
      window.chrome.tabs.sendMessage(activeTab.id, { "action": "getCountryList" })
    });
  }
}


export default App;
