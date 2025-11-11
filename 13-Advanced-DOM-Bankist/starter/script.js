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

///////////////////////////////////////
//? Selecting DOM elements
// console.log(document.documentElement); // Logs the entire HTML document
// console.log(document.head); // Logs the head element
// console.log(document.body); // Logs the body element

const header = document.querySelector('.header'); // Selects the first element with class 'header'
const sections = document.querySelectorAll('.section'); // Selects all elements with class 'section'
const section1 = document.getElementById('section--1'); // Selects the element with ID 'section--1'
const buttons = document.getElementsByTagName('button'); // selects all button elements
const btns = document.getElementsByClassName('btn'); // selects all elements by class name 'btn'
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
