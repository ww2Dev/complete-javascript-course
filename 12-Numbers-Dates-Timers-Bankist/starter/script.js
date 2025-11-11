'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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
// Functions
const formatDate = (date, locale) => {
  const daysPassed = calcDaysPassed(new Date(), new Date(date));
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(new Date(date));
  }
};
const formatCurrency = (value, currency, locale) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  console.log(account);

  const combinedMovsDates = account.movements.map((mov, i) => {
    return { movement: mov, date: account.movementsDates[i] };
  });
  const movs = sort
    ? combinedMovsDates.sort((a, b) => a.movement - b.movement)
    : combinedMovsDates;
  console.log(movs);

  movs.forEach((mov, i) => {
    const type = mov.movement > 0 ? 'deposit' : 'withdrawal';
    const displayDate = formatDate(mov.date, account.locale);
    const formattedMov = formatCurrency(
      mov.movement,
      account.currency,
      account.locale
    );
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.currency,
    acc.locale
  );
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(incomes, acc.currency, acc.locale);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.currency,
    acc.locale
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.currency,
    acc.locale
  );
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = () => {
  // set time to 5 seconds
  let time = 5 * 60;

  const tick = () => {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;

    // clear at 0s
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // decrease -1s after display
    time--;
  };
  //! we check and then decrease to avoid logging out at 00:01
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount, timer;
// // Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // start logout timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    const currentDate = new Date();
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(currentDate);

    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    // reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      // reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// in JS numbers are represented internally in 64 base 2 format, all numbers are floating point
//  meaning 23 === 23.0

//  base 10 - 0 to 9
//  base 2 - 0 and 1
// just how in base 10 we have 3/10 = 0.33333... in base 2 some numbers cannot be represented precisely
// examples:

// console.log(0.1 + 0.2); // 0.30000000000000004
// console.log(0.1 + 0.2 === 0.3); // false
// this is an error in JS floating point arithmetics due to base 2 representation

// to convert string to number
// console.log(Number('23'));
// console.log(+'23');
// this works because JS does type coercion when using the + operator

// parsing - extracting numbers from strings
// Number is also an object with methods
// console.log(Number.parseInt('30px', 10)); // 30
// console.log(Number.parseInt('e23', 10)); // NaN
// parseInt tries to extract number from the beginning of the string until it encounters a character that is not part of the number
// because the global isNan() function converts the value to a number before checking if it's NaN, it can produce some unexpected results

// second argument is the radix (base) of the numeral system to be used
// console.log(Number.parseFloat('2.5rem')); // 2.5
// console.log(Number.parseFloat('2.5.5rem')); // 2.5
// these methods are also available directly on the global object
// console.log(parseInt('30px', 10));
// console.log(parseFloat('2.5rem'));
// console.log(Number.isNaN(20)); // false
// console.log(Number.isNaN('20')); // false
// console.log(Number.isNaN(+'20X')); // true
// console.log(Number.isNaN(23 / 0)); // false
// Number.isNaN() is a more reliable way to check for NaN than the global isNaN() function

// console.log(Number.isFinite(20)); // true
// console.log(Number.isFinite('20')); // false
// console.log(Number.isFinite(+'20X')); // false
// console.log(Number.isFinite(23 / 0)); // false
// Number.isFinite() is a reliable way to check if a value is a number

// the difference between number.isNan and isFinite is that isNaN checks specifically for the NaN value, while isFinite checks if a value is a finite number (not NaN, not Infinity, and not -Infinity).

// summary:
// Number.isNaN() - checks if a value is  of type NaN
// Number.isFinite() - checks if a value is a finite (not NaN, not Infinity, and not -Infinity) number
// isNan() - checks if a value is Not a Number after type coercion "hello" -> not a number -> true
// Number.parseInt() - parses a string and returns an integer
// Number.parseFloat() - parses a string and returns a floating-point number

// MATH AND ROUNDING
// square root
// console.log(Math.sqrt(25)); // 5
// can also use exponentiation operator (**)
// console.log(25 ** (1 / 2)); // 5 (25^0,5)

// Maximum & minimum value
// console.log(Math.max(5, 18, 23, 11, 2)); // 23
// console.log(Math.max(5, 18, '23', 11, 2)); // 23 (type coercion)
// console.log(Math.max(5, 18, '23px', 11, 2)); // NaN (doesnt do parsing)

// console.log(Math.min(5, 18, 23, 11, 2)); // 2

// Math has constant properties
// console.log(Math.PI); // 3.141592653589793
// console.log(Math.PI * Number.parseFloat('10px') ** 2); // area of circle with radius 10px

// console.log(Math.random()); // random number between 0 and 1 (not including 1)
// console.log(Math.trunc(Math.random() * 6) + 1); // random integer between 1 and 6
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1)) + min;
// we do max - min + 1 to make sure max is inclusive
//  -min to shift the range from (0 to max-min) to (min to max-min+min) which is (min to max)
//  and +1 to include max in the range

