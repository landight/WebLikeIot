import dgram from 'dgram'
import myPacket from '../myPacket/packet.js';
import config from '../../config.js';
import myPacketHandler from '../myPacket/myPacketHandler.js';
import networkHelper from '../networkHelper/networkHelper.js';

export default class myServer_UDP{
    udpServer=dgram.createSocket('udp4');;
    arr=[];

    constructor(){
        // 当服务器接收到消息时触发
        this.udpServer.on('message', (msg, rinfo) => {

            if (rinfo.address==networkHelper.getLocalIPAddress()) {
                return;
            }
            let req = myPacket.parse(Array.from(msg));
            let res = new myPacket();
            res.setUser(config.my_user_name);
            res.setPassword(config.my_password);

            let flag={next:true,send:false,comm_type:'udp'};
            for(let i=0;i<this.arr.length&&flag.next==true;i++){
                if((this.arr[i].method == req.getMethod()||this.arr[i].method =='*' ) && (this.arr[i].path == req.getPath() ||this.arr[i].path =='*' )){
                    flag.next=false; //除非在handler里修改next，不然只执行匹配的第一个handler
                    this.arr[i].Handler.handler(req,res,flag);
                }
            }

            if(flag.send && !flag.next){
                //如果匹配成功，并处理完，确认回应
                //就发送数据包
                this.udpServer.send(res.toBuffer(), config.udp_server_port, rinfo.address, (err) => {
                    if (err) {
                        // console.error('发送udp时出错:', err);
                    } 
                });
            }

        });

        // 当服务器开始监听时触发
        this.udpServer.on('listening', () => {
            const address =  this.udpServer.address();
            console.log(`UDP 服务器监听 ${address.address}:${address.port}`);
        });

        // 当发生错误时触发
        this.udpServer.on('error', (err) => {
            console.error(`服务器错误:\n${err.stack}`);
            // this.udpServer.close();
        });
    }


    /**
     * 
     * @param {string} method 
     * @param {string} path 
     * @param {(req:myPacket,res:myPacket,flag:{next:boolean,send:boolean,comm_type:string})=>void} handler 
     */
    addRouteHandler(method,path,handler){
        this.arr.push({method,path,Handler:new myPacketHandler(handler)});
    }

    /**
     * 
     * @param {string} method 
     * @param {string} path 
     * @param {myPacketHandler} Handler 
     */
    addRoute(method,path,Handler){
        this.arr.push({method,path,Handler:Handler});
    }

    /**
     * 
     * @param {number} [port] 
     * @param {string} [host] 
     * @param {()=>void} [callback] 
     */
    listen(port,host,callback){
        this.udpServer.bind(...arguments);
    }


    /**
     * 
     * @param {myPacket} req 
     * @param {(err:Error|null)=>void} callback 
     */
    boradcast(req , callback=()=>{}){
        req.setUser(config.my_user_name);
        req.setPassword(config.my_password);
        this.udpServer.send(req.toBuffer(), config.udp_server_port, networkHelper.getBroadcastAddress(), (err) => {
            callback(err);
        });
    }

     /**
     * 
     * @param {string} addr
     * @param {myPacket} req 
     * @param {(err:Error|null)=>void} callback 
     */
    send(addr,req,callback=()=>{}){
        req.setUser(config.my_user_name);
        req.setPassword(config.my_password);
        this.udpServer.send(req.toBuffer(), config.udp_server_port, addr, (err) => {
            callback(err);
        });
    }

    list(){
        return [...this.arr];
    }

    


}

