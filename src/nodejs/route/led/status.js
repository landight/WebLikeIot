import route from "../../util/route/route.js";
import myProtocolPacket from "../../util/myPacket/packet.js";
import deviceHelper from "../../util/device/deviceHelper.js";

export default class ledStatusRoute extends route{
    
    name='灯开关状态路由';
    desc='更新led的开关状态';

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
        deviceHelper.getDevice(req.getUserString()).ledStatus = req.getContentString();
    }
}