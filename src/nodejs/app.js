import config from "./config.js";
import deviceAddressHandler from "./route/device/address.js";
import deviceHelloHandler from "./route/device/hello.js";
import deviceConnectHandler from "./route/device/hi.js";
import deviceProductHandler from "./route/device/product.js";
import ledStatusHandler from "./route/led/status.js";
import deviceHelloRunnable from "./task/device/hello.js";
import scanDeviceRunnable from "./task/device/scan.js";
import getLedStatusRunnable from "./task/led/getStatus.js";
import showStatusRunnable from "./task/show/show.js";
import networkHelper from "./util/networkHelper/networkHelper.js";
import myServer_UDP from "./util/server/myServer_UDP.js";
import taskHelper from "./util/task/taskHelper.js";

let server=new myServer_UDP();
taskHelper.init();

//添加路由
server.addRoute('*','*',new deviceConnectHandler());
server.addRoute('*','/device/hello',new deviceHelloHandler(server));
server.addRoute('*','/device/product',new deviceProductHandler());
server.addRoute('*','/device/address',new deviceAddressHandler());
server.addRoute('post','/led/status',new ledStatusHandler());

//添加任务
taskHelper.addTask(new deviceHelloRunnable(server),1,5);    //刚上线扫描5次设备
taskHelper.addTask(new scanDeviceRunnable(server),10,taskHelper.COUNT_FORERVER);  //10s检测1次在线状态
taskHelper.addTask(new showStatusRunnable(server),1,taskHelper.COUNT_FORERVER);  //每秒更新显示
taskHelper.addTask(new getLedStatusRunnable(server),5,taskHelper.COUNT_FORERVER);  //每5s获取一次led状态



server.listen(config.udp_server_port,networkHelper.getLocalIPAddress());
