'use strict';

//  for functions there are 3 methods
//  bind, apply, call
const lufthansa = {
  airline: 'Lufthansa',
  iataCode: 'LH',
  bookings: [],
  book(flightNum, name) {
    console.log(
      `${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`
    );
    this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
  },
};

lufthansa.book(239, 'John Smith');
lufthansa.book(635, 'Mary Cooper');
console.log(lufthansa);
//  returns the lufthansa object with 2 bookings

const eurowings = {
  airline: 'Eurowings',
  iataCode: 'EW',
  bookings: [],
};
const book = lufthansa.book;
//  does NOT work
//  book(23, 'Sarah Williams');
//  because this keyword points to undefined
//  in order to fix this we use call method
book.call(eurowings, 23, 'Sarah Williams');
console.log(eurowings);
//  works
//  {airline: 'Eurowings', iataCode: 'EW', bookings: Array(1)}

// you can also use call method to call lufthansa's book method on lufthansa object
book.call(lufthansa, 239, 'Mary Cooper');
console.log(lufthansa);

// old way of doing it with apply method
const flightData = [583, 'George Cooper'];
book.apply(eurowings, flightData);
console.log(eurowings);
//  works
//  {airline: 'Eurowings', iataCode: 'EW', bookings: Array(2)}
//  but apply method is not used that often anymore
//  because we can use call method with spread operator
book.call(eurowings, ...flightData);
console.log(eurowings);
//  works
//  {airline: 'Eurowings', iataCode: 'EW', bookings: Array(3)}

// bind method

// the difference between bind and call method is that
// bind method does not immediately call the function
// instead it returns a new function where this keyword is bound
const bookEW = book.bind(eurowings);
// this returns a new function
bookEW(23, 'Steven Williams');
console.log(eurowings);
//  works
//  {airline: 'Eurowings', iataCode: 'EW', bookings: Array(4)}

const bookLH = book.bind(lufthansa);
bookLH(239, 'John Smith');
console.log(lufthansa);
//  works
//  {airline: 'Lufthansa', iataCode: 'LH', bookings: Array(3)}

// notice we dont need to pass the this keyword anymore
// we can also preset parameters
const bookEW23 = book.bind(eurowings, 23);
bookEW23('Martha Cooper');
bookEW23('James Bond');
console.log(eurowings);
//  works
//  {airline: 'Eurowings', iataCode: 'EW', bookings: Array(6)}

// with event listeners
lufthansa.planes = 300;
lufthansa.buyPlane = function () {
  console.log(this);
  this.planes++;
  console.log(this.planes);
};
document
  .querySelector('.buy')
  .addEventListener('click', lufthansa.buyPlane.bind(lufthansa));
//  without bind method this keyword would point to the button element
//  and not to the lufthansa object
//  so we use bind method to bind this keyword to lufthansa object
//  the this keyword is always attached to the function that is calling it

// partial application
const addTax = (rate, value) => value + value * rate;
console.log(addTax(0.1, 200));

const addVAT = addTax.bind(null, 0.23);
//  we dont care about this keyword so we set it to null
// same as writing addVAT = value => value + value * 0.23
console.log(addVAT(100));
console.log(addVAT(23));

const addTaxRate = function (rate) {
  return function (value) {
    return value + value * rate;
  };
};
const addVAT2 = addTaxRate(0.23);
console.log(addVAT2(100));
console.log(addVAT2(23));

//  Coding Challenge #1

/* 
Let's build a simple poll app!

A poll has a question, an array of options from which people can choose, and an array with the number of replies for each option. This data is stored in the starter object below.

Here are your tasks:

1. Create a method called 'registerNewAnswer' on the 'poll' object. The method does 2 things:
  1.1. Display a prompt window for the user to input the number of the selected option. The prompt should look like this:
        What is your favourite programming language?
        0: JavaScript
        1: Python
        2: Rust
        3: C++
        (Write option number)
  
  1.2. Based on the input number, update the answers array. For example, if the option is 3, increase the value AT POSITION 3 of the array by 1. Make sure to check if the input is a number and if the number makes sense (e.g answer 52 wouldn't make sense, right?)
2. Call this method whenever the user clicks the "Answer poll" button.
3. Create a method 'displayResults' which displays the poll results. The method takes a string as an input (called 'type'), which can be either 'string' or 'array'. If type is 'array', simply display the results array as it is, using console.log(). This should be the default option. If type is 'string', display a string like "Poll results are 13, 2, 4, 1". 
4. Run the 'displayResults' method at the end of each 'registerNewAnswer' method call.

HINT: Use many of the tools you learned about in this and the last section 😉

BONUS: Use the 'displayResults' method to display the 2 arrays in the test data. Use both the 'array' and the 'string' option. Do NOT put the arrays in the poll object! So what shoud the this keyword look like in this situation?

BONUS TEST DATA 1: [5, 2, 3]
BONUS TEST DATA 2: [1, 5, 3, 9, 6, 1]

GOOD LUCK 😀
*/
const poll = {
  question: 'What is your favourite programming language?',
  options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],
  // This generates [0, 0, 0, 0]. More in the next section 😃
  answers: new Array(4).fill(0),
  registerNewAnswer() {
    const answer = Number(
      prompt(`${this.question}
${this.options.join('\n')}
(Write option number)`)
    );

    typeof answer === 'Number' &&
      answer >= 0 &&
      answer <= this.options.length - 1 &&
      this.answers[answer]++;

    this.displayResults();
    this.displayResults('string');
  },
  displayResults(type = 'array') {
    if (type === 'array') console.log(this.answers);
    if (type === 'string')
      console.log(`Poll results are ${this.answers.join(', ')}.`);
  },
};