// another way to do it is to use Math.round instead of Math.floor
// const randomInt = (min, max) =>
//   Math.round(Math.random() * (max - min)) + min;
// this works because Math.round will round up numbers >= .5
// so the maximum value of Math.random() * (max - min) is (max - min)
// lets assume max - min = 5
// so Math.random() * 5 can produce values from 0 to 5 (not including 5)
// when we add min to it, we get values from min to max (not including max)
// but when the value is 4.5 or higher, Math.round will round it up to 5
// thus including max in the range
// console.log(randomInt(10, 20));

// Math.trunc - removes decimal part (towards zero)
// Math.floor - rounds down to negative infinity
// Math.ceil - rounds up to positive infinity
// Math.round - rounds to nearest integer

// console.log(Math.trunc(4.7)); // 4
// console.log(Math.floor(4.7)); // 4
// console.log(Math.ceil(4.7)); // 5
// console.log(Math.round(4.7)); // 5

// console.log(Math.trunc(-4.7)); // -4 (removes decimal, moves towards zero)
// console.log(Math.floor(-4.7)); // -5 (rounds down towards negative infinity)
// console.log(Math.ceil(-4.7)); // -4 (rounds up towards positive infinity)
// console.log(Math.round(-4.7)); // -5

// ALL THESE METHODS DO TYPE COERCION "23" -> 23

// Rounding decimals
// console.log((2.7).toFixed(0)); // '3' (returns string)
// console.log((2.7).toFixed(3)); // '2.700'
// console.log((2.345).toFixed(2)); // '2.35'
// console.log((2.345).toFixed(1)); // '2.3'
// toFixed returns a string, so if you need a number, you have to convert it
// console.log(+(2.345).toFixed(2)); // 2.35

// remember that these are numbers, meaning they are primitive values
// behind the scenes JS does "boxing" which means it temporarily converts the primitive value to an object
// so that we can call methods on it
// after the method is called, the object is converted back to a primitive value
// like new Number(2.345).toFixed(2);

// REMAINDER OPERATOR
// console.log(5 % 2); // 1 (5 = 2 * 2 + 1)
// its 2 * 2 + 1 because 2 is the largest multiple of 2 that is less than or equal to 5
// console.log(5 / 2); // 2.5
// console.log(8 % 3); // 2 (8 = 3 * 2 + 2)
// console.log(8 / 3); // 2.6666...
// again 3 * 2 + 2 because 2 is the largest multiple of 3 that is less than or equal to 8

// even numbers
// console.log(6 % 2); // 0
// odd numbers
// console.log(7 % 2); // 1

const isEven = n => n % 2 === 0;
// console.log(isEven(8)); // true

const isPrime = n => {
  if (n <= 1) return false; // 0 and 1 are not prime numbers
  for (let i = 2; i <= Math.sqrt(n); i++) {
    // check divisibility up to the square root of n
    // Why sqrt(n)? Because factors come in pairs!
    // If n = a × b, then one factor must be ≤ √n and the other ≥ √n
    // Example: 36 = 4 × 9, where 4 ≤ √36(6) and 9 ≥ √36(6)
    // So if we check all numbers up to √n(in this example 6) and find no factors,
    // we know there are no factors beyond √n either (they would need a pair ≤ √n)
    // This cuts our checks from n-1 down to just √n iterations - much faster!

    if (n % i === 0) return false;
  }
  return true;
};
// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     // 0, 2 ,4,6
//     if (isEven(i)) {
//       row.style.backgroundColor = 'orangered';
//     }
//     // 0,3,6
//     if (i % 3 === 0) {
//       row.style.backgroundColor = 'blue';
//     }
//   });
// });

