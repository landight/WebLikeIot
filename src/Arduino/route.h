#ifndef ROUTE_H
#define ROUTE_H

#include "Arduino.h"

#include "packet.h"
#include "myServer.h"
#include "config.h"



void DeviceHelloHandler(packet *req,packet *res, route_flag* flag);

void DeviceHiHandler(packet *req,packet *res, route_flag* flag);

void DeviceProductHandler(packet *req,packet *res, route_flag* flag);

void DeviceAddressHandler(packet *req,packet *res, route_flag* flag);

#endif