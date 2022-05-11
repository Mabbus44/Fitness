#include "Wifi.h"
#include "Button.h"
#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
Wifi wifi(&lcd);
Button bUpp(6);
Button bDown(7);
Button bLeft(8);
Button bRight(9);
const int activityCount=4;
const int maxActivityValue=10000;
const String activities[activityCount] {"running", "skiing", "swimming", "weight"};
int activityValues[activityCount] = {40, 60, 30, 800};
int activityId = 0;
enum menuStates {CHOOSE_ACTIVITY, CHOOSE_VALUE};
int menuState=CHOOSE_ACTIVITY;
int decimals = 0;
bool sleep = true;

String getDecimalStr(int val, int dec){
  String ret;
  if(dec == 1){
    ret = String(val/10) + "." + val%10;
  }else
    ret = val;
  return ret;
}

void setup() {
  pinMode(10, OUTPUT);
  pinMode(13, OUTPUT);
  digitalWrite(10, sleep);
  digitalWrite(13, sleep);
  lcd.begin(16,2);
  wifi.connect();
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print(activities[activityId]);
}

void loop() {
  if(bUpp.pressed()){
    sleep = !sleep;
    digitalWrite(10, sleep);
    digitalWrite(13, sleep);
    if(menuState==CHOOSE_ACTIVITY){
      activityId++;
      if(activityId==activityCount)
        activityId=0;
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print(activities[activityId]);
    }else{
      activityValues[activityId]++;
      if(activityValues[activityId]==maxActivityValue)
        activityValues[activityId]=0;
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print(getDecimalStr(activityValues[activityId], decimals));
    }
  }
  if(bDown.pressed()){
    if(menuState==CHOOSE_ACTIVITY){
      activityId--;
      if(activityId==-1)
        activityId=activityCount-1;
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print(activities[activityId]);
    }else{
      activityValues[activityId]--;
      if(activityValues[activityId]==-1)
        activityValues[activityId]=0;
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print(getDecimalStr(activityValues[activityId], decimals));
    }
  }
  if(bRight.pressed()){
    if(menuState==CHOOSE_ACTIVITY){
      if(activities[activityId] == "weight")
        decimals = 1;
       else
        decimals = 0;
      menuState = CHOOSE_VALUE;
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print(getDecimalStr(activityValues[activityId], decimals));
    }else{
      wifi.post(activities[activityId], activityValues[activityId]);
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Activity saved");
      delay(3000);
      menuState=CHOOSE_ACTIVITY;
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print(activities[activityId]);
    }
  }
  if(bLeft.pressed()){
    if(menuState==CHOOSE_VALUE){
      menuState = CHOOSE_ACTIVITY;
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print(activities[activityId]);
    }
  }
}
