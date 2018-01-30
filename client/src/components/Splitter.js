import React from 'react'

import { CellToggle } from './CellToggle.js'
import { StringInput, PriceInput } from './Input.js'
import { ButtonBar } from './ButtonBar.js'
import { Linker } from './Linker.js'

import { Dish } from '../Dish.js'
import { StateLoader } from '../StateLoader.js'

import '../css/Splitter.css'

let summer = (p, c) => p + c

class Splitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = StateLoader.loadInitial();
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
      ? this.state.dishes[dInd].price.num / this.peoplePerDish(dInd)
      : 0;
  }

  // Given a person, what's their total owed for orders? (exluding tax/tip)
  orderTotalForPerson(pInd) {
    return this.state.dishes.map((dish, dInd) => (this.personCostForDish(pInd, dInd)), this)
      .reduce(summer, 0);
  }

  // Return the sum of dish orders.
  orderTotal() {
    return this.state.dishes.map((dish) => (dish.price.num)).reduce(summer, 0);
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
    if (this.state.people.length > 2) {
      this.setState((prevState) => {
        return {
          people: prevState.people.slice(0, prevState.people.length - 1),
          orders: prevState.orders.map(row => (row.slice(0, row.length - 1)))
        };
      });
    }
  }

  addDish() {
    this.setState((prevState) => {
      return {
        dishes: [...prevState.dishes, new Dish()],
        orders: clone2D(prevState.orders).concat([Array(this.state.people.length).fill(true)])
      };
    });
  }

  removeLastDish() {
    // There must always be at least 1 dish
    if (this.state.dishes.length > 1) {
      this.setState((prevState) => ({
        dishes: prevState.dishes.slice(0, prevState.dishes.length - 1),
        orders: prevState.orders.slice(0, prevState.orders.length - 1)
      }));
    }
  }

  // this is called everytime the state is updated
  componentDidUpdate(prevProps, prevState) {
    StateLoader.updateLocalStorage(this.state);
  }
  
  render() {
    return (
      <div className="splitterContainer">
        <Linker dataToSend={this.state}/>
        <ButtonBar 
          addPersonFunc={this.addPerson.bind(this)}
          removePersonFunc={this.removeLastPerson.bind(this)}
          addDishFunc={this.addDish.bind(this)}
          removeDishFunc={this.removeLastDish.bind(this)}
          showExampleFunc={() => {this.setState((prevState) => StateLoader.getExample())}}
          resetFunc={() => {this.setState((prevState) => StateLoader.getDefault())}}
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
          {priceAsString(this.orderTotal() + this.state.tax.num + this.state.tip.num)}
        </span>
      </div>
    ];
    rowEls = rowEls.concat(this.state.people.map((person, pInd) => {
        let personTotal = this.orderTotalForPerson(pInd)
          + this.personOrderProportion(pInd) * (this.state.tax.num + this.state.tip.num);
        return <span style={personStyle}>{priceAsString(personTotal)}</span>;
      },
      this));

    return (
      <TR>
        {rowEls.map((el, el_i) => <TD key={el_i}>{el}</TD>)}
      </TR>
    );
  }

  getSpecialRow(displayName, stateKey) {
    let updaterFunc = (stringRep, isFinal) => {
        this.setState((prevState) => {
          return {[stateKey]: prevState[stateKey].as(stringRep, isFinal)};
        });
      };

    let getterFunc = () => (this.state[stateKey]);

    // this style makes it align with the input box (which has a 1px border)
    let style = {display: 'inline-block', padding: '.3em 0em', margin: '1px 0'};
    let rowEls = [
      <div>
        <span style={style}>{displayName}:</span>
        <PriceInput 
          style={{float: 'right'}} 
          priceObj = {getterFunc()}
          onChangeCB = {updaterFunc} />
      </div>
    ];
    rowEls = rowEls.concat(this.state.people.map((person, pInd) => (
      <span>
        {priceAsString(this.personOrderProportion(pInd) * getterFunc().num)}
      </span>
    ), this));

    return (
      <TR>
        {rowEls.map((el, el_i) => <TD key={el_i}>{el}</TD>)}
      </TR>
    );
  }

  getTaxRow() {
    return this.getSpecialRow('Tax', 'tax');
  }

  getTipRow() {
    return this.getSpecialRow('Tip', 'tip');
  }

  getOrderRows() {
    let that = this;

    function getToggleCB(pInd, dInd) {
      return (setUnset) => {
        // make sure we aren't unsetting the last enabled cell in an order (someone has to pay!)
        // let the user make the illegal move, but revert it immediately
        if (!setUnset && that.state.orders[dInd].reduce(summer, 0) === 1) {
          setTimeout(() => {that.indicateOrder(true, pInd, dInd)}, 200);
        }
        that.indicateOrder(setUnset, pInd, dInd);   
      };
    };

    function setDishPriceCBGetter(dInd) {
      return (stringRep, isFinal) => {
        that.setState((prevState) => {
          let newDishes = prevState.dishes.slice();  // shallow copy

          newDishes[dInd] = new Dish(
            newDishes[dInd].name, 
            prevState.dishes[dInd].price.as(stringRep, isFinal));

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
          newDishes[dInd] = new Dish(newDishName, newDishes[dInd].price);
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
            priceObj = {dish.price}
            onChangeCB = {setDishPriceCBGetter(dInd)} />
        </div>
      ];

      rowEls = rowEls.concat(this.state.people.map((el, pInd) => (
        <CellToggle 
          on={that.didPersonOrderDish(pInd, dInd)}
          onClickCB={getToggleCB(pInd, dInd)}
          price={priceAsString(this.personCostForDish(pInd, dInd))}
        />
      )));

      return (
        <TR key={dInd}>
          {rowEls.map((el, i) => 
            <TD key={i}>{el}</TD>)}
        </TR>
      );
    });
  }
}  // end of Splitter class

function TH(props) {
  return DivTableElement('th', props);
}

function TD(props) {
  return DivTableElement('td', props);
}

function TR(props) {
  return DivTableElement('tr', props);
}

function DivTableElement(classType, props) {
  return <div className={classType}>{props.children}</div>;
}

// Return a shallow clone of the given 2d array
function clone2D(a) {
  return a.map(o => [...o]);
}

// display num as '$ num.##' (nbsp after $)
// add commas using regex, via https://stackoverflow.com/a/14428340/1188090
function priceAsString(num) {
  return '$\u00A0' + num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); 
}

export default Splitter;