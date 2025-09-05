class myPacket{
    /**
     * 
     * @param {string} method 
     * @param {string} path 
     * @param {string|[]} user 
     * @param {string|[]} password 
     * @param {string} contentType 
     * @param {string|[]} content 
     */
    constructor(method="",path="",user="",password="",contentType="",content=""){
        this.setMethod(method);
        this.setPath(path);
        this.setUser(user);
        this.setPassword(password)
        this.setContent(contentType,content)
    }
    setMethod(method=""){
        this.method=method.substring(0,0xff);
    }
    setPath(path=""){
        this.path=path.substring(0,0xff);
    }
    setUser(user=""){
        let coder=new TextEncoder()
        if(Array.isArray(user)){
            this.user=user;
        }else if(typeof(user)=='string'){
            this.user=coder.encode(user.substring(0,0xff));
        }
    }
    setPassword(password){
        let coder=new TextEncoder()
        if(Array.isArray(password)){
            this.password=password;
        }else if(typeof(password)=='string'){
            this.password=coder.encode(password.substring(0,0xff));
        }
    }
    setContent(contentType="",content=[]){
        this.contentType=contentType.substring(0,0xff);
        if(typeof(content)=='string'){
            this.content=new TextEncoder().encode(content);
        }else if(Array.isArray(content)){
            this.content=content;
        }else{
            this.content=[];
        }
    }


    getUser(){
        return this.user;
    }

    getUserString(){
        return new TextDecoder().decode(new Uint8Array(this.user));
    }

    getPassword()
    {
        return this.password;
    }
    getPasswordString(){
        return new TextDecoder().decode(new Uint8Array(this.password));
    }

    getMethod(){
        return this.method;
    }

    getPath(){
        return this.path;
    }

    getContentType(){
        return this.contentType;
    }

    getContent(){
        return this.content;
    }


    getContentString(){
        return new TextDecoder().decode(new Uint8Array(this.content));
    }
    
    /**
     * 
     * @returns {Uint8Array} 字节数组
     */
    toBuffer()
    {
        const arr=[];
        const coder = new TextEncoder();

        arr.push(...coder.encode("ACTP"));
        arr.push(0x00);arr.push(0x00);

        arr.push(this.method.length&0xff);
        arr.push(...coder.encode(this.method));
        arr.push(this.path.length&0xff);
        arr.push(...coder.encode(this.path));

        arr.push(this.user.length&0xff);
        arr.push(...this.user);

        arr.push(this.password.length&0xff);
        arr.push(...this.password);

        arr.push(this.contentType.length&0xff);
        arr.push(...coder.encode(this.contentType));

        let contentLen=0;
        
        if(this.content==[]||this.content==null||this.content==undefined){
            contentLen=0;
            this.content=[];
        }else{
            if(typeof(this.content)=='string'){
                contentLen=this.content.length;
                this.content=coder.encode(this.content);
            }else if(Array.isArray(this.content) || this.content instanceof Uint8Array){
                contentLen=this.content.length;
            }else{
                contentLen=0;
                this.content=[];
            }
        }

        for (let index = 0; index < 4; index++) {
            arr.push((contentLen&0xff000000)>>24);
            contentLen=contentLen<<8;
        }
        this.content.forEach(b => {
            arr.push(b&0xff);
        });
        return Buffer.from(arr);
    }

    /**
     * 
     * @param {Uint8Array} bytes 序列化的数据 
     * @returns  {myPacket} packet  数据包对象
     */
    static parse(bytes=[]){
        let coder=new TextDecoder();
        let tmp=[];

        tmp=bytes.splice(0,4);
        if(coder.decode(new Uint8Array(tmp))!="ACTP"){
            return false;
        }

        let ver=(bytes.shift()<<8)+bytes.shift();
        if(ver!=0x0000){
            return false;
        }

        let method=coder.decode(new Uint8Array(bytes.splice(0,bytes.shift())));
        let path=coder.decode(new Uint8Array(bytes.splice(0,bytes.shift())));
        
        let user=coder.decode(new Uint8Array(bytes.splice(0,bytes.shift())));
        let password=coder.decode(new Uint8Array(bytes.splice(0,bytes.shift())));

        let contentType=coder.decode(new Uint8Array(bytes.splice(0,bytes.shift())));
        
        let contentLen=bytesToInt(bytes.splice(0,4));
        let content=bytes.splice(0,contentLen);
        
        return new myPacket(method,path,user,password,contentType,content);
        
    }
    /**
     * 
     * @param {Object} header 
     * @param {string} [header.method]
     * @param {string} [header.path]
     * @param {string} [header.user]
     * @param {string} [header.password]
     */
    setHeader({method,path,user,password}){
        Object.assign(this,{method,path,user,password})
    }


}

function bytesToInt(bytes){
    let tmp=0;
    bytes.forEach(e=>tmp=(tmp<<8)+(e&0xff));
    return tmp;
}


export default myPacket;