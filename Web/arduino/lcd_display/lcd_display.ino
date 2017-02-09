//Load libraries
#include <Wire.h>
#include "LiquidCrystal_I2C.h"

//Define variables
#define I2C_ADDR           0x3F //I2C Address - Use i2c_scanner to find
#define BACKLIGHT_PIN      3
#define En_pin             2
#define Rw_pin             1
#define Rs_pin             0
#define D4_pin             4
#define D5_pin             5
#define D6_pin             6
#define D7_pin             7
int mode =                 0;  //Used for push button (mode select)

//Initialise LCD
LiquidCrystal_I2C lcd(I2C_ADDR, En_pin, Rw_pin, Rs_pin, D4_pin, D5_pin, D6_pin, D7_pin);

void setup()
{
    lcd.begin (16,2); //LCD as 16 column by 2 rows
    
    lcd.setCursor(0,0);
    lcd.print("Huebner Inverter"); 
    
    lcd.setCursor(0,1);
    lcd.print("Initializing ...");

    Serial.begin(115200);
    Serial.setTimeout(2000);
}

void loop()
{
    float voltage = 0;
    float amperage = 0;
    float rpm = 0;

    if (Serial.available() > 0)
    {
        delay(1000);
        
        if(mode == 0)
        {
            Serial.println("get udc,idc,speed");
            
            //float x = Serial.parseFloat();
            voltage = Serial.readStringUntil('\n').toFloat();
            amperage = Serial.readStringUntil('\n').toFloat();
            rpm = Serial.readStringUntil('\n').toFloat();

            lcd.clear();
            
            lcd.setCursor(0,0);
            lcd.print("V:" + String(voltage) + "  A:" + String(amperage)); 
            
            lcd.setCursor(0,1);
            lcd.print("RPM: " +  String(rpm));
        }
        
    }else{
        delay(1000);
        
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("TX/RX Error");
    }
}
