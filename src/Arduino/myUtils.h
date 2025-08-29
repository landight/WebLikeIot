#ifndef UTIL_H
#define UTIL_H

#include <Arduino.h>
#include "Ticker.h"

#include "config.h"



typedef struct 
{
    uint16 count;
    uint16 delay;
    void (*run)();
} task;



void WIFI_Init(void);

void task_Start(void);
bool task_Add_Runnable(uint16 count,uint32 delay,void (*run)());


#endif