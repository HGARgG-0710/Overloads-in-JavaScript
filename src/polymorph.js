/**
 * * Hello and welcome into the source code of the Overloads.js library.
 * * Feel yourself at home.
 * * The library's purpose originally was only to add various missing features to JavaScript (namely, the function overloading),
 * * however, later I decided to add some more stuff and this gave rise to completely new and in a different way valuable capabilities.
 * * I added various comments and tried to make code more accessible.
 * * Hope it was a success :)
 * @author HGARgG-0710
 */

// * The types that are considered primitive by the library
export const PRIMITIVE_TYPES = Object.freeze([
	"any",
	"object",
	"function",
	"string",
	"number",
	"boolean",
	"undefined",
	"symbol",
	"bigint",
])

const globalvars = { functions: {}, variables: {} }
const localvars = { current: null, contexts: {} }

// * A wrapper for various special values.
/**
 * * A SpecialValue class.
 * * May come in useful when using with polymorphClass function.
 */
export class SpecialValue {
	#value
	#name
	#randomfunc

	static staticRandomFunc = Math.random

	constructor(name, val = staticRandomFunc(), randomfunc = staticRandomFunc) {
		this.#name = name
		this.#value = val
		this.#randomfunc = randomfunc
	}

	getValue() {
		return this.#value
	}

	getName() {
		return this.#name
	}

	getGenerator() {
		return this.#randomfunc
	}

	inherit(newval = this.#randomfunc()) {
		return new SpecialValue(this.#name, newval, this.#randomfunc)
	}

	equals(thing) {
		return (
			thing instanceof SpecialValue &&
			thing.getName() === this.#name &&
			this.#value === thing.getValue()
		)
	}
}

/**
 * * A constant Any class. The simplest wrapper possible.
 * * May come in useful when using with polymorphClass function (for untyped parameters).
 */
export class Any {
	#value

	constructor(value) {
		this.#value = value
	}

