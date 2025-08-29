#include <ESP8266WiFi.h>

#include "myUtils.h"
#include "myServer.h"
#include "config.h"
#include "packet.h"
#include "route.h"
#include "task.h"

void setup() {
  WIFI_Init();
  my_Init();
  task_Start();
  UDP_Server_Start();
}
void loop() {
  UDP_Server_Scan();
  my_Loop();
}



void my_Init(){

  Serial.begin(115200);
  pinMode(0,INPUT);
  pinMode(LED_BUILTIN,OUTPUT);

  UDP_Server_Add_Handle("*","*",Show_Handle); //收到报文通过串口输出
  UDP_Server_Add_Handle("get","/device/hi",DeviceHiHandle); //回应在线检测
  UDP_Server_Add_Handle("get","/device/hello",DeviceHelloHandle); //回应其它设备上线打招呼扫描设备
  UDP_Server_Add_Handle("get","/device/product",DeviceProductHandle);//回应设备类型
  UDP_Server_Add_Handle("get","/device/address",DeviceAddressHandle);//回应地址

  UDP_Server_Add_Handle("post","/led/on",LED_ON_Handle);  //开灯
  UDP_Server_Add_Handle("post","/led/off",LED_OFF_Handle);  //关灯
  UDP_Server_Add_Handle("get","/led/status",LED_Status_Handle);//回应led状态

  task_Add_Runnable(5, 1, sayHelloRunnable);  //上线每秒广播一次，打招呼，共5次

}


void my_Loop(){
  static bool pressFlag = false;
  if(digitalRead(0)==LOW && !pressFlag){ //非阻塞扫描按键开关灯
    digitalWrite(LED_BUILTIN,!digitalRead(LED_BUILTIN));
    pressFlag=true;
  }else if(digitalRead(0)==HIGH){
    pressFlag=false;
  }
}


void Show_Handle(packet * req,packet * res, route_flag * flag){
  Serial.printf("收到报文 %s  %s\n\n",req->method,req->path);
  flag->next = true;
}

void LED_ON_Handle(packet * req,packet * res, route_flag * flag){
  digitalWrite(LED_BUILTIN, LOW); 
  packet_setHeader(res, "post", "/led/status", "", "");
  packet_setContent(res, "str", 2, (uint8 *)"on");
  flag->send=true;
}

void LED_OFF_Handle(packet * req,packet * res, route_flag * flag){
  digitalWrite(LED_BUILTIN, HIGH); 
  packet_setHeader(res, "post", "/led/status", "", "");
  packet_setContent(res, "str", 3, (uint8 *)"off");
  flag->send=true;
}

void LED_Status_Handle(packet * req,packet * res, route_flag * flag){
  if(digitalRead(LED_BUILTIN)==LOW){
    packet_setContent(res, "str", 2, (uint8 *)"on");
  }else{
    packet_setContent(res, "str", 3, (uint8 *)"off");
  }
  packet_setHeader(res, "post", "/led/status", "", "");
  flag->send=true;
}
