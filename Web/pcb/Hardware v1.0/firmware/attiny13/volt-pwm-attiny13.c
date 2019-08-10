/*
 */

#include <avr/io.h>
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
}
