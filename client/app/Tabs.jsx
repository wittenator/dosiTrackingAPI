import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import BasicTable from './Table.jsx'
import DividerExampleForm from './Forms.jsx'

const TabsExample = () => (
  <Tabs>
    <Tab
      icon={<FontIcon className="material-icons">phone</FontIcon>}
      label="ANWESENHEIT">
        <div>
            <h2>
            Hello from the other siiiiiide!
            </h2>
            <BasicTable />
        </div>
    </Tab>
    <Tab
      icon={<MapsPersonPin />}
      label="DASHBOARD">
        <div>
            <DividerExampleForm />
        </div>
    </Tab>
  </Tabs>
);

export default TabsExample;
