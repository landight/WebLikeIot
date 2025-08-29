#ifndef SERVER_H
#define SERVER_H


#include "Arduino.h"

#include "config.h"
#include "packet.h"


typedef struct {
  bool next;
  bool send;
  String comm_type;
} route_flag;


typedef void (*myServerHandle)(packet* req, packet* res, route_flag* flag);

typedef struct
{
  const char* method;
  const char* path;
  myServerHandle handle;
} route;




void UDP_Server_Start(void);
bool UDP_Server_Add_Handle(const char* method, const char* path, myServerHandle handle);
void UDP_Server_Scan(void);

bool UDP_Server_Send(const char *host, packet * p);
bool UDP_Server_Broadcast( packet * p);

#endif