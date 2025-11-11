'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// // Focus Guard - Reusable focus trapping utility
// const createFocusGuard = container => {
//   let lastFocusedElement = null;
//   let isActive = false;

//   // Get all focusable elements within a container
//   const getFocusableElements = (element = container) => {
//     const focusableElementsString =
//       'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), input[type="email"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
//     const focusableElements = element.querySelectorAll(focusableElementsString);

//     // Filter out hidden elements
//     return Array.from(focusableElements).filter(el => {
//       return (
//         el.offsetWidth > 0 && el.offsetHeight > 0 && !el.hasAttribute('hidden')
//       );
//     });
//   };

//   // Handle tab key navigation within container
//   const handleTabKey = e => {
//     if (!isActive || e.key !== 'Tab') return;

//     e.preventDefault();

//     const focusableElements = getFocusableElements();
//     if (focusableElements.length === 0) return;

//     const firstElement = focusableElements[0];
//     const lastElement = focusableElements[focusableElements.length - 1];
//     const currentIndex = focusableElements.indexOf(document.activeElement);

//     if (e.shiftKey) {
//       // Shift + Tab (backwards)
//       if (currentIndex <= 0) {
//         lastElement.focus();
//       } else {
//         focusableElements[currentIndex - 1].focus();
//       }
//     } else {
//       // Tab (forwards)
//       if (currentIndex >= focusableElements.length - 1 || currentIndex === -1) {
//         firstElement.focus();
//       } else {
//         focusableElements[currentIndex + 1].focus();
//       }
//     }
//   };

//   // Public methods
//   return {
//     activate() {
//       if (isActive) return;

//       lastFocusedElement = document.activeElement;
//       isActive = true;

//       // Add event listener
//       document.addEventListener('keydown', handleTabKey);

//       // Focus first element after a small delay
//       setTimeout(() => {
//         const focusableElements = getFocusableElements();
//         if (focusableElements.length > 0) {
//           focusableElements[0].focus();
//         }
//       }, 10);
//     },

//     deactivate() {
//       if (!isActive) return;

//       isActive = false;

//       // Remove event listener
//       document.removeEventListener('keydown', handleTabKey);

//       // Return focus to previously focused element
//       if (lastFocusedElement) {
//         lastFocusedElement.focus();
//         lastFocusedElement = null;
//       }
//     },

//     isActive() {
//       return isActive;
//     },
//   };
// };

// // Create focus guard instance for the modal
// const modalFocusGuard = createFocusGuard(modal);

const openModal = function (e) {
  e.preventDefault();

  document.body.style.overflow = 'hidden'; // Disable scrolling when modal is open
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');

  // // Activate focus guard
  // modalFocusGuard.activate();
};

const closeModal = function () {
  document.body.style.overflow = 'auto'; // Enable scrolling when modal is closed
  modal.classList.add('hidden');
  overlay.classList.add('hidden');

  // // Deactivate focus guard
  // modalFocusGuard.deactivate();
};
console.log('modalbuttons', btnsOpenModal);

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

