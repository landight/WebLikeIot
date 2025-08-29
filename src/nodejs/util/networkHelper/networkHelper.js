import config from "../../config.js";
import os from 'os'

export default class networkHelper{

    static getLocalIPAddress(){
        
        let localIPs = Object.values(os.networkInterfaces()).flat().filter(iface => !iface.internal).map(iface => iface.address);
        
        for(let i=0;i<localIPs.length;i++){
            if(localIPs[i].startsWith(config.local_ip_start_with)){
                return localIPs[i];
            }
        }
        return '127.0.0.1'
    }

    static getBroadcastAddress(){
        return config.boradcast_addr;// :)
    }
}

