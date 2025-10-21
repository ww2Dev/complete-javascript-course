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
    // console.log(`Movement ${i + 1}: ${type} of ${Math.abs(movement)}`);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${Math.abs(movement)}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsername = user =>
  user
    .toLowerCase()
    .split(' ')
    .reduce((initials, name) => initials + name[0], '');

const createUsernames = accs =>
  accs.forEach(acc => {
    // forEach is used because it mutates the original array
    acc.username = createUsername(acc.owner);
  });

createUsernames(accounts);
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // console.log(`Current balance: ${balance}`);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = ({ interestRate, movements }) => {
  const incomes = movements
    .filter(mov => mov > 0) // deposits
    .reduce((acc, mov) => acc + mov, 0); // sum of deposits
  labelSumIn.textContent = `${incomes}€`;
  const outcomes = movements
    .filter(mov => mov < 0) // withdrawals
    .reduce((acc, mov) => acc + mov, 0); // sum of withdrawals
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
  const interest = movements
    .filter(mov => mov > 0) // deposits
    .map(deposit => deposit * interestRate)
    .filter(int => int >= 1) // bank only pays interest if it is at least 1€
    .reduce((acc, int) => acc + int, 0); // sum of interest
  labelSumInterest.textContent = `${parseFloat(interest.toFixed(2))}€`;
};
// a good practice in javascript is to NOT mutate the original array, so dont use methods like splice or reverse that mutate the original array, use slice, concat, etc that do not mutate the original array

const updateUI = currentAcc => {
  // Display movements
  displayMovements(currentAcc.movements);
  // Display balance
  calcDisplayBalance(currentAcc);
  // Display summary
  calcDisplaySummary(currentAcc);
};

// Events handlers
let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault(); // prevent form from submitting

  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  currentAccount = accounts.find(acc => acc.username === username);
  console.log('currentAccount', currentAccount);
  if (currentAccount?.pin === pin) {
    // Login successful

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
    // Update UI
    updateUI(currentAccount);
  }
});

// TRAMSFER MONEY

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const to = inputTransferTo.value;

  // check if account exists
  const receiverAcc = accounts.find(acc => acc.username === to);
  // clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
  // validation
  if (
    !receiverAcc ||
    amount <= 0 ||
    currentAccount.balance < amount ||
    receiverAcc?.username === currentAccount.username
  ) {
    console.log('Transfer invalid');
    return;
  }

  // transfer the money
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);

  updateUI(currentAccount);
});

// REQUEST LOAN
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // only approve loan if there is at least one deposit with at least 10% of the requested loan amount
    // add movement
    currentAccount.movements.push(amount);
    // update UI
    updateUI(currentAccount);
  }

  // clear input field
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// CLOSE ACCOUNT
btnClose.addEventListener('click', e => {
  e.preventDefault();
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  // check that username & pin match current logged in user.
  if (currentAccount?.pin === pin && currentAccount?.username === username) {
    // delete current account
    accounts.splice(
      accounts.findIndex(acc => acc === currentAccount),
      1
    );
    currentAccount = undefined;
    // Clear input fields
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    inputClosePin.blur();
    //  update UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
});

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
// movements.forEach((movement, i, array) => console.log(movement, i, array));
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
// currenciesMap.forEach((value, key, map) => {
//   console.log(`${key}: ${value}`);
// });

// USD: United States dollar
// EUR: Euro
// GBP: Pound sterling

// forEach with Sets
const currenciesSet = new Set(['USD', 'EUR', 'GBP']);
// currenciesSet.forEach((value, _, set) => {
//   // _ is used to ignore the second parameter (key), since Sets do not have keys
//   console.log(`${value}: ${value}`);
// });
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

// function checkDogs(dogsJulia, dogsKate) {
//   const cleanData = [...dogsJulia.slice(1, -2), ...dogsKate];
//   cleanData.forEach((age, i) => {
//     age >= 3
//       ? console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`)
//       : console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//   });
// }

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// DATA TRANSFORMATION METHODS - MAP, FILTER, REDUCE

const arrtest = [1, 2, 3, 4, 5];
// MAP - does not mutate the original array
// similar to forEach, but returns a new array
const arrtest2 = arrtest.map(x => x * 2);
// console.log(arrtest2); // [2, 4, 6, 8, 10]

// FILTER - does not mutate the original array
// creates a new array with all elements that pass the test implemented by the provided function
const arrtest3 = arrtest.filter(x => x % 2 === 0);
// console.log(arrtest3); // [2, 4]

// REDUCE - does not mutate the original array
// executes a reducer function (that you provide) on each element of the array, resulting in a single output value
const arrtest4 = arrtest.reduce((acc, curr) => acc + curr, 0);
// console.log(arrtest4); // 15

const eurToUsd = 1.1;
// const movementsUSD = movements.map(mov => mov * eurToUsd);
// console.log(movements);
// console.log(movementsUSD);

// old way of doing the same thing
// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);
// const user = 'Steven Thomas Williams'; // stw
// Using map + join approach
// const userName = user
//   .toLowerCase()
//   .split(' ')
//   .map(name => name[0])
//   .join('');

// Alternative using reduce (more direct)
// const userNameReduce = user
//   .toLowerCase()
//   .split(' ')
//   .reduce((initials, name) => initials + name[0], '');
// // map has the same 3 parameters as forEach (current element, index, entire array)
// const movementsDescriptions = movements.map(
//   (mov, i, arr) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )} in ${arr.length} total movements`
// );
// console.log(movementsDescriptions);
// console.log(movementsDescriptions);
const deposits = movements.filter(mov => mov > 0);
// old way of doing the same thing
// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);
// the difference between filter and for of is that filter returns a new array and for of does not which allows method chaining
const withdrawals = movements.filter(mov => mov < 0);

const balance = movements.reduce((bal, mov, i, arr) => bal + mov, 0);
// old way of doing the same thing
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// Maximum value in an array
const max = movements.reduce(
  (acc, mov) => (acc > mov ? acc : mov),
  movements[0]
);
// console.log(max);
// console.log(movements);

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const calcAverageHumanAge = ages =>
  ages
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4)) // convert to human age
    .filter(humanAge => humanAge >= 18) // filter out dogs less than 18 human years
    .reduce((acc, age, _, arr) => acc + age / arr.length, 0); // calculate average age

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

