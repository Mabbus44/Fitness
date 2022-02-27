#ifndef WIFI_H
#define WIFI_H

#include <ArduinoHttpClient.h>
#include <WiFiNINA.h>
#include <LiquidCrystal.h>

class Wifi{
  public:
    Wifi(){};
    Wifi(LiquidCrystal* lcd){this->lcd=lcd;};
    void connect();
    void post(String activity, int value);
  private:
    const int port = 80;
    const String serverName = "rasmus.today";
    const String ssid = "OWNIT-5GHz_ECE9";
    const String pass = "S6D6W6HLHHEWGP";
    WiFiClient wifi;
    HttpClient client = HttpClient(wifi, serverName, port);
    int wifiStatus = WL_IDLE_STATUS;  
    int httpStatus;  
    LiquidCrystal* lcd;
};

#endif
