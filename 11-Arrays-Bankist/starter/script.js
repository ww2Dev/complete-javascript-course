'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = ''; // clears the container before adding new movements
  //! innerHTML is a property that allows us to get or set the HTML content of an element
  movements.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    console.log(`Movement ${i + 1}: ${type} of ${Math.abs(movement)}`);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${Math.abs(movement)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e'];

//! SLICE- does not mutate the original array
// console.log(movements.slice(2));
// console.log(movements.slice(2, 4));
// console.log(movements.slice(-2));
// console.log(movements.slice(1, -2));
// console.log(movements.slice()); // shallow copy of the array
// console.log([...movements]); // shallow copy of the array

// !SPLICE - mutates the original array
// console.log(arr.splice(2)); // mutates the original array, returns the removed elements
// arr.splice(-1); // removes the last element
// arr.splice(1, 2); // removes 2 elements starting from index 1 (start, deleteCount)

//! REVERSE - mutates the original array
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse()); // mutates the original array
// console.log(arr2); // reversed array
// console.log(arr); // original array

//! CONCAT - does not mutate the original array
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]); // same as concat

//! JOIN - does not mutate the original array
// console.log(letters.join(' - ')); // joins the array elements into a string with the specified separator

//! AT - does not mutate the original array
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0)); // same as arr[0]
// // getting the last array element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]); // returns a new array with the last element ([64]), then we access the first element of that array
// console.log(arr.at(-1)); // same as above, but cleaner
// console.log('jonas'.at(0)); // works on strings too
// console.log('jonas'.at(-1));

//? use when you want to chain methods or when you want to use negative indices

// forEach with Maps and Sets (value, index, entire array)
//  a callback function is a function that is passed as an argument and is called later in the code

//  forEach does not support break and continue, so you cannot exit the loop early
movements.forEach((movement, i, array) => console.log(movement, i, array));
// 0: 200
// 1: 450
// 2: -400
// ...
// 7: 1300

// forEach with Maps
const currenciesMap = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
currenciesMap.forEach((value, key, map) => {
  console.log(`${key}: ${value}`);
});

// USD: United States dollar
// EUR: Euro
// GBP: Pound sterling

// forEach with Sets
const currenciesSet = new Set(['USD', 'EUR', 'GBP']);
currenciesSet.forEach((value, _, set) => {
  // _ is used to ignore the second parameter (key), since Sets do not have keys
  console.log(`${value}: ${value}`);
});
// USD: USD
// EUR: EUR
// GBP: GBP

// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

function checkDogs(dogsJulia, dogsKate) {
  const cleanData = [...dogsJulia.slice(1, -2), ...dogsKate];
  cleanData.forEach((age, i) => {
    age >= 3
      ? console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`)
      : console.log(`Dog number ${i + 1} is still a puppy 🐶`);
  });
}

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// DATA TRANSFORMATION METHODS - MAP, FILTER, REDUCE

const arrtest = [1, 2, 3, 4, 5];
// MAP - does not mutate the original array
// similar to forEach, but returns a new array
const arrtest2 = arrtest.map(x => x * 2);
console.log(arrtest2); // [2, 4, 6, 8, 10]

// FILTER - does not mutate the original array
// creates a new array with all elements that pass the test implemented by the provided function
const arrtest3 = arrtest.filter(x => x % 2 === 0);
console.log(arrtest3); // [2, 4]

// REDUCE - does not mutate the original array
// executes a reducer function (that you provide) on each element of the array, resulting in a single output value
const arrtest4 = arrtest.reduce((acc, curr) => acc + curr, 0);
console.log(arrtest4); // 15

const eurToUsd = 1.1;
const movementsUSD = movements.map(mov => mov * eurToUsd);
console.log(movements);
console.log(movementsUSD);

// old way of doing the same thing
const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

// map has the same 3 parameters as forEach (current element, index, entire array)
const movementsDescriptions = movements.map(
  (mov, i, arr) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )} in ${arr.length} total movements`
);
console.log(movementsDescriptions);
