INSTRUCTIONS FOR RASPBERRYPI ZERO

Setup

1) Download RaspberryPi (Light) image
2) Flash SD card with image using "Etcher" app
3) Mount SD card and copy files from /boot to SD volume "boot"
4) Modify wpa_supplicant.conf to your WiFi SSID + password
5) Insert SD to RaspberryPi and turn it on
6) During boot Pi should automatically connected to your WiFi AP
7) SFTP to Pi using WinSCP (Windows) or Cyberduck (MacOS) with IP 192.168.1.x
   Note: This IP depends in your router DHCP lease - check your home networking
8) Navigate to /home/pi and upload setup.sh
9) SSH to your Pi "putty" (Windows) or "ssh -l pi 192.168.1.x" (MacOS)
   Run Commands:
   > cd /home/pi
   > chmod +x setup.sh
   > ./setup.sh
10) Finish the setup and your Pi is ready for Inverter

Wiring

Pin 1  -> 3.3V
Pin 6  -> GND
Pin 8  -> TXD (pi) RXD (inverter)
Pin 10 -> RXD (pi) TXD (inverter)


Usage

1) Connect to RaspberryPi WiFi Access Point (ex: Inverter)
   Note: WPA password you supplier in setup script
2) Open web browser and go to http://192.168.42.1:8080
