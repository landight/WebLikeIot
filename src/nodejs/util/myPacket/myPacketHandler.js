import myPacket from "./packet.js";

export default class myPacketHandler{
    name='无';
    desc='无';

    constructor(handle){
        if(handle){
            this.handler=handle
        }
    }
    
    /**
     * 
     * @param {myPacket} req 
     * @param {myPacket} res 
     * @param {{next:boolean,send:boolean,comm_type:string}} flag
     */
    handler(req,res,flag){

    }
}