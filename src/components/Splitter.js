import React from 'react'

import {CellToggle} from './CellToggle.js'
import {StringInput, PriceInput} from './Input.js'
import {ButtonBar} from './ButtonBar.js'

import '../css/Splitter.css'

let summer = (p, c) => p + c

let lsSplitterKey = 'SplitterState';

class Splitter extends React.Component {
  constructor(props) {
    super(props);

    // check if we have state stored in localStorage, and use it if we do
    if (localStorage && localStorage.getItem(lsSplitterKey)) {
      console.log('loading past state from localStorage');
      try {
        var obj = JSON.parse(localStorage.getItem(lsSplitterKey));
        this.state = obj;
      } 
      catch (ex) {
        console.error(ex);
      }
    }
    else {
      this.state = this.getDefaultState();
    }

    // TODO this may be unsafe and terrible
    this.oldSetState = this.setState;   
    
    this.setState = function (partialState, callback) {
      function cb() { 
        if (localStorage) {
          localStorage.setItem(lsSplitterKey, JSON.stringify(this.state));
        }

        // should call original callback here with parameters
        if (typeof callback === 'function') {
          callback(arguments);
        }
      }
      this.oldSetState(partialState, cb);
    } 
  }

  getDefaultState() {
    return {
      // list of people
      people: ['', ''],

      // list of {name, price} dish objects
      dishes: [new Dish('', 0)],

      // 2d array of booleans
      // orders[dInd][pInd]
      orders: [ [true, true] ],

      tip: 0,
      tax: 0
    };
  }

  getExampleState() {
    return {
      people: ['Mark', 'Sarah'],
      dishes: [
        new Dish('Mocktails', 9.40),
        new Dish('Steak', 29.50),
        new Dish('Sandwich', 12.40)
      ],
      orders: [
        [true, true],
        [true, true],
        [true, true]
      ],
      tip: 10,
      tax: 5
    };
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
      ? Number(this.state.dishes[dInd].price) / this.peoplePerDish(dInd)
      : 0;
  }

  // Given a person, what's their total owed for orders? (exluding tax/tip)
  orderTotalForPerson(pInd) {
    return this.state.dishes.map((dish, dInd) => (this.personCostForDish(pInd, dInd)), this)
      .reduce(summer, 0);
  }

  // Return the sum of dish orders.
  orderTotal() {
    return this.state.dishes.map((dish) => (Number(dish.price))).reduce(summer, 0);
  }

  // get the proportion of the order that Person (indexed by pInd) is responsible for
  // if the orderTotal is 0, will return 0 instead of NaN (dev by 0) (better to show user 0 than NaN)
  personOrderProportion(pInd) {
    let orderTotal = this.orderTotal();
    if (orderTotal === 0) {
      return 0;
    }

    return this.orderTotalForPerson(pInd) / orderTotal;
  }

  addPerson() {
    this.setState((prevState) => {
      let newOrders = clone2D(prevState.orders);

      for (let row = 0; row < newOrders.length; row++) {
        newOrders[row][this.state.people.length] = true;
      }

      return {
        people: [...prevState.people, ''],
        orders: newOrders
      };
    });
  }

  removeLastPerson() {
    // There must always be two or more people
    if (this.state.people.length === 2) { return; }
    this.setState((prevState) => ({
      people: prevState.people.slice(0, prevState.people.length - 1)
    }));
  }

  addDish(dish) {
    dish = dish || new Dish('', 0);
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
    // There must always be at least 1 dish
    if (this.state.dishes.length === 1) { return; }
    this.setState((prevState) => ({
      dishes: prevState.dishes.slice(0, prevState.dishes.length - 1)
    }));
  }
  
