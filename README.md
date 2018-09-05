# Wiring Preprocessor

This Javascript library preprocesses `.ino` files into `.cpp`.

## Installing

```
npm install wiring-preprocessor
```

## Using

```
const preprocessor = require('wiring-preprocessor');

const inoFile = fs.readFileSync('app.ino', 'utf8');
const cppFile = preprocessor.processFile(inoFile);
fs.writeFileSync('app.cpp', cppFile);
```

## Run tests

```
npm test
```

