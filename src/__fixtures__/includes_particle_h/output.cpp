/******************************************************/
//       THIS IS A GENERATED FILE - DO NOT EDIT       //
/******************************************************/

#line 1 "/workspace/input.ino"
/* This blinks the LED */
#define PIN D7
#define RATE 10

// My includes
  #include "Particle.h"
void setup();
void loop();
#line 7 "/workspace/input.ino"

void setup() {
  pinMode(PIN, OUTPUT);
}

void loop() {
  static int state = LOW;
  digitalWrite(PIN, state);
  state = !state;
  delay((int)(1000 / RATE));
}
