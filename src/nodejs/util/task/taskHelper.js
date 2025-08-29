import task from "./task.js";

export default class taskHelper{
    static tasks=[];
    static count=0;
    static COUNT_FORERVER = -1;

    static init(){
        this.count=0;
        this.tasks=[];
        setInterval(()=>{
            this.count++;
            for (let index = 0; index < this.tasks.length; index++) {
                let t=this.tasks[index];
                if(this.count%t.delay==t.remainder){
                    if(t.count>0){
                        t.count--;
                    }else if(t.count==0){
                        this.tasks.splice(index,1);
                        continue;
                    }
                    t.task.run()
                }
            }
        },1000);
    }

    /**
     * 
     * @param {task} task 
     * @param {number} delay 延时秒
     * @param {number} count 次数
     */
    static addTask(task,delay,count){
        this.tasks.push({task,delay,count,remainder:this.count%delay});
    }

    /**
     * 
     * @param {()=>void} runable 
     * @param {number} delay 延时秒
     * @param {number} count 次数
     */
    static addRunable(runable,delay,count){
        let t=new task();
        t.run=runable;
        this.tasks.push({task:t,delay,count,remainder:this.count%delay});
    }

    static list(){
        return [...this.tasks];
    }


}