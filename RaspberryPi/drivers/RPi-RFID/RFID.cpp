#include <unistd.h>
#include "MFRC522.h"

int main(){
  MFRC522 mfrc;

  mfrc.PCD_Init();

  while(1){
	
    if(!mfrc.PICC_IsNewCardPresent())
      continue;

    if( !mfrc.PICC_ReadCardSerial())
      continue;
	
    for(byte i = 0; i < mfrc.uid.size; ++i){
		unsigned int hex;
		hex =  mfrc.uid.uidByte[0] << 24;
		hex += mfrc.uid.uidByte[1] << 16;
		hex += mfrc.uid.uidByte[2] <<  8;
		hex += mfrc.uid.uidByte[3];
  
		system("wget http://127.0.0.1:8080/drivers/RPi-RFID/RFID.php?id=" + hex);
    }
    usleep(2400*1000);
  }
  return 0;
}