	get value() {
		return this.#value
	}
}

/**
 * * Creates a function, with a bunch of overloads.
 * * Is especially useful with primitives (doesn't separate between object types).
 * @param args - can be an object, that has indexes of arguments for an overload or an overload, that comes after this object. Count of arguments is unlimited.
 */
export function polymorph() {
	let typedArr = []
	let notTypedArr = []

	for (let i = 0; i < arguments.length; i++)
		if (
			i > 0 &&
			typeof arguments[i] == "function" &&
			typeof arguments[i - 1] == "object"
		) {
			typedArr[i - 1] = arguments[i - 1]
			typedArr[i] = arguments[i]
		} else if (typeof arguments[i] == "function")
			notTypedArr[arguments[i].length] = arguments[i]

	return function () {
		let correctTypeCount = 0

		for (let i = 0; i < Object.keys(typedArr).length; i++) {
			if (typeof typedArr[i] == "object") {
				correctTypeCount = 0
				for (let j = 0; j < arguments.length; j++) {
					if (typedArr[i][j] == typeof arguments[j])
						correctTypeCount++

					if (correctTypeCount == j + 1 && j == arguments.length - 1)
						return typedArr[i + 1].apply(this, arguments)
				}
			}
		}

		if (notTypedArr[arguments.length].apply(this, arguments) === undefined)
			throw new TypeError(
				"Found no overload with given types or number of arguments"
			)
		else return notTypedArr[arguments.length].apply(this, arguments)
	}
}

/**
 * * This function implementation accepts classes instead of types and is, thereby, more flexible.
 * * If you need more control over the types, then this one function is for you.
 * @param args Arguments (work the same way as with the polymorph function).
 */
export function polymorphClass() {
	let typedArray = []
	let untypedArray = []

	for (let i = 0; i < arguments.length; i++) {
		if (
			i > 0 &&
			typeof arguments[i] === "function" &&
			typeof arguments[i - 1] === "object"
		) {
			if (typedArray[arguments[i].length] === undefined)
				typedArray[arguments[i].length] = []
			typedArray[arguments[i].length].push({
				types: arguments[i - 1],
				func: arguments[i],
			})
		} else if (typeof arguments[i] === "function")
			untypedArray[arguments[i].length] = arguments[i]
	}

	return function () {
		let hasEquatedBefore = false

		if (typedArray[arguments.length] !== undefined)
			for (let i = 0; i < typedArray[arguments.length].length; i++) {
				for (let j = 0; j < arguments.length; j++) {
					if (j > 0 && !hasEquatedBefore) break

					hasEquatedBefore = eval(
						`arguments[j] instanceof ${
							typedArray[arguments.length][i].types[j]
						}`
					)

					if (j === arguments.length - 1 && hasEquatedBefore)
						return typedArray[arguments.length][i].func.apply(
							this,
							arguments
						)
				}
			}

		// * In case, no type was found:
		if (untypedArray[arguments.length] === undefined)
			throw new TypeError(
				"Found no overload with given types or number of arguments. "
			)
		else return untypedArray[arguments.length].apply(this, arguments)
	}
}

/**
 * * This function defines a new primitive variable.
 * @param {string} type Type of the new variable
 * @param {string} name Name of the new variable
 * @param {any} value A primitive, value of the variable
 * @param {string} context The context in which the new variable is to be created
 */
export function primvarinit(type, name, value, context = "local") {
	if (!PRIMITIVE_TYPES.includes(type))
		throw new Error(
			`there is no such a primitive type in the Overloads library as ${type}.`
		)

	return varinit(type, name, value, context, (type, name, value) =>
		primitiveValueCheck(value, type === "any" ? typeof value : type, name)
	)
}

/**
 * * This function defines a new class variable.
 * @param {string} type Type/Class of the new variable
 * @param {string} name Name of the new variable
 * @param {any} value A class instance, value of the variable
 * @param {string} context The context in which the new variable is to be created
 */
export function classvarinit(className, name, value, context = "local") {
	varinit(className, name, value, context, (type, name, value) =>
		classValueCheck(value, type, name)
	)
}

/**
 * * This function is used for checking if certain value (being a primitive) has a certain type.
 * @param {any} value Value to be typechecked.
 * @param {string} type Type, correspondence to which is checked.
 * @param {string} name The name of the variable to which the value is assigned (debug purposes)
 * @param {boolean} isFunctionCall Specifies whether the error message should be as if checking the function output value type.
 */
export function primitiveValueCheck(
	value,
	type,
	name = "",
	isFunctionCall = false
) {
	if (typeof value !== type)
		throw new TypeError(
			name === ""
				? isFunctionCall
					? `Function value does not follow the given primitive type. `
					: `Tyring to initialize value ${
							value instanceof String || typeof value === "string"
								? '"' + value + '"'
								: value
					  } to a variable of primitive type ${type}. `
				: `Variable of name ${name} and ${value} was defined as the primitive of type ${type}. `
		)

	return value
}

/**
 * * Class version of primitiveValueCheck.
 * @param {any} value Value to be typechecked.
 * @param {string} type Type, correspondence to which is checked.
 * @param {string} name The name of the variable to which the value is assigned (debug purposes)
 * @param {boolean} isFunctionCall Specifies whether the error message should be as if checking the function output value type.
 */
export function classValueCheck(
	value,
	className,
	name = "",
	isFunctionCall = false
) {
	if (!eval(`value instanceof ${className}`))
		throw new TypeError(
			name === ""
				? isFunctionCall
					? `Function output does not follow the given class type. `
					: `Trying to initialize value ${value} to a variable of class ${className}`
				: `Variable of name ${name} and value ${
						value instanceof String || typeof value === "string"
							? '"' + value + '"'
							: value
				  } was defined as the class variable of ${className}. `
		)
	return value
}

/**
 * * This function defines a variable. General case of primvarinit and classvarinit functions.
 * @param {string} type Type/Class of the new variable
 * @param {string} name Name of the new variable
 * @param {any} value A class instance/primitive, value of the variable
 * @param {string} context The context in which the new variable is to be created
 * @param {Function} checkingFunc Function to be called before initialisation
 */
export function varinit(
	type,
	name,
	value,
	context = "local",
	checkingFunc = function () {}
) {
	checkingFunc(type, name, value)
	const varinfo = { value: value, type: type }
	return (contextChoice(context).variables[name] = varinfo)
}

/**
 * * Switches current context to a new one.
 * @param {string} contextname Name of the new context
 */
export function setcurrcontext(contextname) {
	return contextname === "global"
		? (localvars.current = globalvars)
		: (localvars.current = localvars.contexts[contextname])
}

/**
 * * Returns an object, containing information about the current context.
 */
export function getcurrcontext() {
	function compare(a, b) {
		if (
			Object.keys(a.variables).length !==
				Object.keys(b.variables).length ||
			Object.keys(a.functions).length !== Object.keys(b.functions).length
		)
			return false

		for (const func in a.functions) {
			if (
				!Object.keys(b.functions).includes(func) ||
				String(a.functions[func]) !== String(b.functions[func])
			)
				return false
		}

		for (const vari in a.variables) {
			if (
				Object.keys(!b.variables).includes(vari) ||
				b.variables[vari].type !== a.variables[vari].type ||
				b.variables[vari].value !== a.variables[vari].value
			)
				return false
		}

		return true
	}

	const current = localvars.current
	let name

	if (compare(localvars.current, globalvars)) name = "global"
	else
		for (const otherName in localvars.contexts)
			if (compare(localvars.contexts[otherName], current)) {
				name = otherName
				break
			}

	return { name: name, context: current }
}

/**
 * * Returns a value of a variable.
 * @param {string} name Name of a variable
 * @param {string} context Context from which variable is to be taken
 */
export function varread(name, context = "local") {
	return contextChoice(context).variables[name]
}

/**
 * * Sets a variale to certain value
 * @param {string} name Name of the variable value of which is to be changed
 * @param {any} value Value which is to be set
 * @param {string} context Context in which variable is to be sought
 * @param {Function} checkFunc Function to be run before all other processes
 */
export function varset(
	name,
	value,
	context = "local",
	checkFunc = function () {}
) {
	checkFunc(name, value)

	const vari = contextChoice(context).variables[name]
	if (vari.type !== "any")
		if (PRIMITIVE_TYPES.includes(vari.type))
			primitiveValueCheck(value, vari.type, name)
		else classValueCheck(value, vari.type, name)

	return (vari.value = value)
}

// * Note: polyargs is an array.
/**
 * * Defines a new function in a given context
 * @param {string} name Name of the new function
 * @param {string} type Return type of a new function
 * @param {any[]} polyargs A set of arguments specifying the function (works with polymoprphism, like the polymorph() function)
 * @param {string} context Context in which function is to be defined
 * @param {boolean} classFunc Specifies whether the function is to be interpreted as one with class types or with primitive types
 */
export function defineFunc(
	name,
	type,
	polyargs,
	context = "local",
	classFunc = false
) {
	contextChoice(context).functions[name] = {
		type: type,
		funct: classFunc ? polymorphClass(...polyargs) : polymorph(...polyargs),
	}
}

function contextChoice(context) {
	return context === "global"
		? globalvars
		: context === "local"
		? localvars.current
		: localvars.contexts[context]
}

/**
 * * Returns an object, containing the info about the function.
 * @param {string} name Name of the function 
 * @param {string} context Name of the context
 */
export function getFuncRef(name, context = "local") {
	const _context = contextChoice(context)
	return { ..._context.functions[name], name: name, context: context }
}

/**
 * * Calls a function in a given context. 
 * @param {string} name Name of a function
 * @param {string} context Name of a context
*/
export function callFunc(name, context, ...args) {
	return (
		PRIMITIVE_TYPES.includes(contextChoice(context).functions[name].type)
			? primitiveValueCheck
			: classValueCheck
	)(
		contextChoice(context).functions[name].funct(...args),
		contextChoice(context).functions[name].type,
		name,
		true
	)
}

/**
 * * Creates a new context
 * @param {string} context Context name
*/
export function makeContext(context) {
	localvars.contexts[context] = { variables: {}, functions: {} }
}

/**
 * * Deletes a context
 * @param {string} context Name of a context
*/
export function deleteContext(context) {
	delete localvars.contexts[context]
}

/**
 * * Prints information about a given variable 
 * @param {string} varname Name of a variable
 * @param {string} context Name of a context from which it is to be taken 
*/
export function printVar(varname, context = "local") {
	console.log(varread(varname, context))
}

/**
 * * Returns all of the currently available contexts.
 */
export function contexts() {
	let currKey = localvars.current === globalvars ? "global" : ""
	return {
		global: globalvars,
		contexts: Object.keys(localvars.contexts).map((key) => {
			if (localvars.current === localvars.contexts[key]) currKey = key
			return {
				name: key,
				context: localvars.contexts[key],
			}
		}),
		local: { name: currKey, context: localvars.current },
	}
}
