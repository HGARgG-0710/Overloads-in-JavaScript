# Overloads in JavaScript

Allows you to make arbitrary overloads of functions.
Also, allows to add typing to JavaScript functions without the use of TypeScript.
It can be used for building interpreters for various programming languages.

(About overloads in JavaScript)
That particular implementation and various additions to the thing (that made it look, behave and work better) are all mine.  
The idea occured to me from that Ru Habr post: https://habr.com/ru/post/86403/

## Install

To install the package use npm:

```bash
npm install overloads.js
```

## Files

For examples go to the src/examples.js file.
The implementation is contained in src/polymorph.js file.

## Documentation

### Constants

#### 1. PRIMITIVE_TYPES

Definition (from polymorph.js file): 

```js
const PRIMITIVE_TYPES = Object.freeze([
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
```

### Functions

#### 1. polymorph

This function essentially returns another function that does all the job, connected with types.
It is supposed to be used with primitive types.
The way typing and overloading works can be seen in the src/examples.js file.

#### 2. polymorphClass

This function is more flexible due to the fact that instead of primitives it uses classes for type-checking.
Also, it allows for single untyped parameteres via the Any class.
Again, to see how it works - welcome to the examples.

#### 3. primvarinit

Defines a variable, containing a value of primitive type. 

#### 4. classvarinit

Same as primvarinit, but for classes. 

#### 5. primitiveValueCheck

Checking function for primitive values. 

#### 6. classValueCheck

Same as primitiveValueCheck, but for classes. 

#### 7. varinit

Define a variable with an arbitrary value and checking function (if any). 

#### 8. setcurrcontext

Change the current variable and function context to another one. 

##### Note: 

A context is a set of functions and variables independent of other contexts. 
Their introduction allows for having many variables of same names in the program separated by contexts. 
(I.e. they could be interpreted like namespaces in C++ or objects in JS)

There is a global context (which is default), local (current one) and all others. 
setcurrcontext(contextName) essentially changes the value of 'local' to the given context (contextName is it's name). 

#### 9. getcurrcontext

Returns current context. 

#### 10. varread 

Return a value of a variable in a given context. 

#### 11. varset

Set a value for a variable in a given context. 

#### 12. defineFunc

Defines a function in a given context with the syntax similar to that of polymorph or polymorphClass. 

#### 13. getFuncRef

Returns info (including the reference) to a function whose name and context are given. 

#### 14. callFunc 

Calls the function by a given name and context. 

#### 15. makeContext

Creates a new context by a given name or erases all information about the already existing one. 

#### 16. deleteContext

Deletes an already existing context. 

#### 17. printVar 

Prints the info of a defined variable in a given context.

#### 18. contexts

Returns all of info of the currently existing contexts. 

### Classes

#### 1. Any

Allows for storage of any value.
Works like:

```js
import { Any } from "overloads.js"
const a = new Any(42)
console.log(a.value)
```

Also, the resulting object is constant (i.e. doing `a.value = 10` won't work).

#### 2. SpecialValue

Allows to create any arbitrary keyword-marked type and use it with a certain value.
Can be inherited and given a different value:

##### Properties:

###### 1. name

The name of the created special type.
A private property, can be obtained through the SpecialValue.getType()

###### 2. value

Some value assigned to the instance of the type.
Can be anything. By default takes the value from the SpecialValue.randomfunc property-function.
A private property, can be obtained via the SpecialValue getValue() method.

###### 3. randomfunc

A function to generate an arbitrary value for a new SpecialValue, inherited from the current one.
A private property.
Can be obtained via the SpecialValue.getGenerator().
By default equals Math.random().

##### Methods

###### Note:

Here, I won't list the getValue(), getName() and getGenerator() methods. They are just getters for fields above.

###### 1. inherit(value)

Returns a new SpecialValue object of the same type (name is the same), if value is not given, then the randomfunc() is used to find it.
