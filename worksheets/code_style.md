# Code Style

This documents helps to guide the look and feel of the code so that even when there are multiple developer, the style remains consistent. You may read more about it [here](https://javascript.info/coding-style).

## Style Guide

| Rules             | Choices                            |
| ----------------- | ---------------------------------- |
| Case Styles       | camelCase                          | 
| Acronym Case      | IBM                                |
| Indentation Style | 1TBS                               |
| Indentation       | Tabs                               |
| Indentation Space | 2 Tabs                             |
| Semicolon         | Mandatory                          |
| Lines Length      | 120 Characters                     |
| Nesting Levels    | One more Nesting Level             |
| Function          | Below the actual Code              |
| Commenting        | Commenting at each loop & function |

## Examples

Based on your chosen rules, give an example of a code that follows the code style and an example of a code that does not follow the code style. The examples you give should cover all the above defined rule.

### Good Example

```js
// camelCase
var meetingTime = 1500; 



// Acronym Case
// Example: International Business Machines = IBM



// Indentation Style
while (x == y) {
    // Indentation Tabs & Space
    something();
    somethingelse();
};



// Semicolon
var meetingTime = 1500;
var array = [];



// Lines Length (Max 120)
// Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line
// Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line



// Nesting Levels
for (let i = 0; i < 10; i++) {
  if (cond) {
    ... // <- one more nesting level
  };
};



// Function
function function1() {
  ...
}

function function2(elem) {
  ...
}

// the code which uses them
let elem = function1();
function2(elem);



// Commenting
// This function does ...
function function1() {
    // This loop does...
    if (cond) {
    ... 
    };
}
```

### Bad Example

```js
//functions should be below main code & no semi-colon
function testthis() {
  console.log("this function works")
}

//Does not use camelCase
//Does not include semiColon
          //Does not abide to the identation rule of 2 Tabs, uses spacing (Spacebar) 
           var meetingtime = 1500

//Should use abbreviation, hence should be `var SP = "";`
var singaporepolytechnic = ""

//Does not use one more nesting level, all on the same line
//Does not abide to 1 TBS rule
if (meetingtime = 1500) { testthis() singaporepolytechnic="is the best"}

//Does not abide to the line length
var sentence = `lorem ipsum lorem ipsum 
lorem ipsum 
lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem 
ipsum lorem ipsum`;

var i = 0;

//No comment at each loop, does not abide to 1 TBS rule
while (i < 10) {i++;}






//   SECOND BAD EXAMPLE // 

// Bad Case Style
var MeetingTime = 1500; 



// Bad Acronym Case
// Example: International Business Machines = Ibm
// Example: International Business Machines = ibm



// Bad Indentation Style
while (x == y) {
// Bad Indentation Tabs & Space
something();
somethingelse();
};



// Bad Semicolon
var meetingTime = 1500
var array = []



// Bad Lines Length
// Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line Testing Line



// Nesting Levels
for (let i = 0; i < 10; i++) {
  if (!cond) continue;
  ...  // <- no extra nesting level
}



// Function
// the code which uses them
let elem = function1();
function2(elem);

function function1() {
  ...
}

function function2(elem) {
  ...
}



// Commenting
function function1() {
    // This function does ...

    if (cond) {
    // This loop does...
    ... 
    };
}
