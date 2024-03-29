import {
	polymorph,
	polymorphClass,
	primitiveValueCheck,
	classValueCheck,
	makeContext,
	setcurrcontext,
	primvarinit,
	printVar,
	getcurrcontext,
	varset,
	classvarinit,
	defineFunc,
	callFunc,
	deleteContext,
	getFuncRef,
	contexts,
} from "./polymorph.js"

//* Examples on how to use polymorph() function

// * Note: all the functions here are typed.
const PolyFunction = polymorph(
	["number", "string"],
	function (num, str) {
		return `Number ${num} and string "${str}" were passed`
	},
	["object"],
	function (obj) {
		return `Object ${JSON.stringify(obj)} passed`
	},
	["boolean"],
	function (boolean) {
		return `Boolean ${boolean} was passed`
	}
)

console.log(PolyFunction({ name: "Borya", status: "sleeping" })) // Object { "name": "Borya", "status": "sleeping" }
console.log(PolyFunction(42, "Hello World")) // Number 42 and string "Hello World" were passed
console.log(PolyFunction(true)) // Boolean true was passed.

// * An untyped example (you can use objects instead of arrays for type specification).
const regFunc = polymorph(
	function (anything) {
		return anything + anything
	},
	{ 0: "boolean", 1: "number" },
	function (bool, number) {
		return bool + number
	}
)

console.log(regFunc("Hello")) // HelloHello
console.log(regFunc(false, 1)) // 1

// * A class example (here - String is a name of a class)
const polyCl = polymorphClass(
	function (a) {
		return a
	},
	["String", "String"],
	function (a, b) {
		return a + b
	}
)

const a = new String("a")

console.log(polyCl(a, new String(a + a))) // aaa
console.log(polyCl(0)) // 0

// * Examples on runtime typing.

// variable initializing
const typesafeprim = primitiveValueCheck(5, "number")
console.log(typesafeprim)

// This line:
// * const F = primitiveValueCheck("Howdy", "object")
// Would cause an error.

// Safe class variable initializing.
const classval = classValueCheck([], "Array")
console.log(classval)

// And this line:
// * const Thing = classValueCheck(new Number(), "String")
// Would cause an error.

// * Working with inner variables and contexts.

// * NOTE: A context is essentially a new variable and function space.
// * A feature of context management is abscent in all the programming languages and instead is handled by the language instead.
// * The library allows to do it explicitly.

makeContext("examples") // making a new context, called "examples"
setcurrcontext("examples") // setting the "examples context as the local one".

primvarinit("any", "dynamic", 0) // dynamically typezated variable `dynamic` was defined in the context "examples", which was set to be the current one.
primvarinit("string", "static", "That is the value") // statically typezated variable, containing a string "That is the value" 'static' was defined in the context "examples".

console.log(getcurrcontext())

printVar("static", "local") // print the variable from the local (current) scope (context). (it is the examples context)
printVar("dynamic", "examples")

// * NOTE: In Overloads.js, a variable is kept in a certain way:
// * {value: someVal, type: someType}; where someType - a string (class name or a primitive type name) and value is whatever it's been assigned to.

// * NOTE: For dynamic typezation, use the varinit() without the fifth argument (which is a customary function, called before doing everything else) or primvarinit()
// * with "any" type.
// * For static typezation use primvarinit() for primitive type variable initialization, classvarinit() for class variable initialization,
// * varinit() also allows for arbitrary checks (you can extend the library this way).

varset("dynamic", new Number(42))
varset("static", "new value")

classvarinit("Number", "n", new Number(10000000))

// The line:
// * varset("n", new String("that won't work, will it?"))
// will cause an error to occur.

printVar("n")
printVar("static")
printVar("dynamic")

defineFunc(
	"isodd",
	"boolean",
	[
		["number"],
		function (n) {
			return n % 2 === 1
		},
	],
	"examples"
)

console.log(contexts())
console.log(getFuncRef("isodd", "examples"))
console.log(callFunc("isodd", "examples", 3))
// console.log(callFunc("isodd", "examples", "string"))

makeContext("dummy")
classvarinit("Number", "n", new Number(20), "dummy")
printVar("n", "dummy")
deleteContext("dummy")

// Those lines:
// * setcurrcontext("dummy")
// * console.log(getcurrcontext())
// Would cause an error for the dummy context has already been deleted by us.
