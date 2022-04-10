/**
 * * Hello and welcome into the source code. Feel yourself at home.
 * * I added various comments and tried to make code more accessible.
 * * Hope it was a success :)
 * @author HGARgG-0710
 */

const globalvars = []
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

export function priminit(
	type,
	name,
	value,
	isglobal = true,
	context = "local"
) {
	varinit(type, name, value, isglobal, context, (type, name, value) => {
		if (typeof value !== type)
			throw new TypeError(
				`Variable of name ${name} and ${value} was defined as the primitive of type ${type}`
			)
	})
}

export function classinit(
	className,
	name,
	value,
	isglobal = true,
	context = "local"
) {
	varinit(className, name, value, isglobal, context, (type, name, value) => {
		if (!eval(`value instanceof ${type}`))
			throw new TypeError(
				`Variable of name ${name} and value ${value} was defined as the class variable of ${type}. `
			)
	})
}

export function varinit(
	type,
	name,
	value,
	isglobal = true,
	context = "local",
	checkingFunc = null
) {
	checkingFunc(type, name, value)
	const varinfo = { name: name, value: value, type: type }

	if (isglobal) {
		globalvars.push(varinfo)
		return 1
	}

	if (context === "local") {
		localvars.current.push(varinfo)
		return 1
	}

	localvars.contexts[context].push(varinfo)
}

export function setcurrcontext(contextname) {
	return localvars.current = localvars.contexts[contextname]
} 

export function getcurrcontext() {
	return localvars.current
} 

export function varread(name, context = "local") {
	return context === "global"
		? global[name]
		: context === "local"
		? localvars.current
		: localvars.contexts[context]
}
