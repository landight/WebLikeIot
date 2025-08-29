import myProtocolPacket from "../myPacket/packet.js";

export default class route{
    name='无';
    desc='无';

    constructor(handle){
        if(handle){
            this.handle=handle
        }
    }
    
    /**
     * 
     * @param {myProtocolPacket} packet 
     * @param {myProtocolPacket} sendPacket 
     * @param {{next:boolean,send:boolean,comm_type:string}} flag
     */
    handle(packet,sendPacket,flag){

    }
}