# IoT-system-controlling-lighting-in-the-building

# Introduction
Automate lighting control in your home. Set the desired illuminance and the algorithm will maintain it regardless of external conditions.
Forget about the need to turn on the light and save energy because the bulb does not always have to work at full power. 

<p align="center">
  <img src="demo/demo.gif">
</p>

The demo could also be found at YOUTUBE LINK

# Project schema
<p align="center">
  <img src="images/project_schema.jpg">
</p>

# Waveshare TSL2581FN
Waveshare TSL2581FN is a digital sensor that measures the intensity of ambient light which is supplied with a voltage from 3.3V to 5V with an I2C (Inter Integrated Circuit) interface. It has two analog-to-digital converters (ADC) that integrate currents simultaneously from two integrated photodiodes, enabling the reading of the current illuminance in a given area in the lux (lx) unit.

<p align="center">
  <img src="images/Waveshare.png">
</p>

# ESP8266 + NodeMCU v3
The platform is based on the ESP8266 chip. ESP8266 was produced by Espressif and provides a highly integrated Wi-Fi SoC (System-on-a-chip)
This module has 16 GPIO ports, however 10 of them can be used as digital I/O

<p align="center">
  <img src="images/Esp8266.png">
</p>


# Connection between Waveshare TSL2581FN and ESP8266
<p align="center">
  <img src="images/Wi-FI_LightSensor.jpg">
</p>

