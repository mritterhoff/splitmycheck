import React from 'react'

import {CellToggle} from './CellToggle.js'
import {StringInput, PriceInput} from './Input.js'

import '../css/Splitter.css'

let summer = (p, c) => p + c

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

// TODO have an example page instead
  componentWillMount() {
    this.addPerson('Mark');
    this.addPerson('Sarah');
  }

  componentDidMount() {
    this.addDish(new Dish('Mocktails', 9.40));
    this.addDish(new Dish('Steak', 29.50));
    this.addDish(new Dish('Sandwich', 12.40));

    console.log('orders:');
    console.log(this.state.orders);
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

  // Returns true or false
  didPersonOrderDish(pInd, dInd) {
    return this.state.orders[dInd][pInd];
  }

  // Given a dish, how many people ordered it?
  peoplePerDish(dInd) {
    return this.state.people
      .map((p, pInd) => (this.didPersonOrderDish(pInd, dInd)))
      .reduce(summer);
  }

  // Given a person and dish, how much do they owe for it?
  personCostForDish(pInd, dInd) {
    return this.didPersonOrderDish(pInd, dInd)
      ? this.state.dishes[dInd].price / this.peoplePerDish(dInd)
      : 0;
  }

  // Given a person, what's their total owed for orders? (exluding tax/tip)
  orderTotalForPerson(pInd) {
    return this.state.dishes.map((dish, dInd) => (this.personCostForDish(pInd, dInd)), this)
      .reduce(summer, 0);
  }

  // Return the sum of dish orders.
  orderTotal() {
    return this.state.dishes.map((dish) => (dish.price)).reduce(summer, 0);
  }

  personOrderProportion(pInd) {
    return this.orderTotalForPerson(pInd) / this.orderTotal();
  }

  addPerson(name) {
    console.log('adding person...');

    this.setState((prevState) => {
      let newOrders = clone2D(prevState.orders);

      for (let row = 0; row < newOrders.length; row++) {
        newOrders[row][this.state.people.length] = true;
      }

      return {
        people: [...prevState.people, name],
        orders: newOrders
      };
    });
  }

  removeLastPerson() {
    if (this.state.people.length === 2) { return; }
    console.log('removing person...');
    this.setState((prevState) => ({
      people: prevState.people.slice(0, prevState.people.length - 1)
    }));
  }

  addDish(dish) {
    dish = dish || new Dish('', 0);
    console.log('adding dish...');
    this.setState((prevState) => {
      // let newOrders = clone2D(prevState.orders)
      //   .concat(Array(peopleCount).fill(true));
      
      // add to the end (-1), don't delete any (0)
      // splice isn't chainable. unsure if I can switch to concat (above)
      let newOrders = clone2D(prevState.orders);
      newOrders.splice(-1, 0, Array(this.state.people.length).fill(true));

      return {
        dishes: [...prevState.dishes, dish],
        orders: newOrders
      };
    });
  }

  removeLastDish() {
    if (this.state.dishes.length === 1) { return; }
    console.log('removing dish...');
    this.setState((prevState) => ({
      dishes: prevState.dishes.slice(0, prevState.dishes.length - 1)
    }));
  }
  
  render() {
    return (
      <div>
        <div className="tableContainer">
          {this.getButtonBar()}
          <div className="table">
            {getNamesHeader(this.state.people)}

            <div className="tbody">
              {this.getOrderRows()}
              {this.getTaxRow()}
              {this.getTipRow()}
              {this.getTotalRow()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  getButtonBar() { 
    let divStyle = {
      backgroundColor: 'lightgray',
      display: 'inline-block',
      padding: '.1em'
    };

    let spanStyle = {
      padding: '.5em'
    };

    let barStyle = {
      margin: 'auto',
      width: 'auto',
      textAlign: 'center',
      padding: '.5em'
    };

    return (
      <div style = {barStyle}>
        <div style = {divStyle}>
          <button onClick={() => this.removeLastDish()}>-</button>
          <span style = {spanStyle}>Dish</span>
          <button onClick={() => this.addDish()}>+</button>
        </div>       
        <div style={{width: '1em', display: 'inline-block'}}></div>
        <div style = {divStyle}>
          <button onClick={() => this.removeLastPerson()}>-</button>
          <span style = {spanStyle}>Person</span>
          <button onClick={() => this.addPerson()}>+</button>
        </div>
      </div>  
    );
  }

  getTotalRow() {
    let totalStyle = {
      float: 'right',
      paddingRight: '.9em'
    };

    let personStyle = {
      fontWeight: 'bold',
      display: 'inline-block'
    };

    let rowEls = [
      <div>
        <span>Total:</span>
        <span style = {totalStyle}>
          {priceAsString(this.orderTotal() + this.state.tax + this.state.tip)}
        </span>
      </div>
    ];
    rowEls = rowEls.concat(this.state.people.map((person, pInd) => {
        let personTotal = this.orderTotalForPerson(pInd)
          + this.personOrderProportion(pInd) * (this.state.tax + this.state.tip);
        return <span style={personStyle}>{priceAsString(personTotal)}</span>;
      },
      this));

    // put each row element in a TD, then put all of those in a TR
    return (
      <TR>
        {rowEls.map((el, el_i) => <TD key={el_i}>{el}</TD>)}
      </TR>
    );
  }

  getSpecialRow(displayName, updaterFunc, getterFunc) {
    // this style makes it align with the input box (which has a 1px border)
    let style = {display: 'inline-block', padding: '.3em 0em', margin: '1px 0'};
    let rowEls = [
      <div>
        <span style={style}>{displayName}:</span>
        <PriceInput 
          style={{float: 'right'}} 
          initalValue = {0}
          onBlurCB = {updaterFunc} />
      </div>
      ];
    rowEls = rowEls.concat(this.state.people.map((person, pInd) => (
      <span>
        {priceAsString(this.personOrderProportion(pInd) * getterFunc())}
      </span>
    ), this));

    // put each row element in a TD, then put all of those in a TR
    return (
      <TR>
        {rowEls.map((el, el_i) => <TD key={el_i}>{el}</TD>)}
      </TR>
    );
  }

  getTaxRow() {
    return this.getSpecialRow(
      'Tax',
      (tax) => {this.setState((prevState) => ({tax: Number(tax)}))},
      (tax) => (this.state.tax));
  }

  getTipRow() {
    return this.getSpecialRow(
      'Tip',
      (tip) => {this.setState((prevState) => ({tip: Number(tip)}))},
      (tip) => (this.state.tip));
  }

  getOrderRows() {
    let that = this;

    let getToggleCB = function (pInd, dInd) {
      return (setUnset) => {
        that.indicateOrder(setUnset, pInd, dInd);
      };
    };

    function setPriceCBGetter(dInd) {
      return (newPrice) => {
        if (typeof newPrice === 'string') {
          console.error(`newPrice is a string and shouldn't be: "${newPrice}"`);
        }
        that.setState((prevState) => {
          let newDishes = prevState.dishes.slice();  // shallow copy
          newDishes[dInd] = new Dish(newDishes[dInd].name, newPrice);
          return {
            dishes: newDishes
          }
        });
      };
    };

    return this.state.dishes.map((dish, dInd) => {
      let rowEls = [
        <div>
          <StringInput 
            style={{float: 'left'}}
            placeholder= {`Dish ${dInd + 1}`}
            initalValue = {dish.name}/>
          <PriceInput 
            style={{float: 'right'}} 
            initalValue = {dish.price}
            onBlurCB = {setPriceCBGetter(dInd)} />
        </div>
      ];

      rowEls = rowEls.concat(this.state.people.map((el, pInd) => (
        <CellToggle 
          enabled={that.didPersonOrderDish(pInd, dInd)}
          callback={getToggleCB(pInd, dInd)}
          price={priceAsString(this.personCostForDish(pInd, dInd))}
        />
      )));

      // put each row element in a TD, then put all of those in a TR
      return (
        <TR key={dInd}>
          {rowEls.map((el, el_i) => <TD key={el_i}>{el}</TD>)}
        </TR>
      );
    });
  }
}  // end of Splitter class


function TH(props) {
  return <div className="th">{props.children}</div>;
}

function TD(props) {
  return <div className="td">{props.children}</div>;
}

function TR(props) {
  return <div className="tr">{props.children}</div>;
}

function getNamesHeader(people) {
  let rowEls = [<div/>];
  rowEls = rowEls.concat(people.map((person, pInd) => (
    <StringInput 
      initalValue = {person}
      placeholder = {`Person ${pInd + 1}`}
    />
  )));

  return (
    <div className="thead"> 
      {rowEls.map((el, i) => <TH key={i}>{el}</TH>)}
    </div>
  );
}

class Dish {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

function clone2D(a) {
  return a.map(o => [...o]);
}

function priceAsString(num) {
  return '$\u00A0' + num.toFixed(2); 
}

export default Splitter;