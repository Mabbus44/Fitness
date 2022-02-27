#ifndef BUTTON_H
#define BUTTON_H

class Button{
  public:
    Button(){};
    Button(int newId){setInputId(newId);};
    bool pressed();
    void setInputId(int newId);
    int filterTime=100;
    int holdMinTime=500;
    int holdPressIntervall=100;
  private:
    int inputId;
    unsigned long int lastPressTime=0;
    unsigned long int lastHoldTime=0;
    bool lastState=false;
    bool locked=false;
    bool holding=false;
};

#endif
