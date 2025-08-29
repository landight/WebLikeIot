import route from "../../util/route/route.js";
import myProtocolPacket from "../../util/myPacket/packet.js";
import deviceHelper from "../../util/device/deviceHelper.js";
import device from "../../util/device/device.js";

//检测在线用
export default class deviceConnectRoute extends route{

    name='设备在线路由';
    desc='更新其它设备在线状态、回应其它设备的检测';


    constructor(){
        super();
    }

    
    /**
     * 
     * @param {myProtocolPacket} req 
     * @param {myProtocolPacket} res 
     * @param {{next:boolean,send:boolean,comm_type:string}} flag
     */
    handle(req,res,flag){
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