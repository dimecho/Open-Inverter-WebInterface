//
//  Terminal.h
//  Serial Tools
//
//  Created by Kok Chen on 4/11/09.
//  Copyright 2009  Kok Chen, W7AY. All rights reserved.
//

#import <Cocoa/Cocoa.h>


@interface Terminal : NSObject {
	int outputfd ;
	int inputfd ;
	Boolean crlf ;
	Boolean raw ;
}

- (void)initTerminal ;

- (Boolean)openConnections:(const char*)port baudrate:(int)baud bits:(int)bits parity:(int)parity stopBits:(int)stops ;
- (Boolean)openInputConnection:(const char*)port baudrate:(int)baud bits:(int)bits parity:(int)parity stopBits:(int)stops ;
- (Boolean)openOutputConnection:(const char*)port baudrate:(int)baud bits:(int)bits parity:(int)parity stopBits:(int)stops ;

- (void)closeConnections ;
- (void)closeInputConnection ;
- (void)closeOutputConnection ;
- (void)transmitCharacters:(NSString*)string ;

- (Boolean)connected ;
- (Boolean)inputConnected ;
- (Boolean)outputConnected ;

- (int)inputFileDescriptor ;
- (int)outputFileDescriptor ;

- (void)setCrlfEnable:(Boolean)state ;
- (Boolean)crlfEnabled ;

- (void)setRawEnable:(Boolean)state ;

- (int)getTermios ;
- (void)setRTS:(Boolean)state ;
- (void)setDTR:(Boolean)state ;

int openPort( const char *path, int speed, int bits, int parity, int stops, int openFlags, Boolean input ) ;

- (void)readThread ;

@end
