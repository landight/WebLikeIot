import deviceHelper from "../../util/device/deviceHelper.js";
import myServer_UDP from "../../util/server/myServer_UDP.js";
import task from "../../util/task/task.js";
import taskHelper from "../../util/task/taskHelper.js";

export default class showTask extends task{
    
    name='显示状态任务'
    desc='显示路由状态、任务状态、设备状态和LED状态'


    /**
     * 
     * @param {myServer_UDP} server_udp 
     */
    constructor(server_udp){
        super();
        this.server_udp = server_udp;
    }

    run(){
        let tasks = taskHelper.list(); 
        let devices = deviceHelper.list();
        let routes = this.server_udp.list();
        let arr=[]
        console.clear();
        console.log(`${new Date().toLocaleTimeString()}   当前状态\n`);
        console.log('路由状态');
        for(let i=0;i<routes.length;i++){
            arr.push({
                '名称':routes[i].route.name,
                'method':routes[i].method,
                'path':routes[i].path,
                '描述':routes[i].route.desc
            })
        }
        console.table(arr)
        console.log('任务状态');
        arr=[];
        for(let i=0;i<tasks.length;i++){
            arr.push({
                '名称':tasks[i].task.name,
                '间隔':tasks[i].delay,
                '次数':tasks[i].count == -1? '持续':tasks[i].count + '次',
                '描述':tasks[i].task.desc,
            })
        }
        console.table(arr)
        console.log('设备状态');
        arr=[];
        for(let i=0;i<devices.length;i++){
            arr.push({
                '名称':devices[i].getName(),
                '类型':devices[i].getProduct(),
                '连接方式':devices[i].getCommType(),
                '连接地址':devices[i].getCommAddr(),
                '上次通信':Math.round((new Date() - devices[i].getLastConnectTime())/1000) + 's 前',
            })
        }
        console.table(arr)

        console.log('led状态');
        arr=[];
        for(let i=0;i<devices.length;i++){
            let d=devices[i];
            if(d.product == 'led'){
                arr.push({
                    '名称':d.name,
                    '状态':d.ledStatus,
                })
            }
        }
        console.table(arr)
    }


}