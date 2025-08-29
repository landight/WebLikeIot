#ifndef PACKET_H
#define PACKET_H

#define  MYPACKET_VERSION 0


#define MYPACKET_METHOD_MAX_LEN 10
#define MYPACKET_PATH_MAX_LEN 20
#define MYPACKET_USER_MAX_LEN 20
#define MYPACKET_PASSWORD_MAX_LEN 10
#define MYPACKET_CON_TYPE_MAX_LEN 10
#define MYPACKET_CON_MAX_LEN 100

typedef struct {
  char method[MYPACKET_METHOD_MAX_LEN + 1];
  char path[MYPACKET_PATH_MAX_LEN + 1];
  uint8_t user_len;
  uint8_t user[MYPACKET_USER_MAX_LEN + 1];
  uint8_t password_len;
  uint8_t password[MYPACKET_PASSWORD_MAX_LEN + 1];
  char content_type[MYPACKET_CON_TYPE_MAX_LEN + 1];
  uint32_t content_len;
  uint8_t content[MYPACKET_CON_MAX_LEN + 1];
} packet;


uint32_t packet_to_buffer(packet * p,uint8_t * buf);
bool packet_parse(uint8* buf,uint32_t buf_len,packet * p);
void packet_setMethod(packet *p,const char * method);
void packet_setPath(packet *p,const char * path);
void packet_setUser(packet *p,uint8_t * user,uint8_t user_len);
void packet_setUserString(packet *p,const char * user);
void packet_setPassword(packet *p,uint8_t * password,uint8_t password_len);
void packet_setPasswordString(packet *p,const char * password);
void packet_setHeader(packet *p,const char* method,const char * path,const char * user,const char * password);
void packet_setContent(packet *p,const char * type,uint32_t len,const uint8_t * content);

#endif