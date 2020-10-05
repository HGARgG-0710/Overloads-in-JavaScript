import { polymorph } from "polymorph.js"

//* Examples how to use polymorph() function

let PolyFunction = polymorph(
	{ 0: "number", 1: "string" },
	function (num, str) {
		return `Number ${num} and string "${str}" were passed`
	},
	{ 0: "object" },
	function (obj) {
		return `Object ${obj} passed`
	},
	{ 0: "boolean" },
	function (boolean) {
		return `Boolean ${boolean} was passed`
	}
)

console.log(PolyFunction({ name: "Borya", status: "sleeping" }))
console.log(PolyFunction(42, "Hello World"))
console.log(PolyFunction(true))
