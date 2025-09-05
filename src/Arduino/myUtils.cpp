#include <ESP8266WiFi.h>
#include "Arduino.h"
#include <WiFiUdp.h>
#include <Ticker.h>

#include "myUtils.h"
#include "config.h"




Ticker timer;
task TaskArray[TASK_MAX_NUMBER]={0};

void WIFI_Init()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(STASSID, STAPSK);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(300);
  }
  
}

void task_Scan(void)
{
  static uint32 count=0;
  count++;
  for(uint16 i=0;i<TASK_MAX_NUMBER;i++){
    if(TaskArray[i].delay!=0 && count%TaskArray[i].delay==0)
    {
      //如果到达的等待的时间
      if( TaskArray[i].count>0 && TaskArray[i].count!=0xffff)
      {
        TaskArray[i].count--;
        TaskArray[i].run();
      }else if (TaskArray[i].count==0xffff) {
        TaskArray[i].run();
      }
    }
  }
}

void task_Start(void)
{
  timer.attach(1,task_Scan);
}

bool task_Add_Runnable(uint16 count,uint32 delay,void (*run)())
{
  uint16 i=0;
  for(;i<TASK_MAX_NUMBER;i++)
  {
    if(TaskArray[i].count==0){
      TaskArray[i].count=count;
      TaskArray[i].delay=delay;
      TaskArray[i].run=run;
      return true;
    }
  }
  return false;
}
