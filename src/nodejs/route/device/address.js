import myPacketHandler from "../../util/myPacket/myPacketHandler.js";
import myPacket from "../../util/myPacket/packet.js";
import deviceHelper from "../../util/device/deviceHelper.js";
import networkHelper from "../../util/networkHelper/networkHelper.js";

export default class deviceAddressHandler extends myPacketHandler{

  name='设备地址路由';
  desc='获取其它设备的地址，回应其它设备获取本设备地址';

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
      if(req.getMethod()=='post'){
        let [comm_type,comm_addr] = req.getContentString().split(' ');
        let user=req.getUserString();
        if(deviceHelper.hasDevice(user)){
            deviceHelper.getDevice(user).setCommunicationAddress(comm_type,comm_addr);
        }
      }else if(req.getMethod()=='get'){
        if(flag.comm_type == 'udp'){
            res.setHeader({
                method:'post',
                path:"/device/address",
            })
            res.setContent('str',`udp ${networkHelper.getLocalIPAddress()}`);
    
            flag.send=true;
        }
      }
    }
}