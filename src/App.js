import React, { useState, useEffect } from "react";
import { Container, Typography, Switch } from "@mui/material";
import { Grid, List, ListItem, ListItemText, IconButton } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

function App() {
  const [countries, setCountries] = useState([]);
  const [upwork, setUpwork] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [storedData, setStoredData] = useState();

  useEffect(() => {
    // check if it's upwork url
    window.chrome.tabs.query(
      { active: true, currentWindow: true },
      ([currentTab]) => {
        const pattern = /upwork\.com/;
        if (pattern.test(currentTab.url)) {
          setUpwork(true);
        }
      }
    );

    // Add listener when component mounts
    getCountryList();
    window.chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      // Remove listener when this component unmounts
      window.chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []); // Empty array as the second argument for componentDidMount effect

  const handleMessage = (response) => {
    console.log(response, "logging for handleMessage");
    // Handle received messages
    if (response.countries) {
      setCountries(response.countries);
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    setStoredData({
      ...storedData,
      [`${event.target.value}`]: event.target.checked,
    });
    console.log(storedData, event.target.value, "handleChange");
    chrome.runtime &&
      chrome.runtime.sendMessage(
        {
          type: "COUNTRY_STORE",
          data: { country: event.target.value, checked: event.target.checked },
        },
        (response) => {
          console.log(response);
        }
      );
    filterProjects({
      country: event.target.value,
      checked: event.target.checked,
    });
  };

  const getCountryList = () => {
    chrome.runtime &&
      chrome.runtime.sendMessage(
        {
          type: "COUNTRY_STORED",
        },
        (response) => {
          console.log(response, "getCountry");
          setStoredData(response);
        }
      );
    window.chrome.tabs.query(
      { active: true, currentWindow: true },
      ([currentTab]) => {
        window.chrome.tabs.sendMessage(currentTab.id, {
          action: "getCountryList",
        });
      }
    );
  };

  const filterProjects = (data) => {
    window.chrome.tabs.query(
      { active: true, currentWindow: true },
      ([currentTab]) => {
        window.chrome.tabs.sendMessage(currentTab.id, {
          ...data,
          action: "filterProjects",
        });
      }
    );
  };
  console.log(storedData, "stored data");
  console.log(countries, "list of countries from upwork page");

  const isChecked = (c) => {
    if (storedData && storedData.hasOwnProperty(c)) {
      console.log(storedData[c], "c data");
      return storedData[c];
    } else {
      return true;
    }
  };

  return (
    <div className="App">
      <Container>
        {!upwork && (
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Works only on upwork tab
          </Typography>
        )}
        {upwork && (
          <Grid item xs={12} md={6}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              Countries List From Current Page
            </Typography>
            {isLoading && (
              <div>
                <LinearProgress color="secondary" />
                <LinearProgress color="success" />
                <LinearProgress color="inherit" />
              </div>
            )}
            <List>
              {countries.map((country) => (
                <ListItem
                  key={country}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <Switch
                        value={country}
                        checked={isChecked(country)}
                        // defaultChecked
                        onChange={handleChange}
                      />
                    </IconButton>
                  }
                >
                  <ListItemText primary={country} />
                </ListItem>
              ))}
            </List>
          </Grid>
        )}
      </Container>
    </div>
  );
}

export default App;
