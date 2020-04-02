#include <Wire.h>
#include "TSL2581.h"
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include "ArduinoJsonv5.cpp" 
#include <WiFiClient.h>

// WiFi parameters
const char* ssid = "your ssid";
const char* password = "your password";

// Server parameters
const char* Server_ID = "your IP";
const int port = 80;
String URL = "A path to your sensor"; // e.g. /pi/Rooms/LivingRoom/sensors/Light/5dec517737d254054be8f766
String Link;

// LightSensor
WaveShare_TSL2581 tsl = WaveShare_TSL2581();
int TSL2581_INT = 13;
int Device_ID;

// i2cPins and scanALL, scan  -  scanning ESP8266 NodeMCU for connected devices on i2c
uint8_t i2cPins[][2] = {
  {D2, D1} //SDA SCL
};


void setup() {
 
  Serial.begin(115200);

  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
  delay(200);
  Serial.print(".");
  }
  
  // printing network name
  Serial.println();
  Serial.print("Connected to ");
  Serial.println(WiFi.SSID());      
  Serial.println("");
  Serial.println("WiFi connected");
  
  // printing WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // printing the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");

  //i2c scanner
  Wire.begin();
  while (!Serial); // waiting for serial monitor
  Serial.println("\nI2C Scanner");
  scanAll();

  // i2c config
  Wire.begin(); 
  pinMode(TSL2581_INT, INPUT);  // sets the digital pin 7 as input

  read_id();
  
  delay(10);

  // Power on the sensor
  tsl.TSL2581_power_on();
  delay(500);
  
  // Setup the sensor gain and integration time 
  tsl.TSL2581_config();
  Serial.println("");
  
  // Making link
  Link.concat("http://"), Link.concat(Server_ID), Link.concat(":"), Link.concat(port), Link.concat(URL);
}

void loop() {
  
  // Reading data from the sensor
  unsigned long Lux;
  String Lux_string = "";
  
  tsl.TSL2581_Read_Channel();
  Lux = tsl.calculateLux(2, NOM_INTEG_CYCLE);
  
  Read_gpio_interrupt(2000, 50000);
  delay(50);

  // Making JSON to send
  StaticJsonBuffer<300> JSONbuffer;   //Declaring static JSON buffer
  JsonObject& JSONencoder = JSONbuffer.createObject(); 
 
  JSONencoder["value"] = Lux;
 
  char JSONmessageBuffer[300];
  JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
  Serial.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  Serial.println("Data which was sent:");
  Serial.println(JSONmessageBuffer);
  
  if(WiFi.status()== WL_CONNECTED){ 
    HTTPClient http,http2; 
    http.begin(Link); 
    http.addHeader("Content-Type", "application/json"); 
    
    int httpResponseCode = http.PUT(JSONmessageBuffer);
    String response = http.getString();   
    
    Serial.println();
    Serial.println("Resonse code from the server:");
    Serial.println(httpResponseCode);
    Serial.println();
    Serial.println("Response from the server: ");
    Serial.println(response);
    Serial.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");  
    Serial.println("");
    Serial.println("");
    Serial.println("");
    
    http.end();
    delay(50);
  }
}

void read_id(void)
{
  int id;
  int a;
  id = tsl.TSL2581_Read_ID();
  a = id & 0xf0;      //The lower four bits are the silicon version number
  if (!(a == 144))    //ID = 90H = 144D
  {
    Serial.println("false ");
  } else {
    Serial.print("I2C DEV is working ,id = ");
    Device_ID = id;
    Serial.println(Device_ID);
    delay(500);
  }
}

void Read_gpio_interrupt(uint16_t mindata, uint16_t maxdata)
{
  tsl.SET_Interrupt_Threshold(mindata, maxdata);
  int val = digitalRead(TSL2581_INT);
  if (val == 1)
  {
//    Serial.print("interrupt = 1 \n");
  } else {
//    Serial.print("interrupt = 0 \n");
    tsl.Reload_register();
  }
}



void scanAll()
{
  for (int x = 0; x < sizeof(i2cPins) / (sizeof(uint8_t) * 2); x++) {
    Serial.println("I2C on pins:");
    Serial.print("SDA: ");
    Serial.print(i2cPins[x][0]);
    Serial.print(",SCL: ");
    Serial.println(i2cPins[x][1]);
    Wire.begin(i2cPins[x][0], i2cPins[x][1]);
    scan();
  }
}

void scan()
{
  byte error, address;
  int nDevices;

  nDevices = 0;
  for (address = 1; address < 127; address++ )
  {
    // The i2c_scanner uses the return value of
    // the Write.endTransmisstion to see if
    // a device did acknowledge to the address.
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0)
    {
      Serial.print("I2C device found at address 0x");
      if (address < 16)
        Serial.print("0");
      Serial.println (address, HEX);
      nDevices++;
    }
    else if (error == 4)
    {
      Serial.print("Unknown error at address 0x");
      if (address < 16)
        Serial.print("0");
      Serial.println(address, HEX); 
    }
  }
  if (nDevices == 0)
    Serial.println("No I2C devices found\n");
}
