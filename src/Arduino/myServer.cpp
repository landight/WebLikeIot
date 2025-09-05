#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include "Arduino.h"

#include "myUtils.h"
#include "myServer.h"
#include "config.h"
#include "route.h"

WiFiUDP Udp;
String mac = WiFi.macAddress();
const char* my_device_name = mac.c_str();
const char* my_device_password = "" ;

uint8_t UDP_Route_Number = 0;
route UDP_Routes[UDP_ROUTE_MAX_NUMBER] = { 0 };

void UDP_Server_Start(void) {
  Udp.begin(UDP_SERVER_PORT);
}

void UDP_Server_Scan(void) {
  uint32_t packetSize = Udp.parsePacket();
  if (packetSize) {
    uint8_t udp_buf[1024] = { 0 };
    packet req={},res={};
    route_flag flag={};
    flag.next=true;
    flag.send=true;
    flag.comm_type = String("udp");

    route *temp;
    Udp.read(udp_buf, packetSize);

    if (packet_parse(udp_buf,packetSize,&req) == false) {
      return;
    }
    
    for (uint8_t i = 0; i < UDP_Route_Number && flag.next == true; i++) {
      temp = &UDP_Routes[i];

      if (( strcmp(temp->method,"*")==0 || strcmp(temp->method,req.method)==0 ) &&
            (strcmp(temp->path,"*")==0 || strcmp(temp->path,req.path)==0) ) {
        flag.next = false;
        temp->handle(&req, &res, &flag);
      }
    }
    if (flag.next == false && flag.send==true) {
      UDP_Server_Send(Udp.remoteIP().toString().c_str(), &res);
    }
  }
}

bool UDP_Server_Add_Route(const char *method, const char *path, myServerHandle handle) {
  if (UDP_Route_Number >= UDP_ROUTE_MAX_NUMBER) {
    return false;
  }
  UDP_Routes[UDP_Route_Number++] = { method, path, handle };
  return true;
}


bool UDP_Server_Send(const char *host, packet * p) {
  uint8_t send_buf[1024] = { 0 }; 
  packet_setUserString(p,my_device_name);
  packet_setPasswordString(p,my_device_password);
  uint32_t len = packet_to_buffer(p,send_buf);
  if(len==0){
    return false;
  }
  Udp.beginPacket(host, UDP_SERVER_PORT);
  Udp.write(send_buf, len);
  Udp.endPacket();
  return true;
}

bool UDP_Server_Broadcast( packet * p) {
  String broadcast = WiFi.broadcastIP().toString();
  UDP_Server_Send(broadcast.c_str(), p);
  return true;
}

