/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */

const DBActionsReorg = require('./DBActionsReorg');

async function serializeAndDesearializeTest() {
  const splitObj = JSON.parse(`{
    "people":["Mark","Damian","Kai","Kapil"],
    "dishes":[
      {"name":"Pitcher","price":19.4},{"name":"Wings","price":15.75},
      {"name":"Scotch Egg","price":14.6},{"name":"Pizza","price":22.1},
      {"name":"Shrimp","price":12.98}],
    "orders":[
      [true,true,true,true],[false,false,true,true],[true,true,false,false],
      [true,true,true,true],[false,false,true,false]],
    "tax":7.65,
    "tip":200}`);

  const dbActions = new DBActionsReorg();

  // dbActions.makeNewSplitPromise(splitObj).then((link_code) => {
  //   dbActions.assembleObjFromLinkCodePromise(link_code).then((newObj) => {
  //     printOutOrigAndResurrectedObjects(splitObj, newObj);
  //   });
  // });

  const link_code = await dbActions.makeNewSplitPromise(splitObj);
  const newObj = await dbActions.assembleObjFromLinkCodePromise(link_code);
  printOutOrigAndResurrectedObjects(splitObj, newObj);
}

// Print out both JSON objects next to each other, indicating any differences.
// Will print empty object if undefined, 'null' if null.
function printOutOrigAndResurrectedObjects(obj1 = {}, obj2 = {}) {
  const getAndPad = (arr, i) => (i < arr.length ? arr[i] : 'NOT FOUND').padEnd(30);

  const obj1Arr = JSON.stringify(obj1, null, 2).split('\n');
  const obj2Arr = JSON.stringify(obj2, null, 2).split('\n');
  let objectsEqual = true;
  let i = 0;
  while (i < Math.max(obj1Arr.length, obj2Arr.length)) {
    const left = getAndPad(obj1Arr, i);
    const right = getAndPad(obj2Arr, i);
    const same = left === right;
    objectsEqual = objectsEqual && same;
    console.log(`${same ? ' ' : 'X'} | ${left} | ${right}`);
    i += 1;
  }
  console.log(`Objects are${objectsEqual ? '' : ' NOT'} the same.`);
}

async function timeTest(dbActions, funcTest) {
  console.log('starting test');
  funcTest = funcTest.bind(dbActions);
  let tries = 10;
  const attempts = [];
  while (tries-- > 0) {
    const start = Date.now();
    await funcTest().then(() => {
      attempts.push(Date.now() - start);
    });
    await setTimeout(() => {
      console.log('done');
    }, 5000);
  }
  tries = attempts.length;
  const average = attempts.reduce((a, b) => a + b) / tries;
  console.log(`${tries} tries took a mean of: ${average}`);
}

async function timeTestBoth() {
  const dbActions = new DBActionsReorg();
  dbActions._checkReady()
    .then(() => timeTest(dbActions, dbActions.getUnusedLinkCodePromise))
    .then(() => timeTest(dbActions, dbActions.getUnusedLinkCodePromiseParallel));
}

// 5
// 1000 tries took a mean of: 57.35
// 1000 tries took a mean of: 68.781

// 3
// 1000 tries took a mean of: 54.644
// 1000 tries took a mean of: 58.008

// serializeAndDesearializeTest();
timeTestBoth();

