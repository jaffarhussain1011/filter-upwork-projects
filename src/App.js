import React from "react";
import { Container, Typography, Button, FormControlLabel, Switch } from "@mui/material";
import { Grid, List, ListItem, ListItemText, IconButton } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      countries: [],
      upwork: false,
      isLoading: true
    }
  }

  handleChange = (event) => {
    this.filterProjects({ country: event.target.value, checked: event.target.checked });
  };

  render() {
    return (
      <div className="App">
        <Container>
          {(!this.state.upwork) && <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Works only on upwork tab

          </Typography>}
          {this.state.upwork && <Grid item xs={12} md={6}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              Countries List From Current Page

            </Typography>
            {this.state.isLoading && <div>
              <LinearProgress color="secondary" />
              <LinearProgress color="success" />
              <LinearProgress color="inherit" />
            </div>}
            <List >
              {this.state.countries.map(country =>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <Switch value={country} defaultChecked onChange={this.handleChange} />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={country}
                  />
                </ListItem>
              )}
            </List>
          </Grid>}

        </Container>
      </div>
    );
  }
  handleMessage(response) {
    // Handle received messages
    if (response.countries) {
      this.setState({ countries: response.countries, isLoading: false });
    }

  }
  componentDidMount() {
    // check if its upwork url
    window.chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
      const pattern = /upwork\.com/
      if (pattern.test(currentTab.url)) {
        this.setState({ upwork: true });
      }

    })
    // Add listener when component mounts
    this.getCountryList()
    window.chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }
  componentWillUnmount() {
    // Remove listener when this component unmounts
    window.chrome.runtime.onMessage.removeListener(this.handleMessage);
  }
  getCountryList() {
    window.chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
      window.chrome.tabs.sendMessage(currentTab.id, { "action": "getCountryList" })
    });
  }

  filterProjects(data) {
    window.chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
      window.chrome.tabs.sendMessage(currentTab.id, { ...data, "action": "filterProjects" })
    });
  }
}


export default App;