buttonScrollTo.addEventListener('click', e => {
  // ? old way of scrolling / getting element coordinates
  const section1coords = section1.getBoundingClientRect();
  console.log('section1coords', section1coords);
  //!  returns size of element and its position relative to viewport
  /*
   {
    x: measured from left edge of viewport,
    y: measured from top edge of viewport,
    width, height,
    top: measured from top edge of viewport,
    right: measured from left edge of viewport + width,
    bottom: measured from top edge of viewport + height,
    left: measured from left edge of viewport
    } */
  //  ! left == x and top == y, right == left + width, bottom == top + height
  console.log('buttonScrollTocoords', e.target.getBoundingClientRect());

  //? scroll position relative to the entire document
  // console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset); // old way (deprecated)
  console.log('current scroll (X/Y)', window.scrollX, window.scrollY);

  // ? viewport dimensions
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  // ? scrolling
  //! old way
  // window.scrollTo(
  //   section1coords.left + window.scrollX,
  //   section1coords.top + window.scrollY
  // );
  //! modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////////////////////////
////////////////////////////////////////////
//? Selecting DOM elements
// console.log(document.documentElement); // Logs the entire HTML document
// console.log(document.head); // Logs the head element
// console.log(document.body); // Logs the body element

const header = document.querySelector('.header'); // Selects the first element with class 'header'
// const sections = document.querySelectorAll('.section'); // Selects all elements with class 'section'
// const section1 = document.getElementById('section--1'); // Selects the element with ID 'section--1'
// const buttons = document.getElementsByTagName('button'); // selects all button elements
// const btns = document.getElementsByClassName('btn'); // selects all elements by class name 'btn'
// ! getElementsByTagName and getElementsByClassName return live HTMLCollections which means they update automatically when the DOM changes.
// ! In contrast, querySelectorAll returns a static NodeList that does not update automatically.

// ? creating and inserting elements
const message = document.createElement('div'); // Creates a DOM object representing a <div> element
message.classList.add('cookie-message'); // we can use DOM methods to manipulate it
// message.textContent =
//   'We use cookies for improved functionality and analytics.'; // using textContent to add text content
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>'; // using innerHTML instead of textContent to add HTML content

// ? inserting elements
// header.prepend(message); // adds as the first child of header
// header.append(message); // adds as the last child of header
// ! Note that an element can only be in one place in the DOM at a time.
// ! so if we try to append the same element again, it will move it from its previous position to the new position.
// !  thus, to add the same element in multiple places, we need to clone it first.
// header.prepend(message);
// header.append(message.cloneNode(true)); // to add a copy of the element in multiple places

// header.before(message); // adds the element before the header
header.after(message); // adds the element after the header

// ? deleting elements
document.querySelector('.btn--close-cookie')?.addEventListener('click', e => {
  message.remove(); // removes the element from the DOM
  //! before remove() method was introduced, the old way to remove an element was:
  // message.parentElement.removeChild(message); // moving from child to parent is called DOM traversing
});

///////////////////////////////////////
// ? Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// console.log(message.style.color); // .someproperty only works for inline styles
// console.log(getComputedStyle(message).color); // to get all styles, including those from CSS files
//! the difference between message.style and getComputedStyle(message) is that the former only accesses inline styles set directly on the element (meaning only inline styles applied will have a value, the rest will be empty), while the latter retrieves all computed styles applied to the element, including those from external stylesheets and inherited styles (meaning the object you are returned is one in which all keys are properties that have a value).

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px'; // message.height returns a string with 'px' at the end, so we need to parse it to a number first

// ? CSS custom properties (variables)
document.documentElement.style.setProperty('--color-primary', 'orangered'); // changing the value of a CSS variable
// ! setProperty takes two arguments: the property name (with -- for CSS variables) and the value to set. it works on any element.
// message.style.setProperty('background-color', 'blue'); //! changing the background color of the message element using setProperty (must use kebab-case for CSS properties)
//! root element is document.documentElement, so root CSS variables are defined there

// ? attributes
const logo = document.querySelector('.nav__logo');
// standard attributes
// console.log(logo.alt); // bankist logo
// non-standard attributes
// console.log(logo.designer); // undefined
// ! non-standard attributes are not directly accessible as properties of the DOM element since they are not part of the standard set of attributes defined for that element type JS doesnt automatically create them on the Object.

// console.log(logo.getAttribute('designer')); // Jonas Schmedtmann
//! non-standard attributes can be accessed using getAttribute

// ? setting attributes
// logo.alt = 'Beautiful minimalist logo'; // standard attribute
// logo.setAttribute('company', 'Bankist'); // non-standard attribute

// console.log(logo.src) // absolute URL
// to get the relative URL as defined in the HTML, we use getAttribute
// console.log(logo.getAttribute('src')) // relative URL

// ! the same is true for links
// const link = document.querySelector('.nav__link--btn');
// console.log(link.href); // absolute URL
// console.log(link.getAttribute('href')); // relative URL

// ? data attributes
// data attributes are used to store extra information on HTML elements that doesn't have any visual representation
// they are defined using the prefix 'data-' followed by the attribute name
// for example: <div data-version-number="3.0" ></div>
console.log(logo.dataset.versionNumber); // 3.0
// ! dataset is a special property that allows us to access all data attributes of an element as a JS object

// ? classes
// logo.classList.add('c', 'j'); // adds classes c and j
// logo.classList.remove('c'); // removes class c
// logo.classList.toggle('c'); // toggles class c
// logo.classList.contains('c'); // returns true if class c is present
// ! don't use logo.className = 'jonas' - this will overwrite all existing classes
///////////////////////////////////////

// ? types of events and event handlers

const h1 = document.querySelector('h1');
h1.addEventListener('mouseenter', alertH1);

// a shorter way of adding event listeners - not recommended / old way
// h1.onmouseenter = e => {
//   alert('You are reading the heading :D');
// };

// ! addEventListener allows us to add multiple event listeners to the same event type on the same element
// ! whereas the old way (element.onevent = function) would overwrite the previous event handler if called again for the same event type on the same element
// I.E
// h1.addEventListener('mouseenter', e => {
//   alert('First handler');
// });
// h1.addEventListener('mouseenter', e => {
//   alert('Second handler');
// });
// ! both handlers will be called when the event is triggered

// ? removing event listeners
function alertH1(e) {
  alert('You are reading the heading :D');
  h1.removeEventListener('mouseenter', alertH1); // removes the event listener after it has been called once
}
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); // removes the event listener after 3 seconds

///////////////////////////////////////
//? Event propagation: bubbling and capturing

//! Capturing phase - event goes down to the element
// when an element is clicked, the event first goes through the capturing phase, where it travels down from the root of the DOM tree (Document) to the target element.

//! Target phase - event reaches the target element
// when the event reaches the target element, the event listeners attached to that element are executed.
//! Bubbling phase - event bubbles up from the element
// after the event listeners on the target element are executed, the event enters the bubbling phase, where it travels back up the DOM tree to the root, executing any event listeners attached to ancestor elements along the way.

// ! By default, event listeners are executed during the target and bubbling phases.
// ! We can specify whether an event listener should be executed during the capturing phase by passing a third argument (useCapture) as true to addEventListener.
// ! If useCapture is false or omitted, the event listener will be executed during the bubbling phase.
// ! not all events bubble , or can be captures. some events only happen on the target element. for example, focus and blur events do not bubble.
