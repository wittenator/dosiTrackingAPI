import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TabsExample from './Tabs.jsx';
import BasicTable from './Table.jsx'
 
injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <TabsExample />
  </MuiThemeProvider>
);
 
ReactDOM.render(
  <App />,
  document.getElementById('app')
);





