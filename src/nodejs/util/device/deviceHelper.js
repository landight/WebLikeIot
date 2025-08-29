import device from './device.js'

export default class deviceHelper{
    static arr=[];
    static isInit=false;


    static init(){
        if(!this.isInit){
            arr=[];
            this.isInit=true;
        }
    }

    static hasDevice(name){
       return this.indexOf(name)!=-1;
    }

    /**
     * @private
     */
    static indexOf(name){
        for(let i=0;i<this.arr.length;i++){
            if(this.arr[i].name==name){
                return i;
            }
        }
        return -1;
    }


    /**
     * 
     * @param {device} device 
     */
    static updateDevice(device){
        if(this.hasDevice(device.name)){
            let index=this.indexOf(device.name);
            this.arr[index] = device;
        }else{
            this.arr.push(device);
        }
    }
    
    /**
     * 
     * @param {string} name 
     * @returns {device}
     */
    static getDevice(name){
        return this.hasDevice(name)?this.arr[this.indexOf(name)]:null;
    }

    /**
     * 
     * @returns {device[]}
     */
    static list(){
        return [...this.arr];
    }


}