  render() {
    return (
      <div className="splitterContainer">
        <ButtonBar 
          addPersonFunc={this.addPerson.bind(this)}
          removePersonFunc={this.removeLastPerson.bind(this)}
          addDishFunc={this.addDish.bind(this)}
          removeDishFunc={this.removeLastDish.bind(this)}
          showExampleFunc={() => {this.setState((prevState) => this.getExampleState())}}
          resetFunc={() => {this.setState((prevState) => this.getDefaultState())}}
        />
        <div className="table">
          {this.getNamesHeader()}

          <div className="tbody">
            {this.getOrderRows()}
            {this.getTaxRow()}
            {this.getTipRow()}
            {this.getTotalRow()}
          </div>
        </div>
      </div>
    );
  }

  getNamesHeader(people) {
    let that = this;
    function setNameCBGetter(pInd) {
      return (newName) => {
        that.setState((prevState) => {
          prevState.people[pInd] = newName;
          return {
            people: prevState.people
          }
        });
      };
    };

    let rowEls = [<div/>]
      .concat(this.state.people.map((person, pInd) => (
        <StringInput 
          value = {person}
          placeholder = {`Person ${pInd + 1}`}
          onChangeCB = {setNameCBGetter(pInd).bind(this)}
        />
      )));

    return (
      <div className="thead"> 
        {rowEls.map((el, i) => <TH key={i}>{el}</TH>)}
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
          {priceAsString(this.orderTotal() + Number(this.state.tax) + Number(this.state.tip))}
        </span>
      </div>
    ];
    rowEls = rowEls.concat(this.state.people.map((person, pInd) => {
        let personTotal = this.orderTotalForPerson(pInd)
          + this.personOrderProportion(pInd) * (Number(this.state.tax) + Number(this.state.tip));
        return <span style={personStyle}>{priceAsString(personTotal)}</span>;
      },
      this));

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
          value = {getterFunc()}
          onChangeCB = {updaterFunc} />
      </div>
    ];
    rowEls = rowEls.concat(this.state.people.map((person, pInd) => (
      <span>
        {priceAsString(this.personOrderProportion(pInd) * getterFunc())}
      </span>
    ), this));

    return (
      <TR>
        {rowEls.map((el, el_i) => <TD key={el_i}>{el}</TD>)}
      </TR>
    );
  }

  getTaxRow() {
    return this.getSpecialRow(
      'Tax',
      (tax) => {this.setState((prevState) => ({tax: tax}))},
      () => (this.state.tax));
  }

  getTipRow() {
    return this.getSpecialRow(
      'Tip',
      (tip) => {this.setState((prevState) => ({tip: tip}))},
      () => (this.state.tip));
  }

  getOrderRows() {
    let that = this;

    function getToggleCB(pInd, dInd) {
      return (setUnset) => {
        that.indicateOrder(setUnset, pInd, dInd);
      };
    };

    function setDishPriceCBGetter(dInd) {
      return (newPrice) => {
        that.setState((prevState) => {
          let newDishes = prevState.dishes.slice();  // shallow copy
          newDishes[dInd] = new Dish(newDishes[dInd].name, newPrice);
          return {
            dishes: newDishes
          }
        });
      };
    };

    function setDishNameCBGetter(dInd) {
      return (newDishName) => {
        that.setState((prevState) => {
          let newDishes = prevState.dishes.slice();  // shallow copy
          newDishes[dInd] = new Dish(newDishName, Number(newDishes[dInd].price));
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
            value = {dish.name}
            onChangeCB = {setDishNameCBGetter(dInd)}/>
          <PriceInput 
            style={{float: 'right'}} 
            value = {dish.price}
            onChangeCB = {setDishPriceCBGetter(dInd)} />
        </div>
      ];

      rowEls = rowEls.concat(this.state.people.map((el, pInd) => (
        <CellToggle 
          enabled={that.didPersonOrderDish(pInd, dInd)}
          callback={getToggleCB(pInd, dInd)}
          price={priceAsString(this.personCostForDish(pInd, dInd))}
        />
      )));

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

class Dish {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

// Return a shallow clone of the given 2d array
function clone2D(a) {
  return a.map(o => [...o]);
}

// display num as '$ num.##' (nbsp after $)
function priceAsString(num) {
  return '$\u00A0' + Number(num).toFixed(2); 
}

export default Splitter;