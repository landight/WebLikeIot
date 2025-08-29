#ifndef ROUTE_H
#define ROUTE_H

#include "Arduino.h"

#include "packet.h"
#include "myServer.h"
#include "config.h"



void DeviceHelloHandle(packet *req,packet *res, route_flag* flag);

void DeviceHiHandle(packet *req,packet *res, route_flag* flag);

void DeviceProductHandle(packet *req,packet *res, route_flag* flag);

void DeviceAddressHandle(packet *req,packet *res, route_flag* flag);

#endif