document
  .querySelector('.poll')
  .addEventListener('click', poll.registerNewAnswer.bind(poll));

// bonus
poll.displayResults.call({ answers: [5, 2, 3] }, 'string');
poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] }, 'string');

// IIFE
// immediately invoked function expression
// a function that runs once and never again
// used to create a new scope and avoid polluting the global scope
// also used to create private variables and methods

(function () {
  console.log('This will never run again');
  const isPrivate = 23;
})();
//  console.log(isPrivate); //  error, isPrivate is not defined
(() => console.log('This will ALSO never run again'))();

{
  const isPrivate = 23;
  var notPrivate = 46;
}
//  console.log(isPrivate); //  error, isPrivate is not defined
console.log(notPrivate); //  46, VAR is function scoped and not block scoped

// CLOSURES
// A closure is created when a function "remembers" variables from its outer scope,
// even after that outer function has finished executing.

// Key points:
// 1. Closures happen automatically - we don't create them manually
// 2. The inner function maintains access to the outer function's variables
// 3. This works even after the outer function has returned
// 4. It's like the function carries a "backpack" with the variables it needs
// 5. as long as the variable environment is reachable, the closure stays alive (isnt garbage collected)

// Technical definition:
// A closure is the combination of a function and the lexical environment
// within which that function was declared. This environment consists of
// any local variables that were in scope at the time the closure was created.

const secureBooking = function () {
  let passengerCount = 0;

  return function () {
    passengerCount++;
    console.log(`${passengerCount} passengers`);
  };
};

const booker = secureBooking();
booker();
booker();
booker();

//  any function always has access to the variable environment of the execution context
//  in which it was created, even after that execution context is gone
// the closure is basically the variable environment attached to the function,
// exactly as it was at the time and place the function was created

// more examples of closures
let f;
const g = function () {
  const a = 23;
  f = function () {
    console.log(a * 2);
  };
};
g(); // g is called and f is assigned
f(); // 46
//  because f is a closure that has access to the variable environment of g
//  even though g has finished executing
// f is called in the global scope but it still has access to a variable of g because at the time of creation it was in the scope of g and so it remembers / closed over that variable environment
console.dir(f); //  shows the closure with a variable

// re-assigning f function

const h = function () {
  const b = 777;
  f = function () {
    console.log(b * 2);
  };
};
h(); // h is called and f is reassigned, closure is changed
f(); // 1554
//  because f is now a closure that has access to the variable environment of h
//  even though h has finished executing
console.dir(f); //  shows the closure with b variable

//  Example 2
const boardPassengers = function (n, wait) {
  const perGroup = n / 3;
  setTimeout(function () {
    console.log(`We are now boarding all ${n} passengers`);
    console.log(`There are 3 groups, each with ${perGroup} passengers`);
  }, wait * 1000);
  console.log(`Will start boarding in ${wait} seconds`);
};
const perGroup = 1000; //  this variable is not used by boardPassengers function because it uses its own perGroup variable
// if there was no perGroup variable inside boardPassengers function then this variable would be used
boardPassengers(180, 3);
//  Will start boarding in 3 seconds
//!  after 3 seconds
//  We are now boarding all 180 passengers
//  There are 3 groups, each with 60 passengers
//  the inner function of setTimeout is a closure that has access to the variable environment of boardPassengers function even after boardPassengers has finished executing
//  because the inner function is executed after a certain time (3 seconds) and at that time boardPassengers has already finished executing
//  but the inner function still has access to n and perGroup variables because they are in the closure scope
//  this is possible because of closures

// Coding Challenge #2

/* 
This is more of a thinking challenge than a coding challenge 🤓

Take the IIFE below and at the end of the function, attach an event listener that changes the color of the selected h1 element ('header') to blue, each time the BODY element is clicked. Do NOT select the h1 element again!

And now explain to YOURSELF (or someone around you) WHY this worked! Take all the time you need. Think about WHEN exactly the callback function is executed, and what that means for the variables involved in this example.

GOOD LUCK 😀
*/

(function () {
  const header = document.querySelector('h1');
  header.style.color = 'red';
  document.querySelector('body').addEventListener('click', () => {
    header.style.color = 'blue';
  });
  // the callback function is executed when the body is clicked
  // at that time the IIFE has already finished executing
  // but the callback function is a closure that has access to the variable environment of the IIFE
  // so it can access the header variable even though the IIFE has finished executing
  // this is because the callback function maintains a reference to the variable environment of the IIFE
  // and as long as that variable environment is reachable (the event listener is still active)
  // the closure stays alive and can access the variables in that environment
})();
