export default class task{

    name='未命名'
    desc='无简介'

    constructor(){
        
    }

    /**
     * 重写这个方法
     */
    run(){

    }

    /**
     * 
     * @param {string} name 
     */
    setName(name){
        this.name=name;
    }
    /**
     * 
     * @param {string} desc 
     */
    setDesc(desc){
        this.desc=desc;
    }



    /**
     * 
     * @returns {string}
     */
    getName(){
        return this.name;
    }

    /**
     * 
     * @returns {string}
     */
    getDesc(){
        return this.desc;
    }

}