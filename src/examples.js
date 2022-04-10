import { polymorph, polymorphClass } from "./polymorph.js"

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
