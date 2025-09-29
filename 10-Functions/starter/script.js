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
