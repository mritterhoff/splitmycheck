import React from 'react'

import { CellToggle } from './CellToggle'
import { StringInput, PriceInput } from './Inputs'
import { ButtonBar } from './ButtonBar'
import { Linker } from './Linker'
import { RowHeader2 } from './RowHeader2'
import { TH, TD, TR, THEAD, TBODY, TABLE } from './TableDivs'

import { Dish } from '../Dish'
import { StateLoader } from '../StateLoader'
import { Utils } from '../Utils'
import { Cache } from '../Cache'

import '../css/Splitter.css'

class Splitter extends React.Component {
  // very simple cache for some frequent calculations
  _cache = new Cache();

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
  personOrderedDish(pInd, dInd) {
    return this.state.orders[dInd][pInd];
  }

  // Given a dish, how many people ordered it?
  peoplePerDish(dInd) {
    return this.state.people
      .map((p, pInd) => (this.personOrderedDish(pInd, dInd)))
      .reduce(Utils.sumFunc);
  }

  personCostForDish(pInd, dInd) {
    if (this._cache.has('personCostForDish', pInd, dInd)) {
     return this._cache.get('personCostForDish', pInd, dInd);
    } 
    let result = this.personCostForDishOrig(pInd, dInd);
    this._cache.put(result, 'personCostForDish', pInd, dInd);
    return result;
  }

  // Given a person and dish, how much do they owe for it?
  // TODO this gets called 4 times per cell, so we cache it

  // if there is a difference, it will be 
  // between -(ppd - 1) cents and (ppd - 1) cents.
  // this assumes 4 people ordered the dish:
  //
  // off  P0  P1  P2  P3  
  //  -3   0  -1  -1  -1
  //  -2   0   0  -1  -1
  //  -1   0   0   0  -1  
  //
  //   1  +1   0   0   0
  //   2  +1  +1   0   0
  //   3  +1  +1  +1   0
  personCostForDishOrig(pInd, dInd) {
    if (!this.personOrderedDish(pInd, dInd)) { return 0; }
  
    let ppd = this.peoplePerDish(dInd)
    let dishPrice = this.state.dishes[dInd].price.num
    let initialSplit = Utils.precisionRound(dishPrice / ppd, 2);

    // if the math was exact, we're done!
    let diff = Utils.roundToCent(dishPrice - initialSplit * ppd);
    if (diff === 0) {
      return initialSplit;
    }

    // figure out where in the index of people we are, since people to the 
    // left always pay more
    let indexOfThisPerson = this.state.people
      .map((p, pInd) => (this.personOrderedDish(pInd, dInd) ? pInd : -1))
      .filter(el => el > -1)
      .indexOf(pInd);

    let splitDiff = diff < 0
      ? (ppd - indexOfThisPerson <= Math.abs(diff)*100) ? -.01 : 0
      : (indexOfThisPerson < diff*100) ? .01 : 0;
    return initialSplit + splitDiff;
  }

  // Given a person, what's their subtotal owed? (exluding tax/tip)
  subtotalOwed(pInd) {
    return this.state.dishes
      .map((dish, dInd) => (this.personCostForDish(pInd, dInd)))
      .reduce(Utils.sumFunc, 0);
  }

  // Return the sum of dish prices.
  orderTotal() {
    return this.state.dishes
      .map(dish => (dish.price.num))
      .reduce(Utils.sumFunc, 0);
  }

  // get the percent of the order that Person (indexed by pInd) owes
  // if the orderTotal is 0, will return 0 instead of NaN (dev by 0) (better to show user 0 than NaN)
  percentOfSubtotalOwed(pInd) {
    let orderTotal = this.orderTotal();
    return orderTotal === 0
      ? 0
      : this.subtotalOwed(pInd) / orderTotal;
  }

