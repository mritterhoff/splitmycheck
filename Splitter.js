import React from 'react'

import {StringInput, PriceInput} from './Inputs.js'

class Dish {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

function clone2D(a) {
  return a.map(o => [...o]);
}

// class Order {
//   constructor(personIndex, dishIndex) {
//     this.pInd = personIndex;
//     this.dInd = dishIndex;
//   }
// }

class Splitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // list of people
      people: [],

      // list of {name, price} dish objects
      dishes: [],

      // 2d array of booleans
      // orders[dInd][pInd]
      orders: [],

      tip: 0,
      tax: 0
    };
  }

  componentWillMount() {
    this.addPerson('Mark');
    this.addPerson('Damian');

    setTimeout(() => {
      this.addDish(new Dish('Beer', 9.40));
      this.addDish(new Dish('Steak', 29.50));
      this.addDish(new Dish('Sandwich', 12.40));
      console.log(this.state.orders);
    }, 100);
  }

  indicateOrder(setUnset, pInd, dInd) {
    this.setState(prevState => {
      let newOrders = clone2D(prevState.orders);
      newOrders[dInd][pInd] = setUnset;
      return {
        orders: newOrders
      };
    });
  }

  checkOrderPersonDish(pInd, dInd) {
    return this.state.orders[dInd][pInd];
  }

  getPeoplePerDish(dInd) {
    return this.state.people
      .map((p, pInd) => (this.checkOrderPersonDish(pInd, dInd)))
      .reduce((p, c) => p + c);
  }
  
  addPerson(name) {
    // index of new person
    let pInd = this.state.people.length;
    name = name || `Person ${pInd + 1}`
    console.log('adding person...');

    this.setState((prevState) => {
      //let newOrders = Object.assign({}, prevState.orders);
      let newOrders = clone2D(prevState.orders);

      for (let row = 0; row < newOrders.length; row++) {
        newOrders[row][pInd] = true;
      }

      return {
        people: [...prevState.people, name],
        orders: newOrders
      };
    });
  }

  removeLastPerson() {
    if (this.state.people.length == 2) { return; }
    console.log('removing person...');
    this.setState((prevState) => ({
      people: prevState.people.slice(0, prevState.people.length - 1)
    }));
  }

  addDish(dish) {
    // index of new person
    let dInd = this.state.dishes.length;
    let peopleCount = this.state.people.length;

    dish = dish || new Dish(`Dish ${dInd + 1}`, 0);
    console.log('adding dish...');
    this.setState((prevState) => {

      let newOrders = clone2D(prevState.orders);
      
      // add to the end (-1), don't delete any (0)
      // add true for every person
      newOrders.splice(-1, 0, Array(peopleCount).fill(true));
      console.log(newOrders);

      return {
        dishes: [...prevState.dishes, dish],
        orders: newOrders
      };
    });
  }

  removeLastDish() {
    if (this.state.dishes.length == 1) { return; }
    console.log('removing dish...');
    this.setState((prevState) => ({
      dishes: prevState.dishes.slice(0, prevState.dishes.length - 1)
    }));
  }
  
  render() {
    return (
      <div>
        <div>
          <button onClick={() => this.addPerson()}>Add Person</button>
          <button onClick={() => this.removeLastPerson()}>Remove Person</button>
        </div>
         <div>
          <button onClick={() => this.addDish()}>Add Dish</button>
          <button onClick={() => this.removeLastDish()}>Remove Dish</button>
        </div>
        <div className="tableContainer">
          <div className="table">
            {getNamesHeader(this.state.people)}

            <div className="tbody">
              {this.getOrderRows()}
              {this.getTotalRow(this.state.people)}
            </div>
          </div>
        </div>
      </div>
    );
  }

    // todo this should return a number
  getTotalForPerson(pInd) {
    return this.state.dishes.map((dish, dInd) => {
      // did this person have the dish?
      if (this.checkOrderPersonDish(pInd, dInd)) {
        return dish.price / this.getPeoplePerDish(dInd);
      }
      return 0;
    }, this)
    .reduce((p, c) => p + c, 0)
    .toFixed(2);
  }

  getTotalRow() {
    let rowElements = [
      <span>Total:</span>
    ];
    this.state.people.forEach((person, pInd) => {
      rowElements.push(<span>{this.getTotalForPerson(pInd)}</span>);
    });

    // put each row element in a _td, then put all of those in a _tr
    return (
      <_tr>
        {rowElements.map((el, el_i) => <_td key={el_i}>{el}</_td>)}
      </_tr>
    );
  }

  getOrderRows() {
    let people = this.state.people;
    let dishes = this.state.dishes;

    let that = this;
    let getToggleCB = function (pInd, dInd) {
      return (setUnset) => {
        that.indicateOrder(setUnset, pInd, dInd);
      };
    };

    let getPriceCB = function (dInd) {
      return (newPrice) => {
        console.log(`attempting to set new price for ${dInd}th dish, at ${newPrice}`);
        that.setState((prevState) => {
          // shallow copy
          let newDishes = prevState.dishes.slice();
          newDishes[dInd] = new Dish(newDishes[dInd].name, newPrice);
          return {
            dishes: newDishes
          }
        });
      };
    };

    return dishes.map((dish, dInd) => {
      let rowElements = people.map((el, pInd) => (
        <CellToggle 
          enabled={that.checkOrderPersonDish(pInd, dInd)}
          callback={getToggleCB(pInd, dInd)}
        />
      ));

      // put in the beggining
      rowElements.splice(0, 0, 
        <div>
          <StringInput style={{float: 'left'}} initalValue = {dish.name}/>
          <PriceInput 
            style={{float: 'right'}} 
            initalValue = {dish.price}
            onBlurCB = {getPriceCB(dInd)} />
        </div>
      );

      // put each row element in a _td, then put all of those in a _tr
      return (
        <_tr key={dInd}>
          {rowElements.map((el, el_i) => <_td key={el_i}>{el}</_td>)}
        </_tr>
      );
    });
  }
}  // end of Splitter class






function _th(props) {
  return <div className="th">{props.children}</div>;
}

function _td(props) {
  return <div className="td">{props.children}</div>;
}

function _tr(props) {
  return <div className="tr">{props.children}</div>;
}

function getNamesHeader(people) {
  // row starts with one empty cell
  let rowElements = [<div style={{minWidth: '12em'}}/>];
  people.forEach((el) => {
    rowElements.push(<StringInput initalValue = {el}/>);
  });

  return (
    <div className="thead"> 
      {rowElements.map((el, el_i) => <_th key={el_i}>{el}</_th>)}
    </div>
  );
}

class CellToggle extends React.Component {
  constructor(props) {
    super(props);
  }

  clicked() {
    this.props.callback(!this.props.enabled);
  }

 
  render() {
    let newColor = this.props.enabled 
      ? 'lightgreen' 
      : this.props.enabled == undefined ? 'grey' : 'lightpink';
    let style = {
      width: '100%',
      height: '100%',
      display: 'block',
      padding: '1em',
      background: newColor
    };

    return (
      <span style={style} onClick={this.clicked.bind(this)}>
        {this.props.enabled ? 'enabled' : 'disabled'}
      </span>
    );
  }
}

export default Splitter;