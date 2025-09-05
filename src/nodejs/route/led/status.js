import myPacketHandler from "../../util/myPacket/myPacketHandler.js";
import myPacket from "../../util/myPacket/packet.js";
import deviceHelper from "../../util/device/deviceHelper.js";

export default class ledStatusHandler extends myPacketHandler{
    
    name='灯开关状态路由';
    desc='更新led的开关状态';

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
        deviceHelper.getDevice(req.getUserString()).ledStatus = req.getContentString();
    }
}