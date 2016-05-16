/*
 *  serial.h
 *  Serial Tools
 *
 *  Created by Kok Chen on 4/11/09.
 *  Copyright 2009  Kok Chen, W7AY. All rights reserved.
 *
 */

#include <IOKit/IOKitLib.h>
#include <IOKit/serial/IOSerialKeys.h>

int findPorts( CFStringRef *stream, CFStringRef *path, int maxDevice ) ;

