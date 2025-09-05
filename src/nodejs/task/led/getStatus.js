import deviceHelper from "../../util/device/deviceHelper.js";
import myProtocolPacket from "../../util/myPacket/packet.js";
import myServer_UDP from "../../util/server/myServer_UDP.js";
import taskRunnable from "../../util/task/taskRunnable.js";

export default class getLedStatusRunnable extends taskRunnable{
    
    name='获取LED状态'
    desc='-'


    /**
     * 
     * @param {myServer_UDP} server_udp 
     */
    constructor(server_udp){
        super();
        this.server_udp = server_udp;
    }

    run(){
        let devices = deviceHelper.list();
        devices.forEach(d=>{
            if(d.getProduct() == 'led' && d.getCommType() == 'udp'){
                this.server_udp.send(d.getCommAddr(),new myProtocolPacket('get','/led/status'),(err)=>{
                    if(err) console.error('发送获取led状态报文失败')
                })
            }
        })
    }


}