#include <Arduino.h>
#include "Button.h"

bool Button::pressed(){
  bool state = digitalRead(inputId);
  if(locked){
    if(millis()-lastPressTime>filterTime)
      locked = false;
    else{
      lastState = state;
      return false;
    }
  }
  
  if(state!=lastState){
    locked = true;
    lastPressTime = millis();
    if(state)
      lastHoldTime = millis();
    lastState = state;
    return state;
  }
  lastState = state;
  if(state){
    if(holding && millis()-lastHoldTime>holdPressIntervall){
      lastHoldTime = millis();
      return true;
    }
    if(millis()-lastHoldTime>holdMinTime){
      holding = true;
      lastHoldTime = millis();
      return true;      
    }
  }else{
    holding = false;
  }
  return false;
}

void Button::setInputId(int newId){
  inputId=newId;
  pinMode(inputId, INPUT);
}
