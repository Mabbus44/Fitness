#include "Wifi.h"
#include <ArduinoHttpClient.h>
#include <WiFiNINA.h>

void Wifi::connect() {
  lcd->clear();
  lcd->setCursor(0,0);
  lcd->print("Connecting Wifi");
  Serial.begin(115200);
  while ( wifiStatus != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);
    wifiStatus = WiFi.begin(ssid.c_str(), pass.c_str());
  }
  Serial.print("Connected to SSID: ");
  Serial.println(WiFi.SSID());
}

void Wifi::post(String activity, int value) {
  httpStatus = 200;
  do{
    if(httpStatus!=200)
      connect();
    lcd->clear();
    lcd->setCursor(0,0);
    lcd->print("Sending");
    Serial.print("making POST request");
    String contentType = "application/x-www-form-urlencoded";
    String postData = "arg1="+activity+"&arg2="+value;
    client.post("/Fitness/addFitness.php", contentType, postData);
    httpStatus = client.responseStatusCode();
    Serial.print("Status code: ");
    Serial.println(httpStatus);
    String response = client.responseBody();
    Serial.print("Response: ");
    Serial.println(response);
  }while(httpStatus!=200);
}
