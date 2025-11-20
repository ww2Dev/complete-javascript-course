'use strict';
// ? OOP - Objects Oriented Programming
/*
    OOP is a programming paradigm (style) based on the concept of "objects", which can contain data and code: data in the form of fields (often known as attributes or properties), and code, in the form of procedures (often known as methods).

    const user ={
    name: 'John', //property
    age: 30, //property
    greet: function() { //method
        console.log('Hello, ' + this.name);
    }

    objects are self contained pieces / blocks of code that encapsulate data and functionality together.
    objects are building blocks of applications, and interact with one another.
    these interactions happen through a public interface (API) - a set of methods and properties that are exposed to the outside world, meaning outside of the object.
*/

// ? classes - blueprints for creating objects with similar properties and methods.
// class Person {
// constructor method is a special method for creating and initializing an object created with a class.
//   constructor(name, birthYear) {
//     this.name = name;
//     this.birthYear = birthYear;
//   }
// }
// const jonas = new Person('Jonas', 1991); // all things created from a class are called instances of that class

// ? the 4 pillars of OOP are:
//! 1. abstraction - hiding complex implementation details and showing only the necessary parts of an object or system to the user.
// A good example of abstraction is a phone. When you use a phone, you interact with a simple interface (buttons, touchscreen) without needing to understand the complex internal workings of the device (circuitry, software).

//! 2. encapsulation - bundling data and methods that operate on that data within a single unit or class, restricting direct access to some of the object's components.
//example: private properties and methods in classes
// class BankAccount {
//   #balance; // private property
//   owner; // public property
//   constructor(owner, initialBalance) {
//     this.owner = owner;
//     this.#balance = initialBalance;
//   }
// } // #balance is not accessible from outside the class
// BankAccount.#balance; // not accessible
// BankAccount.owner; // accessible
//! 3. inheritance - mechanism by which one class can inherit properties and methods from another class.
// example:
/*
class Animal {
  eat() {
    console.log('Eating...');
  }
}
class Dog extends Animal {
  bark() {
    console.log('Woof!');
  }
}
const myDog = new Dog();
myDog.eat(); // inherited from Animal
myDog.bark(); // defined in Dog
*/

//! 4. polymorphism - ability of different classes to be treated as instances of the same class through a common interface, allowing methods to be used on different objects in a way that is appropriate for their specific class.
// in basic terms it means, that a child class can override a method of its parent class with a different implementation.
// example:
/* 
  class Shape {
    area() {
      return 0;
    }
  }
  class Circle extends Shape {
    constructor(radius) { 
      super(); //! call the parent class constructor - because before using 'this' in the child class constructor we need to call this
      this.radius = radius; // specific property of Circle
    }
    area() {
      return Math.PI * this.radius * this.radius;
    } 
  }
  
  as you can see the area method is defined in both classes but with different implementations.
  the circle class overrides the area method of the shape class to provide a specific implementation for calculating the area of a circle.

*/

// ? how does OOP work in JavaScript?
/*
  JavaScript is a prototype-based language, which means that objects can inherit properties and methods from other objects. However, with the introduction of ES6, JavaScript also supports class-based OOP syntax, making it easier to create and manage objects using classes.
  classes in JavaScript are essentially syntactical sugar over the existing prototype-based inheritance and do not introduce a new object-oriented model.
  
*/
// ! objects are linked to a prototype object, the prototype object has properties and methods that can be shared across all instances of a particular object type.
// for example: an array inherits methods like push, pop, map, filter etc from Array.prototype
// const arr = [1, 2, 3];
// arr.map(num => num * 2); // map method is inherited from Array.prototype - Array.prototype.map()
// ! this behavior is called prototypal inheritance.

// ? how do we actually create prototypes? and how do we link objects to prototypes? how can we create our own classes and objects?

// ! there are 3 ways to achieve OOP in JavaScript:

//! 1. Constructor Functions (old way before ES6)
//  techniques to create objects from a function;
/* 
function Person(name, birthYear) {
  this.name = name;
  this.birthYear = birthYear;
}
*/
//!this is how built-in objects like Arrays,Maps or Sets are actually imeplemented

//! 2. ES6 Classes (modern way)
// classes are special functions, and just like functions, classes can be defined in two ways: class declarations and class expressions
// ! ES6 classes do not behave like traditional classes in other OOP languages. They are primarily syntactical sugar over JavaScript's existing prototype-based inheritance.

//!3. Object.create() method (prototype-based way)
// the easiest and most straightforward way to create an object with a specific prototype.
// not commonly used in practice for OOP, but important to understand the prototypal nature of JavaScript.

// ! constructor functions and normal functions are completely the same, the only difference is that constructor functions are called with the 'new' keyword.

// ? what happens when we use the 'new' keyword?
/*
1. A new empty object is created.
2. The function is called with 'this' set to the new object. (this = {})
3. The new object is linked to the prototype. (creates a __proto__ link to the constructor function's prototype)
! for example: john.__proto__  === Person.prototype - true
4. The function automatically returns the new object.
*/
const Person = function (name, birthYear) {
  console.log(this); // ? what is 'this' here?
  this.name = name;
  this.birthYear = birthYear;

  //! NEVER create methods inside constructor functions
  // this.calcAge = function () {
  //   console.log(2024 - this.birthYear);
  // };
}; //! arrow functions cannot be used as constructor functions because they do not have their own 'this' context.
const john = new Person('John', 1990);

// console.log(john instanceof Person); // true

// ? Prototypes
// every function in JavaScript has a property called prototype.
console.log(Person.prototype);
// we can add methods to the prototype property of the constructor function
Person.prototype.calcAge = function () {
  //! this creates ONE copy of the method and all instances share it
  console.log(2024 - this.birthYear);
};
john.calcAge(); // 34
// console.log(john.__proto__); // same as Person.prototype
// console.log(Person.prototype === john.__proto__); // true
// console.log(Person.prototype.isPrototypeOf(john)); // true
// console.log(Person.prototype.isPrototypeOf(Person)); // false
// ! false because Person.prototype is only for instances of Person, not for the Person function itself.

// we can also add properties to the prototype
Person.prototype.species = 'Homo Sapiens';

console.log(john.species); // Homo Sapiens //! same as doing john.__proto__.species
// ! the species is set on __proto__ (the prototype), not on the instance itself
// ! the property of species is not declared on john itself, but on john.__proto__ as its an inherited property
// console.log(john.hasOwnProperty('species')); // false