const totalDepositsUSD = movements
  .filter(mov => mov > 0) // deposits
  .map((mov, i, arr) => mov * eurToUsd) // in USD note: the arr is the arr returned from the previous method
  .reduce((acc, mov) => acc + mov, 0); // total balance in USD

// FIND - returns the first element that satisfies the condition
const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);
// let oldAccount = {};
// for (const acc of accounts) {
//   if (acc.owner === 'Jessica Davis') {
//     oldAccount = acc;
//   }
// }

// FindLast and FindLastIndex methods
const lastWithdrawal = movements.findLast(mov => mov < 0);
const lastWithdrawalIndex = movements.findLastIndex(mov => mov < 0);
// console.log(lastWithdrawal);
// console.log(lastWithdrawalIndex);

// SOME - returns true if at least one element satisfies the condition
const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits); // true

// EVERY - returns true if all elements satisfy the condition
const allDeposits = movements.every(mov => mov > 0);
// console.log(allDeposits); // false

// this is different from EQUALITY like movements.includes(-130) because it allows us to test based on a condition

// Flat method - removes one level of nesting in an array
const arrFlat = [[1, 2, 3], [4, 5, 6], 7, 8];
const arrFlatDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrFlat.flat()); // [1, 2, 3, 4, 5, 6, 7, 8]
// console.log(arrFlatDeep.flat(2)); // [1, 2, 3, 4, 5, 6, 7, 8]

const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);
// flatMap method - combines map and flat methods, flattens only one level deep
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

// Coding Challenge #4

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/

const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

// 1.
const huskyWeight = breeds.find(
  breed => breed.breed === 'Husky'
)?.averageWeight;
console.log(huskyWeight);

// 2.
const dogBothActivities = breeds.find(
  breed =>
    breed.activities.includes('running') && breed.activities.includes('fetch')
);
console.log(dogBothActivities);
// 3.
const allActivities = breeds.flatMap(breed => breed.activities);
console.log(allActivities);

// 4.
const uniqueActivities = [
  ...new Set(breeds.flatMap(breed => breed.activities)),
];
console.log(uniqueActivities);
// or
// const uniqueActivities = [...new Set(allActivities)];

// 5.
const swimmingAdjacent = [
  ...new Set(
    breeds
      .filter(breed => breed.activities.includes('swimming'))
      .flatMap(breed => breed.activities)
  ),
];
console.log(swimmingAdjacent);

// 6.
console.log(breeds.every(breed => breed.averageWeight >= 10));
// 7.
console.log(breeds.some(breed => breed.activities.length >= 3));

// BONUS:
console.log(
  Math.max(
    ...breeds
      .filter(breed => breed.activities.includes('fetch'))
      .map(breed => breed.averageWeight)
  )
);

function twoSum(nums, target) {
  const hashMap = new Map();
  for (let i = 0; i < nums.length; i++) {
    let current = nums[i];
    // current + complement = target
    // complement = target - current
    let complement = target - current;
    if (hashMap.has(complement)) {
      return [hashMap.get(complement), i];
    } else {
      hashMap.set(current, i);
    }
  }
}

console.log(twoSum([2, 7, 11, 15], 9)); // Output: [0, 1]
console.log(twoSum([1, 2, 3, 4, 5], 5)); // Output: [1, 2]
console.log(twoSum([3, 2, 4], 6)); // Output: [1, 2]

// Testing the duplicate problem case
console.log('=== Duplicate Problem Case ===');
console.log(twoSum([2, 5, 3, 2, 4], 6)); // [3,4]
