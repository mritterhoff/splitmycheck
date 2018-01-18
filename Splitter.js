import React from 'react'

import {StringInput, PriceInput} from './Inputs.js'

class Splitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      people: [],
      dishes: [],
      orders: [],
      tip: 0,
      tax: 0
    };
  }

  componentWillMount() {
    this.addPerson();
    this.addPerson();
  }
  
  addPerson() {
    console.log('adding person...');
    this.setState((prevState) => ({
      people: [...prevState.people, `Person ${(prevState.people.length + 1)}`]
    }));
  };
  removeLastPerson() {
    console.log('removing person...');
    this.setState((prevState) => ({
      people: prevState.people.slice(0, prevState.people.length - 1)
    }));
  };
  
  render() {
    return (
      <div>
        <button onClick={() => this.addPerson()}>
          Add Person
        </button>
        <button onClick={() => this.removeLastPerson()}>
          Remove Person
        </button>
        <Grid allProps={this.state} />
      </div>
    );
  }
}

function _th(props) {
  return (
    <div className="th">{props.children}</div>
  );
}

function _td(props) {
  return (
    <div className="td">{props.children}</div>
  );
}

function _tr(props) {
  return (
    <div className="tr">{props.children}</div>
  );
}

function getNamesHeader(people) {
  let key = 0;
  let out = [<_th key={key++}/>, <_th key={key++}/>];
  people.forEach((el) => {
    out.push(<_th key={key++}>
       <StringInput initalValue = {el}/>
    </_th>);
  });

  return (
    <div className="thead"> 
      {out}
    </div>
  );
}

function getTotalRow(allProps) {
  return <div/>;

}


function getOrderRows(allProps) {
  let people = allProps.people;

  let ordersLength = 4;
  let rows = new Array();
  let i = 0;
  for (let i = 0; i < ordersLength; i++) {
    let newRow = [
      <_td key={'dn'+i}>
        <StringInput initalValue = {`Dish ${i}`}/>
      </_td>,
      <_td key={'da'+i}>
        <PriceInput/>
      </_td>
    ];
    let key = 0;
    people.forEach((el) => {
      newRow.push(
        <_td key={`${i}${key++}`}>
          {`${el}'s ${i}`}
        </_td>);
    });

    // push here would just concat
    rows.push(<_tr key={`r${i}`}>{newRow}</_tr>);
  }
  
  return rows;
}


class Grid extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tableContainer">
      
        <div className="table">
          {getNamesHeader(this.props.allProps.people)}

          <div className="tbody">
            {getOrderRows(this.props.allProps)}
            {getTotalRow(this.props.allProps)}
          </div>
        </div>
      </div>
    );
  }
}


export default Splitter;