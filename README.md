# Wiring Preprocessor

[![Build Status](https://travis-ci.com/particle-iot/wiring-preprocessor.svg?branch=master)](https://travis-ci.com/particle-iot/wiring-preprocessor)

This Javascript library preprocesses `.ino` files into `.cpp`.

## Installing

```
npm install wiring-preprocessor
```

## Using

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

