import myProtocolPacket from "../../util/myPacket/packet.js";
import myServer_UDP from "../../util/server/myServer_UDP.js";
import taskRunnable from "../../util/task/taskRunnable.js";

export default class deviceHelloRunnable extends taskRunnable{
    
    name='上线扫描任务'
    desc='设备上线,广播搜索其它设备'


    /**
     * 
     * @param {myServer_UDP} server_udp 
     */
    constructor(server_udp){
        super();
        this.server_udp=server_udp;
    }

    run(){
        this.server_udp.boradcast(new myProtocolPacket('get','/device/hello'));
    }


}