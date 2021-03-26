var _; //globals

describe("About Applying What We Have Learnt", function() {

  var products;

  beforeEach(function () {
    products = [
       { name: "Sonoma", ingredients: ["artichoke", "sundried tomatoes", "mushrooms"], containsNuts: false },
       { name: "Pizza Primavera", ingredients: ["roma", "sundried tomatoes", "goats cheese", "rosemary"], containsNuts: false },
       { name: "South Of The Border", ingredients: ["black beans", "jalapenos", "mushrooms"], containsNuts: false },
       { name: "Blue Moon", ingredients: ["blue cheese", "garlic", "walnuts"], containsNuts: true },
       { name: "Taste Of Athens", ingredients: ["spinach", "kalamata olives", "sesame seeds"], containsNuts: true }
    ];
  });

  /*********************************************************************************/

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (imperative)", function () {

    var i,j,hasMushrooms, productsICanEat = [];

    for (i = 0; i < products.length; i+=1) {
        if (products[i].containsNuts === false) {
            hasMushrooms = false;
            for (j = 0; j < products[i].ingredients.length; j+=1) {
               if (products[i].ingredients[j] === "mushrooms") {
                  hasMushrooms = true;
               }
            }
            if (!hasMushrooms) productsICanEat.push(products[i]);
        }
    }

    expect(productsICanEat.length).toBe(1);
  });

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (functional)", function () {

      var productsICanEat = [];

      /* solve using filter() & all() / any() */
      productsICanEat = products.filter(prod => ! prod.containsNuts)
        .filter(noNuts => _(noNuts.ingredients).all(ingredient => ingredient !== "mushrooms"))

      expect(productsICanEat.length).toBe(1);
  });

  /*********************************************************************************/

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (imperative)", function () {

    var sum = 0;
    for(var i=1; i<1000; i+=1) {
      if (i % 3 === 0 || i % 5 === 0) {
        sum += i;
      }
    }

    expect(sum).toBe(233168);
  });

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (functional)", function () {

    var sum = _.range(1000)
      .reduce((sum, curVal) => {
        if (
          (curVal % 3 === 0) ||
          (curVal % 5 === 0)
        ) {
          return sum + curVal
        } else {
          return sum;
        }
      })

    expect(233168).toBe(sum);
  });

  /*********************************************************************************/
   it("should count the ingredient occurrence (imperative)", function () {
    var ingredientCount = { "{ingredient name}": 0 };

    for (i = 0; i < products.length; i+=1) {
        for (j = 0; j < products[i].ingredients.length; j+=1) {
            ingredientCount[products[i].ingredients[j]] = (ingredientCount[products[i].ingredients[j]] || 0) + 1;
        }
    }

    expect(ingredientCount['mushrooms']).toBe(2);
  });

  it("should count the ingredient occurrence (functional)", function () {
    var ingredientCount = { "{ingredient name}": 0 };

    /* chain() together map(), flatten() and reduce() */
    ingredientCount = _(products).chain()
      .map(prod => prod.ingredients)
      .flatten()
      .reduce((accumArr, ingredient) => {
        accumArr[ingredient] = (accumArr[ingredient] || 0) + 1
        return accumArr;
      }, ingredientCount)
      .value()

    expect(ingredientCount['mushrooms']).toBe(2);
  });

  /*********************************************************************************/
  /* UNCOMMENT FOR EXTRA CREDIT */
  
  it("should find the largest prime factor of a composite number", function () {
    const isPrime = num => {
      for(let i = 2, s = Math.sqrt(num); i <= s; i++)
          if(num % i === 0) return false; 
      return num > 1;
    }

    const largestPrime = num => {
      let largestPrime = 1;

      largestPrime = _.range(num/2 + 1)
      .reduce((curLargest, curItem) => {
        return (isPrime(curItem) && (num % curItem === 0)) ? curItem : curLargest
      }, largestPrime)

      return largestPrime;
    }

    expect(largestPrime(10)).toBe(5)
    expect(largestPrime(2)).toBe(1)
    expect(largestPrime(12)).toBe(3)
  });

  it("should find the largest palindrome made from the product of two 3 digit numbers", function () {
    const isPalindrome = (arr) => {
      for (let i=0; i<arr.length/2; i++) {
        if (arr[i] !== arr[arr.length-1-i]) {
          return false
        }
      }

      return true
    }

    const getRest = (arr, toExclude) => {
      // given an array and an index,
      // returns an array which contains all elements of the given array
      // minus the element at the given index
      return arr.filter((el, idx) => idx !== toExclude)
    }

    const permsOfLength = (len, arr) => {
      let ret = [];

      if (len === 1) {
        // base case; return arrays of length 1
        for (let i=0; i<arr.length; i++) {
          ret.push([arr[i]])
        }

        return ret;
      } else {
        // a perm of length n consists of a single element of the array in position 0
        // plus all permutations of length n-1 of the "rest" of the array
        for (let i=0; i<arr.length; i++) {
          const curPerms = permsOfLength(len-1, getRest(arr, i))  // get all smaller perms
          curPerms.forEach(smallerPerm => smallerPerm.unshift(arr[i]))  // put current 'first' element at the front

          ret = ret.concat(curPerms)
        }

        return ret
      }
    }

    const genAllPermutations = (arr) => {
      let allPerms = [];
      
      for (let i=1; i<=arr.length; i++) {
        // generate all permutations of length i
        allPerms = allPerms.concat(permsOfLength(i, arr))
      }
      
      return allPerms
    }

    const largestPalindrome = (a, b) => {
      const digits = (a*b).toString().split("").map(digitString => parseInt(digitString))
      const candidates = genAllPermutations(digits)    // get all permutations
        .filter(candidate => isPalindrome(candidate))  // get palindromes
        .map(pal => parseInt(pal.join("")))            // turn them back into numbers
        .sort((a, b) => a-b)                           // sort by number, ascending
      
      return parseInt(candidates[candidates.length - 1])
    }

    expect(largestPalindrome(112, 154)).toBe(8)
    expect(largestPalindrome(123, 456)).toBe(868)  // prod = 56088
    expect(largestPalindrome(671, 816)).toBe(575)  // prod = 547,536
    expect(largestPalindrome(111, 111)).toBe(21312)  // prod = 12321

  });

  it("should find the smallest number divisible by each of the numbers 1 to 20", function () {
    const smallestDiv = (candidate = 380) => {
      for (let i=19; i>10; i--) {
        if (candidate % i !== 0) {
          return smallestDiv(candidate + 380)
        }
      }

      return candidate;
    }

    // expect(smallestDiv()).toBe(232792560)
    // ! this works, but the stack size is exceeded
    // ? how can I make it more efficient?
    // even going up by 380 means it'll take 612,612 iterations to get the answer
  });

  it("should find the difference between the sum of the squares and the square of the sums", function () {
    const sillyDiff = (a, b) => {
      return (
        ((a**2)+(b**2)) - 
        ((a+b)**2)
      )
    }

    expect(sillyDiff(0, 0)).toBe(0)
    expect(sillyDiff(1, -1)).toBe(2)
    expect(sillyDiff(1, 1)).toBe(-2)
    expect(sillyDiff(519, 146)).toBe(-151548)
  });

  it("should find the 10001st prime", function () {
    
  });
  
});
