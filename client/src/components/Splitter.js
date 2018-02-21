/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React from 'react';

import CellToggle from './CellToggle';
import { StringInput, PriceInput, PercentInput } from './Inputs';
import ButtonBar from './ButtonBar';
import Linker from './Linker';
import RowHeader from './RowHeader';
import Swappable from './Swappable';
import { TH, TD, TR, THEAD, TBODY, TABLE } from './TableDivs';

import Dish from '../Dish';
import StateLoader from '../StateLoader';
import Utils from '../Utils';
import Cache from '../Cache';

import '../css/Splitter.css';

class Splitter extends React.Component {
  // very simple cache for some frequent calculations
  _cache = new Cache();

  lastLSUpdate = 0;

  constructor(props) {
    super(props);
    this.state = StateLoader.loadInitial();
  }

  // set or unset if the given person got the given dish.
  indicateOrder(setUnset, pInd, dInd) {
    this.setState((prevState) => {
      const newOrders = Utils.clone2D(prevState.orders);
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
    const result = this.personCostForDishOrig(pInd, dInd);
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
    if (!this.personOrderedDish(pInd, dInd)) {
      return 0;
    }

    const ppd = this.peoplePerDish(dInd);
    const dishPrice = this.state.dishes[dInd].price.num;
    const initialSplit = Utils.precisionRound(dishPrice / ppd, 2);

    // if the math was exact, we're done!
    const diff = Utils.roundToCent(dishPrice - (initialSplit * ppd));
    if (diff === 0) {
      return initialSplit;
    }
    return initialSplit + this.calcSplitDiff(diff, ppd, pInd, dInd);
  }

  calcSplitDiff(diff, ppd, pInd, dInd) {
    // figure out where in the index of people we are, since people to the
    // left always pay more
    const indexOfThisPerson = this.state.people
      .map((p, pInd) => (this.personOrderedDish(pInd, dInd) ? pInd : -1))
      .filter(el => el > -1)
      .indexOf(pInd);

    if (diff < 0) {
      return (ppd - indexOfThisPerson <= Math.abs(diff) * 100) ? -0.01 : 0;
    }
    return (indexOfThisPerson < diff * 100) ? 0.01 : 0;
  }

  // Given a person, what's their subtotal owed? (exluding tax/tip)
  subtotalOwed(pInd) {
    return this.state.dishes
      .map((dish, dInd) => (this.personCostForDish(pInd, dInd)))
      .reduce(Utils.sumFunc, 0);
  }

  // Return the sum of dish prices.
  subtotal() {
    return this.state.dishes
      .map(dish => (dish.price.num))
      .reduce(Utils.sumFunc, 0);
  }

  // get the percent of the order that Person owes (or 0 if subtotal = 0)
  percentOfSubtotalOwed(pInd) {
    return (this.subtotalOwed(pInd) / this.subtotal()) || 0;
  }

  // Add a new person to the people array, and a new column of Trues
  // to the orders array (they order everything by default)
  addPerson() {
    this.setState((prevState) => {
      const newOrders = Utils.clone2D(prevState.orders);

      for (let row = 0; row < newOrders.length; row += 1) {
        newOrders[row][this.state.people.length] = true;
      }

      return {
        people: [ ...prevState.people, '' ],
        orders: newOrders
      };
    });
  }

  removeLastPerson() {
    // There must always be two or more people
    if (this.state.people.length > 2) {
      this.setState(prevState => ({
        people: prevState.people.slice(0, prevState.people.length - 1),
        orders: prevState.orders.map(row => (row.slice(0, row.length - 1)))
      }));
    }
  }

  addDish() {
    this.setState(prevState => ({
      dishes: [ ...prevState.dishes, Dish.of() ],
      orders: Utils.clone2D(prevState.orders)
        .concat([ Array(this.state.people.length).fill(true) ])
    }));
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
    // console.log('Cleared cache');
  }

  // Store the current state to localStorage
  componentDidUpdate() {
    this.lastStateUpdate = Date.now();
    StateLoader.updateLocalStorage(this.state);
  }

  render() {
    return (
      <div className='splitterContainer'>
        <Linker dataToSend={StateLoader.getFromLocalStorage()} />
        <ButtonBar
          addPersonFunc={this.addPerson.bind(this)}
          removePersonFunc={this.removeLastPerson.bind(this)}
          addDishFunc={this.addDish.bind(this)}
          removeDishFunc={this.removeLastDish.bind(this)}
          showExampleFunc={() => { this.setState(() => StateLoader.getExample()); }}
          resetFunc={() => { this.setState(() => StateLoader.getDefault()); }}
        />
        <TABLE>
          {this.getHeaderRow()}
          <TBODY>
            {this.getOrderRows()}
            {this.getTipRow('Tip', 'tip')}
            {this.getTaxRow('Tax', 'tax')}
            {this.getTotalRow()}
          </TBODY>
        </TABLE>
      </div>
    );
  }

  getHeaderRow() {
    const widths = getHeaderWidths(this.state.people.length);
    return (
      <THEAD>
        {this.getHeaderRowChildren().map((el, i) => (
          <TH key={i} style={{ width: `${widths[i]}%` }}>{el}</TH>
        ))}
      </THEAD>
    );
  }

  getHeaderRowChildren() {
    return [ <div /> ]
      .concat(this.state.people.map((person, pInd) => (
        <StringInput
          value={person}
          placeholder={`Pal ${pInd + 1}`}
          onChangeCB={this.callbacks.setNameCBGetter(pInd)}
          center
        />
      )));
  }

  getTotalRow() {
    const taxAndTip = this.state.tax.num + this.tipAsMoney();
    let rowEls = [
      <div>
        <span className='leftPad'>Total:</span>
        <span className='rightPad'>
          {Utils.priceAsString(this.subtotal() + taxAndTip, false)}
        </span>
      </div>
    ];
    rowEls = rowEls.concat(this.state.people.map((person, pInd) => (
      <span style={{ fontWeight: 'bold', display: 'inline-block' }}>
        {Utils.priceAsString((this.percentOfSubtotalOwed(pInd) * taxAndTip)
          + this.subtotalOwed(pInd))}
      </span>
    )));

    return <TR>{rowEls.map((el, i) => <TD key={i}>{el}</TD>)}</TR>;
  }

  tipAsMoney = () => (this.state.tip.num / 100 * this.subtotal());

  // Get tip row.
  getTipRow(displayName) {
    let rowEls = [
      <RowHeader useMobileUI={this.props.useMobileUI}>
        <span className='leftPad'>{displayName}: (</span>
        <Swappable className='middle'>
          <PercentInput
            numObj={this.state.tip}
            onChangeCB={this.callbacks.tipUpdater}
          />
          <div className='Underlineable'>
            <span tabIndex='0'>{`${this.state.tip.stringRep}`}</span>
          </div>
        </Swappable>
        <span>%)</span>
        <span className='rightPad fakeFloatRight'>
          {Utils.priceAsString(this.tipAsMoney(), false)}
        </span>
      </RowHeader>
    ];

    rowEls = rowEls.concat(this.getSplitTaxOrTipArray(this.tipAsMoney())
      .map(price => (<span>{Utils.priceAsString(price)}</span>)));

    return <TR>{rowEls.map((el, i) => <TD key={i}>{el}</TD>)}</TR>;
  }

  // Get tax or tip row.
  getTaxRow(displayName) {
    let rowEls = [
      <RowHeader useMobileUI={this.props.useMobileUI}>
        <span className='leftPad'>{`${displayName}:`}</span>
        <Swappable className='rightPad' >
          <PriceInput
            priceObj={this.state.tax}
            onChangeCB={this.callbacks.taxUpdater}
          />
          <div className='Underlineable'>
            <span tabIndex='0'>
              {Utils.priceAsString(this.state.tax.num, false)}
            </span>
          </div>
        </Swappable>
      </RowHeader>
    ];

    rowEls = rowEls.concat(this.getSplitTaxOrTipArray(this.state.tax.num)
      .map(price => (<span>{Utils.priceAsString(price)}</span>)));

    return <TR>{rowEls.map((el, i) => <TD key={i}>{el}</TD>)}</TR>;
  }

  getSplitTaxOrTipArray(value) {
    const priceArray = this.state.people.map((person, pInd) => (
      Utils.roundToCent(this.percentOfSubtotalOwed(pInd) * value)
    ));
    const diff = Utils.roundToCent(value - priceArray.reduce(Utils.sumFunc));

    // if we have to fix the tax or tip up, just add/subtract from
    // to/from the smallest/largest. it's only ever 1cent it seems...
    if (diff !== 0) {
      const priceToAdjust = diff < 0
        ? Math.max(...priceArray)
        : Math.min(...priceArray);
      priceArray[priceArray.indexOf(priceToAdjust)] += diff;
    }
    return priceArray;
  }

  getOrderRows() {
    return this.state.dishes.map((dish, dInd) => {
      const dishName = dish.name || `Dish ${dInd + 1}`;
      const price = Utils.priceAsString(dish.price.num, false);

      let rowEls = [
        <RowHeader useMobileUI={this.props.useMobileUI}>
          <Swappable className='leftPad'>
            <StringInput
              placeholder={`Dish ${dInd + 1}`}
              value={dish.name}
              onChangeCB={this.callbacks.setDishNameCBGetter(dInd)}
            />
            <div className='Underlineable'>
              <span tabIndex='0' className='DishName'>{dishName}</span>
            </div>
          </Swappable>
          <Swappable className='rightPad'>
            <PriceInput
              priceObj={dish.price}
              onChangeCB={this.callbacks.setDishPriceCBGetter(dInd)}
            />
            <div className='Underlineable'>
              <span tabIndex='0'>{price}</span>
            </div>
          </Swappable>
        </RowHeader>
      ];

      rowEls = rowEls.concat(this.state.people.map((el, pInd) => (
        <CellToggle
          on={this.personOrderedDish(pInd, dInd)}
          onClickCB={this.callbacks.getToggleCB(pInd, dInd)}
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

  callbacks = {
    setDishNameCBGetter: dInd => (newDishName, final) => {
      this.setState((prevState) => {
        if (final) { console.log('FINAL DISH NAME ', dInd); }
        const newDishes = prevState.dishes.slice(); // shallow copy
        newDishes[dInd] = Dish.of(newDishName, newDishes[dInd].price);
        return {
          dishes: newDishes
        };
      });
    },

    setDishPriceCBGetter: dInd => (stringRep, final) => {
      this.setState((prevState) => {
        if (final) { console.log('FINAL DISH PRICE ', dInd); }
        const newDishes = prevState.dishes.slice(); // shallow copy

        newDishes[dInd] = Dish.of(
          newDishes[dInd].name,
          prevState.dishes[dInd].price.as(stringRep, final)
        );

        return {
          dishes: newDishes
        };
      });
    },

    taxUpdater: (stringRep, final) => {
      if (final) { console.log('FINAL TAX'); }
      this.setState(prevState => ({ tax: prevState.tax.as(stringRep, final) }));
    },

    tipUpdater: (stringRep, final) => {
      if (final) { console.log('FINAL TIP'); }
      this.setState(prevState => ({
        tip: prevState.tip.as(stringRep, final)
      }));
    },

    setNameCBGetter: pInd => (newName, final) => {
      if (final) { console.log('FINAL NAME', pInd); }
      this.setState((prevState) => {
        prevState.people[pInd] = newName;
        return {
          people: prevState.people
        };
      });
    },

    getToggleCB: (pInd, dInd) => (setUnset) => {
      // don't unset the last enabled cell in an order (someone has to pay!)
      if (!setUnset && this.state.orders[dInd].reduce(Utils.sumFunc, 0) === 1) {
        this.setState(() => ({ error: errorKey(pInd, dInd) }));
        setTimeout(() => {
          this.setState(() => ({ error: undefined }));
        }, 200);
      }
      else {
        this.indicateOrder(setUnset, pInd, dInd);
      }
    }
  }
} // end of Splitter class

function getHeaderWidths(numPeople) {
  const firstWidth = 40;
  return [ firstWidth ].concat(Array(numPeople).fill((100 - firstWidth) / numPeople));
}

function errorKey(pInd, dInd) {
  return `${pInd}_${dInd}`;
}

export default Splitter;
