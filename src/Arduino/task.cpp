#include "Arduino.h"
#include <ESP8266WiFi.h>

#include "task.h"
#include "myServer.h"



void sayHelloRunnable(){
  String content = String("udp ") + WiFi.localIP().toString();
  packet p = {};
  packet_setHeader(&p, "post", "/device/hello", "", "");
  packet_setContent(&p, "str", content.length(), (uint8_t*)content.c_str());
  UDP_Server_Broadcast(&p);
}
