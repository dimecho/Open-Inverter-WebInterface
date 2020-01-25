#include <EEPROM.h>

void setup()
{
  //Erase EEPROM to Default
  
  EEPROM.begin(256);
  for (uint16_t i = 0 ; i < EEPROM.length() ; i++) {
    EEPROM.write(i, 255);
  }
  EEPROM.commit();
}

void loop()
{
}
