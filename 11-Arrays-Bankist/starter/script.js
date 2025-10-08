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
