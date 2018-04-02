<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php"; ?>
        <link rel="stylesheet" href="css/androidstudio.css">
        <script src="js/highlight.js"></script>
        <script>
            IconicJS();
            hljs.initHighlightingOnLoad();
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col">
                    <table class="table table-active bg-faded table-bordered">
                            <tr>
                                <td>
                                    Version 1 inverter was using ATTiny13 chip to isolate high voltage detection from main controller.
                                    <br/><br/>
                                    <img class="iconic" src="img/chip.svg" style="vertical-align:middle" /> <a class="text-dark" href="firmware/attiny13.zip">ATTiny13</a>
                                    <pre>
<code>#include <avr/io.h>
#include <util/delay.h>

#define PERIOD 1500

int __attribute__((OS_main)) main(void)
{
   uint16_t on, off;

   ADMUX = 1; //ADC1
   ADCSRA = (1 << ADEN) | (1 << ADSC) | (1 << ADPS2) | (1 << ADPS1);
   DDRB = 1 << PIN0;
   while (ADCSRA & (1 << ADSC));

   while(1)
   {
      /* ADC ranges up to 1023, period is defined as 1500.
      So we essentially limit the maximum duty cycle to about 65%
      to stay within 3.3V on the receiving side */
      on = ADC ;
      off = PERIOD - on;
      ADCSRA |= 1 << ADSC;
      while (on--)
      {
         PORTB = 1 << PIN0;
      }

      while (off--)
      {
         PORTB = 0;
      }
   }
}</code>
                                    </pre>
                                    <center>
                                        You can buy a proper AVR programmer.<br/><br/>
                                        <img src="firmware/img/avr_programmer.jpg" /><br/><br/>
                                        Or use Raspberry Pi to flash ATTiny13.<br/><br/>
                                        <img src="firmware/img/avr_programmer_pi.png" /><br/><br/>
                                        ATTiny13 Pinout.<br/><br/>
                                        <img src="/firmware/img/attiny13.png" /><br/><br/>
                                    </center>
                                    SSH to Pi and run AVRDude installation.
                                    <pre>
<code>sudo apt-get install avrdude</code>
                                    </pre>
                                    Open AVRDude configuration file for editing.
                                    <pre>
<code>sudo nano /etc/avrdude.conf</code>
                                    </pre>
                                    In Nano, use ctrl-w to search for linuxgpio. This is the section that controls the GPIO pins used for programming. The section needs to be uncommented. Set the MOSI, MISO and SCK entries to the GPIO pins on the Pi.
                                    <pre>
<code>programmer
  id    = "linuxgpio";
  desc  = "Use the Linux sysfs interface to bitbang GPIO lines";
  type  = "linuxgpio";
  reset = 12;
  sck   = 11;
  mosi  = 10;
  miso  = 9;
;</code>
                                    </pre>
                                    Test connection.
                                    <pre>
<code>sudo /usr/bin/avrdude -p t13 -c linuxgpio -v -t</code>
                                    </pre>
                                    Flash firmware.
                                    <pre>
<code>sudo avrdude -p t13 -c linuxgpio -U flash:w:volt-pwm-attiny13.bin</code>
                                    </pre>
                                    Backup firmware.
                                    <pre>
<code>sudo avrdude -p t13 -c linuxgpio -U flash:r:flashdump.bin:r</code>
                                    </pre>
                                </td>
                            </tr>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>