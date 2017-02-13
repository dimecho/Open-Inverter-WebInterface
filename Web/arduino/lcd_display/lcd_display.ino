//Load libraries
#include <Wire.h>
#include "LiquidCrystal_I2C.h"

//Define variables
#define I2C_ADDR           0x3F // I2C Address - Use i2c_scanner to find
#define BACKLIGHT_PIN      3
#define En_pin             2
#define Rw_pin             1
#define Rs_pin             0
#define D4_pin             4
#define D5_pin             5
#define D6_pin             6
#define D7_pin             7
int mode =                 -1;  // Select display modes
int buttonPin =            2;   // Push button to select mode

//Initialize LCD
LiquidCrystal_I2C lcd(I2C_ADDR, En_pin, Rw_pin, Rs_pin, D4_pin, D5_pin, D6_pin, D7_pin);

void setup()
{
    pinMode(buttonPin, INPUT);        // Button as input
    //digitalWrite(buttonPin, HIGH);  // Button without pull-up resistor

    lcd.begin (16,2);                 // LCD as 16 column by 2 rows

    lcd.setCursor(0,0);
    lcd.print("Huebner Inverter");

    lcd.setCursor(0,1);
    lcd.print("Initializing ...");

    delay(3200);

    Serial.begin(115200);
    Serial.setTimeout(2000);
}

void loop()
{
    if(digitalRead(buttonPin) == HIGH)   // When push button pressed
    {
        mode++;         // Increment mode
        if(mode == 2)   // Only two modes
            mode = 0;   // Reset back to 0
        delay(2000);    // Wait for button to depress
    }

    if(mode == 0)
    {
        float v = 0;
        float a = 0;
        float rpm = 0;

        Serial.println("get udc,idc,speed");  // Bulk parameter request

        if (Serial.available() > 0)
        {
            //float x = Serial.parseFloat();
            v = Serial.readStringUntil('\n').toFloat();
            a = Serial.readStringUntil('\n').toFloat();
            rpm = Serial.readStringUntil('\n').toFloat();
        }

        lcd.clear();

        lcd.setCursor(0,0);
        lcd.print("V:" + String(v) + "  A:" + String(a)); 

        lcd.setCursor(0,1);
        lcd.print("RPM: " +  String(rpm));

        delay(500);
      
    }else if(mode == -1){

        Serial.println("get version");

        if (Serial.available() > 0)
        {
            mode = 0;
            lcd.clear();
            lcd.setCursor(0,0);
            lcd.print("Version:" + Serial.readStringUntil('\n')); 
        }else{
            lcd.clear();
            lcd.setCursor(0,0);
            lcd.print("TX/RX Error");
        }

        delay(2500);

    }else{

      delay(1000);
    }
}
