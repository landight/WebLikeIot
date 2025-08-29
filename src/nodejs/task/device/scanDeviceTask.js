import myProtocolPacket from "../../util/myPacket/packet.js";
import myServer_UDP from "../../util/server/myServer_UDP.js";
import task from "../../util/task/task.js";

export default class deviceHiTask extends task{
    
    name='设备在线任务'
    desc='发送udp广播,检测设备在线状态'

    /**
     * 
     * @param {myServer_UDP} server_udp 
     */
    constructor(server_udp){
        super();
        this.server=server_udp;
    }

    run(){
        this.server.boradcast(new myProtocolPacket('get','/device/hi'));
    }


}