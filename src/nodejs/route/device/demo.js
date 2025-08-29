import route from "../../util/route/route.js";
import myProtocolPacket from "../../util/myprotocol/packet.js";

export default class demo extends route{
    
    name='无';
    desc='无';

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
      
    }
}