// without numeric separators
const diamaeter = 2874600000; // 2.8746 billion
// with numeric separators
const diameterUS = 2_874_600_000; // easier to read

const priceCents = 345_99; // 345.99
// console.log(priceCents); // 34599

const transferFee1 = 15_00; // looks like 15.00
const transferFee2 = 1_500; // looks like 1500
// but both are just 1500 in value

// when trying to convert strings with numeric separators to numbers, it will result in NaN
// console.log(Number('230_000')); // NaN
// console.log(parseInt('230_000')); // 230 because it stops parsing at the _ character

// NUMBERS
// numbers are represented in 64 bits, of these 64 only 53 are used to store the digits
// the other bits are used to store the position of the decimal point and the sign (positive or negative)
// this means that the largest number that can be represented accurately is 2^53 - 1
// which is 9007199254740991
// anything larger than this will lose precision
// console.log(2 ** 53 - 1); // 9007199254740991
// console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991

// thats why we have BigInt type in JS
// to represent numbers larger than 2^53 - 1 accurately
// BigInt can represent integers with arbitrary precision
// to create a BigInt, we can append n to the end of the number or use the BigInt() function
// console.log(48329047230947230947230947230947230947230n);
// console.log(BigInt(4832904723));
// keep in mind that BigInt cannot be used with regular numbers in arithmetic operations
// and that the BigInt() function and the n suffix are not interchangeable
// console.log(48329047230947230947230947230947230947230n);
// console.log(BigInt(48329047230947230947230947230947230947230)); // this will display a different value due to precision loss and will give an error if the number is too large

//? operations with BigInt
//! Math operations dont work with BigInt
// console.log(Math.sqrt(16n)); // TypeError: Cannot convert a BigInt value to a number

//! but we can do basic arithmetic operations
// console.log(10000n + 10000n); // 20000n

// console.log(48329047230947230947230947230947230947230n * 100000n);

// ! division with BigInt truncates the decimal part
// console.log(10n / 3n); // 3n (no decimal part, it truncates towards zero)
// console.log(10 / 3); // 3.3333333333333335

//! what we CANT do is mix BigInt and regular numbers
// console.log(10000n + 10000); // TypeError: Cannot mix BigInt and other types
// and thats where the BigInt() function comes in handy
// console.log(10000n + BigInt(10000)); // 20000n

//! in comparisons, JS does type coercion
// console.log(20n > 15); // true
// console.log(20n === 20); // false (strict equality, no type coercion)
// console.log(20n == 20); // true (loose equality, type coercion)

// bigInt is also converted to string when concatenated with a string
// console.log(20n + ' is a big number'); // '20 is a big number'

// ? DATES AND TIMES

// creating dates has 4 ways
//! 1. using the Date() constructor without arguments creates a date object with the current date and time - most common
// const now = new Date();
// console.log(now);

//! 2. creating a date from a date string - unreliable because different browsers may parse the string differently
// console.log(new Date('Aug 02 2023 18:05:41'));

//! 3. creating a date from year, month, day, hour, minute, second, millisecond (month is 0-indexed) - more reliable
// ? keep in mind that months are 0-indexed (0 = January, 11 = December) thats why its common to see month as month - 1
// console.log(new Date(2023, 7, 2, 18, 5, 41)); // Aug 02 2023 18:05:41
// console.log(new Date(2023, 0, 31)); // Jan 31 2023

//! 4. creating a date from milliseconds since Jan 1 1970 (Unix epoch time) - useful for date calculations
// console.log(new Date(0)); // Jan 01 1970
// console.log(new Date(3 * 24 * 60 * 60 * 1000)); // Jan 04 1970 (3 days later)

// ! dates perform auto correction
// console.log(new Date(2023, 10, 31)); // Nov 31 2023 -> Dec 01 2023 (November has only 30 days)

