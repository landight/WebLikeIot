import taskRunnable from "./taskRunnable.js";

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
     * @param {taskRunnable | ()=>void} runnable 
     * @param {number} delay 延时秒
     * @param {number} count 次数
     */
    static addTask(runnable,delay,count){

        if(runnable instanceof taskRunnable){
            this.tasks.push({task:runnable,delay,count,remainder:this.count%delay});
        }else if(typeof(runnable) == 'function' ) {
            let t=new taskRunnable();
            t.run=runnable;
            this.tasks.push({task:t,delay,count,remainder:this.count%delay});
        }
    }


    static list(){
        return [...this.tasks];
    }


}