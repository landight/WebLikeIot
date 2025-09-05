import myPacketHandler from "../../util/myPacket/myPacketHandler.js";
import myPacket from "../../util/myPacket/packet.js";
import deviceHelper from "../../util/device/deviceHelper.js";
import device from "../../util/device/device.js";
import myServer_UDP from "../../util/server/myServer_UDP.js";
import networkHelper from "../../util/networkHelper/networkHelper.js";

//上线用
export default class deviceHelloHandler extends myPacketHandler{
    name='设备上线路由';
    desc='回应其它设备上线打招呼、本设备上线接收其它设备打招呼';

    /**
     * 
     * @param {myServer_UDP} server_udp 
     */
    constructor(server_udp){
        super();
        this.server_udp=server_udp;
    }

    
    /**
     * 
     * @param {myPacket} req 
     * @param {myPacket} res 
     * @param {{next:boolean,send:boolean,comm_type:string}} flag
     */
    handler(req,res,flag){
        if(req.getMethod()=='get'){
            //其它设备上线，检测当前设备是否在线
            if(flag.comm_type == 'udp'){
                res.setHeader({
                    method:"post",
                    path:"/device/hello",
                })
                res.setContent('str',`udp ${networkHelper.getLocalIPAddress()}` )
                flag.send=true;
            }
        }else if(req.getMethod()=='post'){
            //其它设备在线，被本设备检测到回应
            let [comm_type,comm_addr]=req.getContentString().split(' ');
            let name = req.getUserString();

            if(! deviceHelper.hasDevice(name)){
                deviceHelper.updateDevice(new device(comm_type,comm_addr,name));
                deviceHelper.getDevice(name).connectTimeUpdate();
            }
            if(deviceHelper.getDevice(name).getProduct()==''){//如果没有获取到这个设备的类型
                if(comm_type=='udp'){
                    this.server_udp.send(comm_addr,new myPacket('get','/device/product')) //获取类型
                    this.server_udp.send(comm_addr,new myPacket('get','/device/address')) //获取地址
                }
            }

        }
    }
}