//? working with dates
// const future = new Date(2030, 10, 19, 15, 23);
// console.log(future); // Nov 19 2030 15:23:00
// console.log(future.getFullYear()); // 2030 //! dont use getYear() - returns years since 1900
// console.log(future.getMonth()); // 10 (November, 0-indexed)
// console.log(future.getDate()); // 19 (day of the month)
// console.log(future.getDay()); // 2 (Tuesday, 0 = Sunday, 6 = Saturday) days also 0-indexed
// console.log(future.getHours()); // 15
// console.log(future.getMinutes()); // 23
// console.log(future.getSeconds()); // 0
// console.log(future.toISOString()); // 2030-11-19T14:23:00.000Z (in UTC time) //! the Z indicates that the time is in UTC
// console.log(future.getTime()); // 1920309780000 (milliseconds since Jan 1 1970)
// console.log(new Date(1920309780000)); // Nov 19 2030 15:23:00 (creating date from milliseconds)

// console.log(Date.now()); // current timestamp in milliseconds since Jan 1 1970
// ? all of these methods have setter counterparts to set specific parts of the date
// future.setFullYear(2040);
// console.log(future); // Nov 19 2040 15:23:00
/////////////////////////////////////////////////

//? operations with dates
// const future = new Date(2030, 10, 19, 15, 23);
// console.log(+future); // 1920309780000 (timestamp in milliseconds)

function calcDaysPassed(date1, date2) {
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
} // difference in milliseconds divided by milliseconds in a day
//! we use Math.abs to get the absolute difference between the two dates (-10 becomes 10)

// console.log(calcDaysPassed(new Date(2030, 10, 19), new Date(2030, 10, 31))); // 12

//? new internationalization API (intl)
// the difference between doing Intl.DateTimeFormat and using toLocaleDateString is that the former allows more customization and options
//  as well as being more performant for multiple date formatting since it creates a formatter object that can be reused
//  while toLocaleDateString creates a new formatter object each time it is called

// internationalizing numbers
const num = 3884764.23;
const options = {
  style: 'currency', // 'unit', 'percent', 'currency'
  // unit: 'celsius', // 'mile-per-hour', 'kilometer-per-hour', 'celsius', 'fahrenheit', 'liter', 'gallon', 'kilogram', 'pound'
  currency: 'EUR', // required if style is 'currency'
  // currencyDisplay: 'code', // 'symbol', 'narrowSymbol', 'code', 'name'
  // minimumFractionDigits: 2, // to control decimal places
  // maximumFractionDigits: 2, // to control decimal places
  // useGrouping: false, // to disable thousands separator
};
console.log(new Intl.NumberFormat('en-US', options).format(num));

// Timers: setTimeout and setInterval
//? setTimeout - executes a function after a specified delay (in milliseconds)
// setTimeout(() => {
//   console.log('This message is delayed by 2 seconds');
// }, 2000);

// ? setInterval - executes a function repeatedly at specified intervals (in milliseconds)
// setInterval(() => {
//   console.log('This message is repeated every 1 second');
// }, 1000);
// ? the setInterval will keep running until it is stopped using clearInterval or the page is closed meaning it will keep putting the callback function in the callback queue every interval

//! the third argument and onwards in setTimeout and setInterval are the arguments to be passed to the callback function
// const ingredients = ['olives', 'spinach'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => {
//     console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`);
//   },
//   3000,
//   ...ingredients
// );
//! you can cancel the timer using clearTimeout
// clearTimeout(pizzaTimer); // cancels the timer before it executes

//! important note: the callback function is executed after the delay/interval, but the actual delay/interval may be longer due to the event loop and other tasks being executed
//!  so the delay is a minimum delay, not an exact delay since the callback is placed in the callback queue, it will only be executed after the call stack and micro task queue is empty
// ? these are web APIs and are not part of the JS language itself, they are provided by the browser environment

// const clock = setInterval(() => {
//   const now = new Date();

//   console.log(
//     now.toLocaleTimeString('en-IL', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     })
//   );
// }, 1000);
/////////////////////////////////////////////////
