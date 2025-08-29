import config from "./config.js";
import deviceAddressRoute from "./route/device/address.js";
import deviceHelloRoute from "./route/device/hello.js";
import deviceConnectRoute from "./route/device/hi.js";
import deviceProductRoute from "./route/device/product.js";
import ledStatusRoute from "./route/led/status.js";
import deviceHelloTask from "./task/device/helloTask.js";
import deviceHiTask from "./task/device/scanDeviceTask.js";
import getLedStatusTask from "./task/led/getStatusTask.js";
import showTask from "./task/show/showTask.js";
import networkHelper from "./util/networkHelper/networkHelper.js";
import myServer_UDP from "./util/server/myServer_UDP.js";
import taskHelper from "./util/task/taskHelper.js";

let server=new myServer_UDP();
taskHelper.init();


server.addRoute('*','*',new deviceConnectRoute());
server.addRoute('*','/device/hello',new deviceHelloRoute(server));
server.addRoute('*','/device/product',new deviceProductRoute());
server.addRoute('*','/device/address',new deviceAddressRoute());
server.addRoute('post','/led/status',new ledStatusRoute());

taskHelper.addTask(new deviceHelloTask(server),1,5);    //刚上线扫描5次设备
taskHelper.addTask(new deviceHiTask(server),10,taskHelper.COUNT_FORERVER);  //10s检测1次在线状态
taskHelper.addTask(new showTask(server),1,taskHelper.COUNT_FORERVER);  //每秒更新显示
taskHelper.addTask(new getLedStatusTask(server),5,taskHelper.COUNT_FORERVER);  //每5s获取一次led状态



server.listen(config.udp_server_port,networkHelper.getLocalIPAddress());
