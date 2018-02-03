import React from 'react'

import { CellToggle } from './CellToggle'
import { StringInput, PriceInput } from './Inputs'
import { ButtonBar } from './ButtonBar'
import { Linker } from './Linker'
import { RowHeader } from './RowHeader'
import { TH, TD, TR } from './TableDivs'

import { Dish } from '../Dish'
import { StateLoader } from '../StateLoader'
import { Utils } from '../Utils'

import '../css/Splitter.css'

class Splitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = StateLoader.loadInitial();
  }

  // set or unset if the given person got the given dish.
  indicateOrder(setUnset, pInd, dInd) {
    this.setState(prevState => {
      let newOrders = Utils.clone2D(prevState.orders);
      newOrders[dInd][pInd] = setUnset;
      return {
        orders: newOrders
      };
    });
  }

  // Returns true if the person got the dish, else false.
  didPersonOrderDish(pInd, dInd) {
    return this.state.orders[dInd][pInd];
  }

  // Given a dish, how many people ordered it?
  peoplePerDish(dInd) {
    return this.state.people
      .map((p, pInd) => (this.didPersonOrderDish(pInd, dInd)))
      .reduce(Utils.sumFunc);
  }

  // Given a person and dish, how much do they owe for it?
  personCostForDish(pInd, dInd) {
    return this.didPersonOrderDish(pInd, dInd)
      ? this.state.dishes[dInd].price.num / this.peoplePerDish(dInd)
      : 0;
  }

  // Given a person, what's their total owed for orders? (exluding tax/tip)
  orderTotalForPerson(pInd) {
    return this.state.dishes
      .map((dish, dInd) => (this.personCostForDish(pInd, dInd)), this)
      .reduce(Utils.sumFunc, 0);
  }

  // Return the sum of dish prices.
  orderTotal() {
    return this.state.dishes
      .map((dish) => (dish.price.num))
      .reduce(Utils.sumFunc, 0);
  }

  // get the proportion of the order that Person (indexed by pInd) is responsible for
  // if the orderTotal is 0, will return 0 instead of NaN (dev by 0) (better to show user 0 than NaN)
  personOrderProportion(pInd) {
    let orderTotal = this.orderTotal();
    return orderTotal === 0
      ? 0
      : this.orderTotalForPerson(pInd) / orderTotal;
  }

  // Add a new person to the people array, and a new column of Trues
  // to the orders array (they order everything by default)
  addPerson() {
    this.setState((prevState) => {
      let newOrders = Utils.clone2D(prevState.orders);

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
        orders: Utils.clone2D(prevState.orders)
                  .concat([Array(this.state.people.length).fill(true)])
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

  // Store the current state to localStorage, every time the state is updated
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
          placeholder = {`Pal ${pInd + 1}`}
          onChangeCB = {setNameCBGetter(pInd).bind(this)}
          style = {{textAlign: 'center'}}
        />
      )));

    return (
      <div className="thead"> 
        {rowEls.map((el, i) => <TH key={i}>{el}</TH>)}
      </div>
    );
  }

  getTotalRow() {
    let personStyle = {
      fontWeight: 'bold',
      display: 'inline-block'
    };

    let rowEls = [
      <div>
        <span>Total:</span>
        <span>
          {Utils.priceAsString(this.orderTotal() + this.state.tax.num + this.state.tip.num)}
        </span>
      </div>
    ];
    rowEls = rowEls.concat(this.state.people.map((person, pInd) => {
        let personTotal = this.orderTotalForPerson(pInd)
          + this.personOrderProportion(pInd) * (this.state.tax.num + this.state.tip.num);
        return <span style={personStyle}>{Utils.priceAsString(personTotal)}</span>;
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
          priceObj = {getterFunc()}
          onChangeCB = {updaterFunc} />
      </div>
    ];
    rowEls = rowEls.concat(this.state.people.map((person, pInd) => (
      <span>
        {Utils.priceAsString(this.personOrderProportion(pInd) * getterFunc().num)}
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
        if (!setUnset && that.state.orders[dInd].reduce(Utils.sumFunc, 0) === 1) {
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
        <RowHeader
          useMobileUI={this.props.useMobileUI} 
          dInd={dInd}
          dish={dish}
          setDishNameCBGetter={setDishNameCBGetter}
          setDishPriceCBGetter={setDishPriceCBGetter}
        />
      ];

      rowEls = rowEls.concat(this.state.people.map((el, pInd) => (
        <CellToggle 
          on={that.didPersonOrderDish(pInd, dInd)}
          onClickCB={getToggleCB(pInd, dInd)}
          price={Utils.priceAsString(this.personCostForDish(pInd, dInd))}
        />
      )));

      return (
        <TR key={dInd}>
          {rowEls.map((el, i) => <TD key={i}>{el}</TD>)}
        </TR>
      );
    });
  }
}  // end of Splitter class


export default Splitter;