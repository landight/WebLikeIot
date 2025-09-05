import myPacketHandler from "../../util/myPacket/myPacketHandler.js";
import myPacket from "../../util/myPacket/packet.js";
import deviceHelper from "../../util/device/deviceHelper.js";

//检测在线用
export default class deviceConnectHandler extends myPacketHandler{

    name='设备在线路由';
    desc='更新其它设备在线状态、回应其它设备的检测';


    constructor(){
        super();
    }

    
    /**
     * 
     * @param {myPacket} req 
     * @param {myPacket} res 
     * @param {{next:boolean,send:boolean,comm_type:string}} flag
     */
    handler(req,res,flag){
        if(deviceHelper.hasDevice(req.getUserString())){
            deviceHelper.getDevice(req.getUserString()).connectTimeUpdate();
        }

        if( req.getPath()=='/device/hi' && req.getMethod()=='get' ){
            //其它设备想检测本设备的在线状态
            res.setHeader({
                method:'post',
                path:"/device/hi"
            })
            flag.send=true;
        }else if(req.getPath()!='/device/hi'){
            flag.next=true;
        }
    }
}