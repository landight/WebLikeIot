# 物联网仿web开发

## 项目特点

* 仿web开发的路由（中间件）划分接口，简单方便，易于理解

* 对不同的设备，开发思路基本相同，不区分服务器和客户端，每个设备都既是服务器，又是客户端

* 添加定时任务很方便

* 非常轻量化


## 项目结构

### nodejs结构

* app.js 程序入口

* config.js 程序配置文件

* route 路由目录

* task  定时任务目录

* util  工具类目录


### Arduino结构

* Arduino.ino 程序入口

* config.h 程序配置文件

* route.cpp route.h 路由文件

* task.cpp task.h 定时任务文件

* **其它为工具**

## 项目进展

* 添加路由、添加定时任务

* 设备上线检测、设备在线扫描、设备类型识别

* esp8266 做了一个LED demo,带手动控制开关、网络控制开关

* nodejs 定时检测LED状态

## 开始

### Arduino

* 修改 config.h 的WIFI名称、密码

* Arduino IDE 打开 Arduino.ino 选择 ESP8266 和对应端口

* 上传

### nodejs

* 进入nodejs目录

* npm install

* 修改 config.js 里跟IP相关的两部分 

* node ./app.js

## 继续开发

* 模仿Route和Handler的写法,写自己想实现的接口,在程序入口文件里或其它地方添加它

* 模仿Task和Runnable的写法，写自己想执行的任务内容，在程序入口文件里或其它地方添加它

* 添加自己想添加的部分，删除自己不需要的部分

* 重新上传或重新启动