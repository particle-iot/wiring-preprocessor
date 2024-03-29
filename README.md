# Wiring Preprocessor

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/particle-iot/wiring-preprocessor/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/particle-iot/wiring-preprocessor/tree/master)

This Javascript library preprocesses `.ino` files into `.cpp`.

[Overview](#overview) | [Installation](#installation) | [Development](#development) | [Examples](#examples) | [Releasing](#releasing) | [License](#license)


## Overview

The preprocessor automatically adds the line `#include "Particle.h"` to the top of the file, unless your file already includes `"Particle.h"`, `"Arduino.h"` or `"application.h"`.

The preprocessor adds prototypes for your functions so your code can call functions declared later in the source code. The function prototypes are added at the top of the file, below `#include` statements.

If you define custom classes, structs or enums in your code, the preprocessor will not add prototypes for functions with those custom types as arguments. This is to avoid putting the prototype before the type definition. This doesn't apply to functions with types defined in libraries. Those functions will get a prototype.

If you are getting unexpected errors when compiling valid code, it could be the preprocessor causing issues in your code. You can disable the preprocessor by adding `#pragma PARTICLE_NO_PREPROCESSOR` to your file. Be sure to add `#include "Particle.h"` and the function prototypes to your code.


## Installation

```
npm install wiring-preprocessor
```


## Development

1. Install Node.js [`node@16` and `npm@8` are required]
1. Clone this repository `$ git clone git@github.com:particle-iot/wiring-preprocessor.git && cd ./wiring-preprocessor`
1. Install dependencies `$ npm install`
1. View available commands `$ npm run`
1. Run the tests `$ npm test`
1. Start Hacking!


## Examples

```
const preprocessor = require('wiring-preprocessor');

const inoFile = fs.readFileSync('app.ino', 'utf8');
const cppFile = preprocessor.processFile('app.ino', inoFile);
fs.writeFileSync('app.cpp', cppFile);
```


## Run tests

```
npm test
```


## Releasing

See the release process in the [RELEASE.md](RELEASE.md) file.
