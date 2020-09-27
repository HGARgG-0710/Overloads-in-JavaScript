function polymorph() {
    var typedArr = []
    var notTypedArr = []

    for(let i = 0; i < arguments.length; i++)
        if(i > 0 && typeof(arguments[i]) == "function" && typeof(arguments[i-1]) == "object") {
            typedArr[i-1] = arguments[i-1]
            typedArr[i] = arguments[i]
        } else if(typeof(arguments[i]) == "function") {
            notTypedArr[arguments[i].length] = arguments[i]
        }
    return function() {
        let correctTypeCount = 0
        
        for(let i = 0; i < Object.keys(typedArr).length; i++) {
            if(typeof(typedArr[i]) == "object") {
                correctTypeCount = 0
                for(let j = 0; j < arguments.length; j++) {
                    if(typedArr[i][j] == typeof(arguments[j])) {
                        correctTypeCount++
                    }

                    if(correctTypeCount == (j+1) && j == arguments.length - 1) {
                        return typedArr[i+1].apply(this, arguments)
                    }
                }
            }
        }

        return notTypedArr[arguments.length].apply(this, arguments);
    }
}

// * Example of how the polymorph() function works

let PolyFunction = polymorph(
  {0: "string", 1: "number"}, 
  function(num, str) { 
    return `Number ${num} and string "${str}" were passed`
  }, 
  {0: "object"}, 
  function(obj) {
    return `Object ${obj} passed`
  })
  
  console.log(PolyFunction(/a/))
  console.log(PolyFunction("Hello World!", 42))