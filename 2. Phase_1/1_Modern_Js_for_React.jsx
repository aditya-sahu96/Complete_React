// ================================================================
// ⚛️ PHASE 1 → PART 1: Modern JavaScript for React (ES6+ Essentials)
// ================================================================

// -------------------------------
// 1️⃣ ARROW FUNCTIONS (Recap)
// -------------------------------

// Covered in previous section — short, lexical 'this', ideal for callbacks.


// -------------------------------
// 2️⃣ TEMPLATE LITERALS
// -------------------------------

// Before ES6:
const name = "Aditya";
const age = 24;
console.log("My name is " + name + " and I am " + age + " years old.");

// With Template Literals:
console.log(`My name is ${name} and I am ${age} years old.`);

// ✅ Allows embedding variables & expressions using ${}
// ✅ Supports multiline strings
const message = `
Hello ${name},
Welcome to React Learning!
Your age: ${age}
`;
console.log(message);

// Real React use case 👇
const className = `btn btn-${age > 18 ? "adult" : "minor"}`;
// Dynamic class names with logic easily expressed inside backticks.


// -------------------------------
// 3️⃣ DESTRUCTURING
// -------------------------------

// Extracting values from arrays or objects easily.

// ARRAY DESTRUCTURING:
const numbers = [10, 20, 30];
const [first, second, third] = numbers;
console.log(first, second, third); // 10 20 30

// OBJECT DESTRUCTURING:
const user = { username: "Aditya", email: "aditya@email.com" };
const { username, email } = user;
console.log(username, email);

// Default values
const { role = "user" } = user;
console.log(role); // user

// Nested destructuring
const person = { name: "Aditya", address: { city: "Odisha", zip: 760001 } };
const { address: { city } } = person;
console.log(city); // Odisha

// React Example:
function Profile({ name, age }) {
  return <h1>{`${name} is ${age} years old`}</h1>;
}


// -------------------------------
// 4️⃣ SPREAD & REST OPERATORS (...)
// -------------------------------

// SPREAD: Expands arrays/objects
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];
console.log(combined); // [1,2,3,4]

// SPREAD in objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3 };
const merged = { ...obj1, ...obj2 };
console.log(merged); // {a:1,b:2,c:3}

// REST: Collects remaining values into an array
const [x, ...rest] = [10, 20, 30, 40];
console.log(x, rest); // 10 [20,30,40]

// Object Rest:
const { a, ...others } = { a: 1, b: 2, c: 3 };
console.log(others); // {b:2,c:3}

// React Example:
const Button = ({ label, ...props }) => <button {...props}>{label}</button>;


// -------------------------------
// 5️⃣ MODULES (IMPORT / EXPORT)
// -------------------------------

// file: utils.js
export const add = (a, b) => a + b;
export default function greet(name) {
  return `Hello ${name}`;
}

// file: main.js
import greet, { add } from "./utils.js";

console.log(greet("Aditya"));
console.log(add(2, 3));

// Why React uses modules:
// ✅ Enables code splitting and reusability
// ✅ Keeps components isolated and maintainable.


// -------------------------------
// 6️⃣ PROMISES & ASYNC / AWAIT
// -------------------------------

// Promise example:
const fetchData = new Promise((resolve, reject) => {
  const success = true;
  setTimeout(() => {
    success ? resolve("Data received") : reject("Error fetching");
  }, 1000);
});

fetchData
  .then(data => console.log(data))
  .catch(err => console.log(err));

// async/await syntax:
async function getData() {
  try {
    const res = await fetchData;
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

getData();

// React Example:
// useEffect(() => { async function load() { const res = await fetch(); } load(); }, []);


// -------------------------------
// 7️⃣ OPTIONAL CHAINING & NULLISH COALESCING
// -------------------------------

const userData = {
  profile: {
    name: "Aditya",
  },
};

// Optional chaining safely accesses nested properties.
console.log(userData?.profile?.name); // Aditya
console.log(userData?.address?.city); // undefined, no error

// Nullish coalescing (??) provides default when value is null/undefined.
const cityName = userData?.address?.city ?? "Unknown";
console.log(cityName); // "Unknown"

// In React:
const title = props?.title ?? "Default Title";


// -------------------------------
// 8️⃣ CLOSURES & SCOPE
// -------------------------------

// Closure: a function that remembers variables from its outer scope.
function counter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const increment = counter();
console.log(increment()); // 1
console.log(increment()); // 2

// React analogy: closures are behind useState hooks.
function useCounter() {
  let count = 0;
  function increment() {
    count++;
    console.log(count);
  }
  return increment;
}


// -------------------------------
// 9️⃣ 'this' KEYWORD BEHAVIOR
// -------------------------------

const obj = {
  name: "Aditya",
  regular() {
    console.log(this.name);
  },
  arrow: () => {
    console.log(this.name);
  },
};

obj.regular(); // Aditya (this = obj)
obj.arrow();   // undefined (this = global)

// In classes:
class PersonClass {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log("Hello " + this.name);
  }
}

const p1 = new PersonClass("Aditya");
p1.greet();


// -------------------------------
// 🔟 ARRAY METHODS: map, filter, reduce
// -------------------------------

const nums = [1, 2, 3, 4, 5];

// map → transforms array
const doubled = nums.map(n => n * 2); // [2,4,6,8,10]

// filter → keeps only items meeting condition
const evens = nums.filter(n => n % 2 === 0); // [2,4]

// reduce → reduces array to single value
const sum = nums.reduce((acc, curr) => acc + curr, 0); // 15

// React Example:
const items = ["Apple", "Banana", "Mango"];
const list = items.map((item, i) => <li key={i}>{item}</li>);


// -------------------------------
// 1️⃣1️⃣ OBJECT-ORIENTED vs FUNCTIONAL PROGRAMMING
// -------------------------------

// OOP → data + behavior in classes
class Car {
  constructor(name) {
    this.name = name;
  }
  drive() {
    return `${this.name} is driving`;
  }
}
const car = new Car("BMW");

// Functional → pure functions, no shared state
const driveCar = name => `${name} is driving`;

// React leans functional because components are pure functions of state.


// -------------------------------
// 1️⃣2️⃣ EVENT LOOP & ASYNC BEHAVIOR
// -------------------------------

// JS executes code line-by-line (single-threaded).
// Asynchronous tasks (timeouts, fetch, events) go to the Event Loop queue.

console.log("Start");

setTimeout(() => console.log("Inside Timeout"), 0);

Promise.resolve().then(() => console.log("Promise resolved"));

console.log("End");

// Output:
// Start
// End
// Promise resolved
// Inside Timeout
// (Promises run before timeouts → microtask queue priority)


// In React, understanding this helps predict when re-renders or useEffect callbacks run.


// ================================================================
// 🧾 SUMMARY
// ================================================================

// ✅ Arrow functions → shorter syntax + lexical 'this'
// ✅ Template literals → dynamic strings & multiline text
// ✅ Destructuring → easy data extraction
// ✅ Spread/rest → clone, merge, collect
// ✅ Modules → clean component structure
// ✅ Promises & async/await → handle async data
// ✅ Optional chaining / nullish coalescing → safe property access
// ✅ Closures → foundation for React hooks
// ✅ this keyword → know lexical vs dynamic context
// ✅ Array methods → functional patterns used everywhere in React
// ✅ OOP vs Functional → React embraces functional purity
// ✅ Event loop → understand async updates & re-render timing

// ✅ Mastering these ensures you're fluent in ES6+ JavaScript —
// the true foundation for professional React development.
