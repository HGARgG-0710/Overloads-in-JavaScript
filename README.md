# Overloads in JavaScript

Allows you to make arbitrary overloads of functions.
Also, allows to add typing to JavaScript functions without the use of TypeScript.
That particular implementation and various additions to the thing (that made it look, behave and work better) are all mine.  
The idea occured to me from that Ru Habr post: https://habr.com/ru/post/86403/

## Files

For examples go to the src/examples.js file.
The implementation is contained in src/polymorph.js file.

## Documentation

### Functions

#### 1. polymorph

This function essentially returns another function that does all the job, connected with types.
It is supposed to be used with primitive types.
The way typing and overloading works can be seen in the src/examples.js file.

#### 2. polymorphClass

This function is more flexible due to the fact that instead of primitives it uses classes for type-checking.
Also, it allows for single untyped parameteres via the Any class.
Again, to see how it works - welcome to the examples.

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

    Here, I won't list the getValue(), getName() and getGenerator() methods.

###### 1. inherit(value)

Returns a new SpecialValue object of the same type (name is the same), if value is not given, then the randomfunc() is used to find it.
