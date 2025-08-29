import dgram from 'dgram'
import myProtocolPacket from '../myPacket/packet.js';
import config from '../../config.js';
import route from '../route/route.js';
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
            let req = myProtocolPacket.parse(Array.from(msg));
            let res = new myProtocolPacket();
            res.setUser(config.my_user_name);
            res.setPassword(config.my_password);

            let flag={next:true,send:false,comm_type:'udp'};
            for(let i=0;i<this.arr.length&&flag.next==true;i++){
                if((this.arr[i].method == req.getMethod()||this.arr[i].method =='*' ) && (this.arr[i].path == req.getPath() ||this.arr[i].path =='*' )){
                    flag.next=false; //除非在handle里修改next，不然只执行匹配的第一个handle
                    this.arr[i].route.handle(req,res,flag);
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
     * @param {(req:myProtocolPacket,res:myProtocolPacket,flag:{next:boolean,send:boolean,comm_type:string})=>void} handle 
     */
    addHandle(method,path,handle){
        this.arr.push({method,path,route:new route(handle)});
    }

    /**
     * 
     * @param {string} method 
     * @param {string} path 
     * @param {route} route 
     */
    addRoute(method,path,route){
        this.arr.push({method,path,route:route});
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
     * @param {myProtocolPacket} req 
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
     * @param {myProtocolPacket} req 
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

