import myPacketHandler from "../../util/myPacket/myPacketHandler.js";
import myPacket from "../../util/myPacket/packet.js";
import config from "../../config.js";
import deviceHelper from "../../util/device/deviceHelper.js";

export default class deviceProductHandler extends myPacketHandler{

    name='设备类型路由';
    desc='回应本设备的类型、获取其它设备的类型';
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
        let m=req.getMethod();
        if(m=='get'){
            res.setMethod('post');
            res.setPath('/device/product');
            res.setContent('str',config.my_product);
        }else if(m=='post'){
            let name=req.getUserString()
            if(deviceHelper.hasDevice(name)){
                deviceHelper.getDevice(name).setProduct(req.getContentString());
            }
        }
    }
}