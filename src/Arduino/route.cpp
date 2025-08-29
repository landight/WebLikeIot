#include "c_types.h"
#include "WString.h"
#include "Arduino.h"
#include <ESP8266WiFi.h>

#include "myUtils.h"
#include "config.h"
#include "route.h"

void DeviceHelloHandle(packet *req, packet *res, route_flag *flag) {
  String content = flag->comm_type + String(" ") + WiFi.localIP().toString();
  packet_setHeader(res, "post", "/device/hello", "", "");
  packet_setContent(res, "str", content.length(), (uint8 *)content.c_str());
  flag->send = true;
}

void DeviceHiHandle(packet *req, packet *res, route_flag *flag) {
  packet_setHeader(res, "post", "/device/hi", "", "");
  flag->send = true;
}

void DeviceAddressHandle(packet *req, packet *res, route_flag *flag) {
  String content = flag->comm_type + String(" ") + WiFi.localIP().toString();
  packet_setHeader(res, "post", "/device/address", "", "");
  packet_setContent(res, "str", content.length(), (uint8 *)content.c_str());
  flag->send = true;
}

void DeviceProductHandle(packet *req, packet *res, route_flag *flag) {
  packet_setHeader(res, "post", "/device/product", "", "");
  packet_setContent(res, "str", strlen(DEVICE_PRODUCT), (uint8 *)DEVICE_PRODUCT);
  flag->send = true;
}
