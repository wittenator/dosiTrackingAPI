/* eslint max-len: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const ressorts = {
  0: 'Juniter',
  1: 'Quality Managment',
  2: 'Human Ressources',
  3: 'Public Relations',
  4: 'International Managment',
  5: 'Relationship Managment'
};

const products = [];

function addProducts(quantity) {
  const startId = products.length;
  for (let i = 0; i < quantity; i++) {
    const id = startId + i;
    products.push({
      id: id,
      name: 'Tim Korjakow ' + id,
      ressort: i % (Object.keys(ressorts).length),
      time: i % 29 + '.01.2016'
    });
  }
}

function enumFormatter(cell, row, enumObject) {
  return enumObject[cell];
}

addProducts(50);

export default class BasicTable extends React.Component {
  
  render() {
    const filter = {
      type: 'TextFilter'
    };

    return (
      <BootstrapTable data={ products } exportCSV={ true }>
          <TableHeaderColumn dataSort dataField='id' filter={ filter } isKey={ true }>Anwesenheit ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
          <TableHeaderColumn dataSort dataField='ressort' filterFormatted dataFormat={ enumFormatter }
            formatExtraData={ ressorts } filter={ { type: 'SelectFilter', options: ressorts } }>Ressort</TableHeaderColumn>
          <TableHeaderColumn dataS  ort dataField='time' >Ankunftszeit</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
