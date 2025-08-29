

export default class device{
    comm_type;  
    comm_addr;
    last_connect_time;
    name;
    product;

    constructor(comm_type,comm_addr,name){
        this.comm_type=comm_type;
        this.comm_addr=comm_addr;
        this.name=name;
        this.product='';
    }

    setCommunicationAddress(comm_type,comm_addr){
        this.comm_type=comm_type;
        this.comm_addr=comm_addr;
    }

    getName(){
        return this.name;
    }

    getProduct(){
        return this.product;
    }

    setProduct(product){
        this.product=product;
    }

    getCommType(){
        return this.comm_type;
    }


    getCommAddr(){
        return this.comm_addr;
    }

    connectTimeUpdate(){
        this.last_connect_time = new Date();
    }

    getLastConnectTime(){
        return this.last_connect_time;
    }
}