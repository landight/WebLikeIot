#ifndef CONFIG_H
#define CONFIG_H
#include "Arduino.h"

//WIFI名称 密码
#define STASSID ""
#define STAPSK ""

//监听端口
#define  UDP_SERVER_PORT  31264



//路由的最大数量
#define UDP_ROUTE_MAX_NUMBER  20

//任务最大数量
#define TASK_MAX_NUMBER 10

//设备所属产品
#define DEVICE_PRODUCT "led"

#endif
