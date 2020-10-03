function polymorph() {
	var typedArr = []
	var notTypedArr = []

	for (let i = 0; i < arguments.length; i++)
		if (
			i > 0 &&
			typeof arguments[i] == "function" &&
			typeof arguments[i - 1] == "object"
		) {
			typedArr[i - 1] = arguments[i - 1]
			typedArr[i] = arguments[i]
		} else if (typeof arguments[i] == "function") {
			notTypedArr[arguments[i].length] = arguments[i]
		}
	return function () {
		let correctTypeCount = 0

		for (let i = 0; i < Object.keys(typedArr).length; i++) {
			if (typeof typedArr[i] == "object") {
				correctTypeCount = 0
				for (let j = 0; j < arguments.length; j++) {
					if (typedArr[i][j] == typeof arguments[j]) {
						correctTypeCount++
					}

					if (correctTypeCount == j + 1 && j == arguments.length - 1) {
						return typedArr[i + 1].apply(this, arguments)
					}
				}
			}
		}

		try {
			if (notTypedArr[arguments.length].apply(this, arguments) == undefined) {
				throw TypeError
			} else {
				return notTypedArr[arguments.length].apply(this, arguments)
			}
		} catch (err) {
			if (err instanceof TypeError) {
				return "Looks like you forgot to give this function an argument of needed type."
			}
		}
	}
}

// * Example of how the polymorph() function works

PolyFunction = polymorph(
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
