import React from 'react'

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
  
  addPerson() {
    console.log('adding person...');
    this.setState((prevState) => ({
      people: [...prevState.people, "Person" + (prevState.people.length + 1)]
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
    out.push(<_th key={key++}>{el}</_th>);
  });

  return (
    <div className="thead"> 
      {out}
    </div>
  );
}

function getOrderRows(people) {
  let ordersLength = 4;
  let rows = new Array();
  let i = 0;
  while (i < ordersLength) {
    let newRow = [<_td>{`dishName${i}`}</_td>, <_td>{`DishAmount${i}`}</_td>];
    people.forEach((el) => {
      newRow.push(<_th>{`${el}'s ${i}`}</_th>);
    });

    // push here would just concat
    rows.push(<_tr>{newRow}</_tr>);
    i++;
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
            {getOrderRows(this.props.allProps.people)}
          </div>
        </div>
      </div>
    );
  }
}


export default Splitter;