  // Add a new person to the people array, and a new column of Trues
  // to the orders array (they order everything by default)
  addPerson() {
    this.setState(prevState => {
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
      this.setState(prevState => {
        return {
          people: prevState.people.slice(0, prevState.people.length - 1),
          orders: prevState.orders.map(row => (row.slice(0, row.length - 1)))
        };
      });
    }
  }

  addDish() {
    this.setState(prevState => {
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
      this.setState(prevState => ({
        dishes: prevState.dishes.slice(0, prevState.dishes.length - 1),
        orders: prevState.orders.slice(0, prevState.orders.length - 1)
      }));
    }
  }

  componentWillUpdate() {
    this._cache.clear();
    console.log('cleared cache');
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
          showExampleFunc={() => {this.setState(prevState => StateLoader.getExample())}}
          resetFunc={() => {this.setState(prevState => StateLoader.getDefault())}}
        />
        <TABLE>
          {this.getHeaderRow()}
          <TBODY>
            {this.getOrderRows()}
            {this.getSpecialRow('Tax:', 'tax')}
            {this.getSpecialRow('Tip:', 'tip')}
            {this.getTotalRow()}
          </TBODY>
        </TABLE>
      </div>
    );
  }

  getHeaderRow(people) {
    let widths = getHeaderWidths(40, this.state.people.length);
    return (
      <THEAD> 
        {this.getHeaderRowChildren().map((el, i) => {
          return <TH key={i} style={{width: widths[i] + '%'}}>{el}</TH>;
        })}
      </THEAD>
    );
  }

  getHeaderRowChildren() {
    let setNameCBGetter = pInd => (
      newName => {
        this.setState(prevState => {
          prevState.people[pInd] = newName;
          return {
            people: prevState.people
          }
        });
      }
    );

    return [<div/>]
      .concat(this.state.people.map((person, pInd) => (
        <StringInput 
          value = {person}
          placeholder = {`Pal ${pInd + 1}`}
          onChangeCB = {setNameCBGetter(pInd)}
          style = {{textAlign: 'center'}}/>
      )));
  }

  getTotalRow() {
    let taxAndTip = this.state.tax.num + this.state.tip.num;
    let rowEls = [
      <div>
        <span>Total:</span>
        <span style={{float: 'right'}}>
          {Utils.priceAsString(this.orderTotal() + taxAndTip, false)}
        </span>
      </div>
    ];
    rowEls = rowEls.concat(this.state.people.map((person, pInd) => (
      <span style={{fontWeight: 'bold', display: 'inline-block'}}>
        {Utils.priceAsString(this.subtotalOwed(pInd) + this.percentOfSubtotalOwed(pInd) * taxAndTip)}
      </span>
    )));

    return (
      <TR>
        {rowEls.map((el, el_i) => <TD key={el_i}>{el}</TD>)}
      </TR>
    );
  }

  // Get tax or tip row.
  getSpecialRow(displayName, stateKey) {
    let updaterFunc = (stringRep, isFinal) => {
      this.setState(prevState => {
        return {[stateKey]: prevState[stateKey].as(stringRep, isFinal)};
      });
    };

    let getterFunc = () => (this.state[stateKey]);

    let rowEls = [
      <RowHeader2 useMobileUI={this.props.useMobileUI}>
        {[[
          <span className='taxOrTip' key='1'>{displayName}</span>
         ],[ 
          <PriceInput key='2'
            priceObj = {getterFunc()}
            onChangeCB = {updaterFunc}/>,
          <span tabIndex='0' key='3'>
            {Utils.priceAsString(getterFunc().num, false)}
          </span>
        ]]}
      </RowHeader2> 
    ];

    rowEls = rowEls.concat(this.getSpecialPriceArray(getterFunc)
      .map(price => (<span>{Utils.priceAsString(price)}</span>)));

    return <TR>{rowEls.map((el, el_i) => <TD key={el_i}>{el}</TD>)}</TR>;
  }

  getSpecialPriceArray(getterFunc) {
    let priceArray = this.state.people.map((person, pInd) => (
      Utils.roundToCent(this.percentOfSubtotalOwed(pInd) * getterFunc().num)
    ));
    let diff = Utils.roundToCent(getterFunc().num - priceArray.reduce(Utils.sumFunc));

    // if we have to fix the tax or tip up, just add/subtract from
    // to/from the smallest/largest. it's only ever 1cent it seems...
    if (diff !== 0) {
      let priceToAdjust = diff < 0 
        ? Math.max(...priceArray) 
        : Math.min(...priceArray);
      priceArray[priceArray.indexOf(priceToAdjust)] += diff;
    }
    return priceArray;
  }

  getOrderRows() {
    let getToggleCB = (pInd, dInd) => (
      setUnset => {
        // don't unset the last enabled cell in an order (someone has to pay!)
        if (!setUnset && this.state.orders[dInd].reduce(Utils.sumFunc, 0) === 1) {
          this.setState(prevState => ({error: errorKey(pInd, dInd)}));
          setTimeout(() => {
            this.setState(prevState => ({error: undefined}));
          }, 200);
        }
        else {
          this.indicateOrder(setUnset, pInd, dInd);   
        }
      }
    );

    let setDishPriceCBGetter = dInd => (
      (stringRep, isFinal) => {
        this.setState(prevState => {
          let newDishes = prevState.dishes.slice();  // shallow copy

          newDishes[dInd] = new Dish(
            newDishes[dInd].name, 
            prevState.dishes[dInd].price.as(stringRep, isFinal));

          return {
            dishes: newDishes
          }
        });
      }
    );

    let setDishNameCBGetter = dInd => (
      newDishName => {
        this.setState(prevState => {
          let newDishes = prevState.dishes.slice();  // shallow copy
          newDishes[dInd] = new Dish(newDishName, newDishes[dInd].price);
          return {
            dishes: newDishes
          }
        });
      }
    );

    return this.state.dishes.map((dish, dInd) => {
      let dishName = dish.name || `Dish ${dInd + 1}`;
      let price = Utils.priceAsString(dish.price.num, false);

      // todo move the keys to somewhere else apparently need to be here AND in RowHeader2
      let rowEls = [
        <RowHeader2 useMobileUI={this.props.useMobileUI}>
          {[[
            <StringInput 
              placeholder={`Dish ${dInd + 1}`}
              value = {dish.name}
              onChangeCB = {setDishNameCBGetter(dInd)}
              key='1'/>,
            <span tabIndex='0' className='DishName' key='2'>{dishName}</span>
          ],
          [
            <PriceInput 
              priceObj = {dish.price}
              onChangeCB = {setDishPriceCBGetter(dInd)}
              key='3'/>,
            <span tabIndex='0' key='4'>{price}</span>
          ]]}
        </RowHeader2>
      ];

      rowEls = rowEls.concat(this.state.people.map((el, pInd) => (
        <CellToggle 
          on={this.personOrderedDish(pInd, dInd)}
          onClickCB={getToggleCB(pInd, dInd)}
          price={Utils.priceAsString(this.personCostForDish(pInd, dInd), false)}
          hasError={this.state.error === errorKey(pInd, dInd)}
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



function getHeaderWidths(firstWidth, numPeople) {
  return [firstWidth].concat(Array(numPeople).fill((100-firstWidth)/numPeople));
}

function errorKey(pInd, dInd) {
  return pInd + '_' + dInd;
}

export default Splitter;