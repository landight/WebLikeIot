#include "Arduino.h"

#include "packet.h"
#include "myUtils.h"
#include "myServer.h"
#include "config.h"


uint32_t packet_to_buffer(packet *p, uint8_t *buf) {

  uint32_t i = 0;  //偏移量
  uint32_t len = 0;

  buf[0] = 'A', buf[1] = 'C', buf[2] = 'T', buf[3] = 'P';

  buf[4] = MYPACKET_VERSION / 256, buf[5] = MYPACKET_VERSION % 256;
  i += 6;

  len = strlen(p->method);  //method
  if (len > 256) {
    return 0;
  }
  buf[i++] = len;
  strcpy((char *)(buf + i), p->method);
  i += len;

  len = strlen(p->path);  //path
  if (len > 256) {
    return 0;
  }
  buf[i++] = len;
  strcpy((char *)(buf + i), p->path);
  i += len;

  len = p->user_len;  //user
  if (len > 256) {
    return 0;
  }
  buf[i++] = len;
  memcpy((char *)(buf + i), p->user,p->user_len);
  i += len;

  len = p->password_len;  //password
  if (len > 256) {
    return 0;
  }
  buf[i++] = len;
  memcpy((char *)(buf + i), p->password,p->password_len);
  i += len;

  len = strlen(p->content_type);  //content_type
  if (len > 256) {
    return 0;
  }
  buf[i++] = len;
  strcpy((char *)(buf + i), p->content_type);
  i += len;

  buf[i++] = (p->content_len >> 24) & 0xff;
  buf[i++] = (p->content_len >> 16) & 0xff;
  buf[i++] = (p->content_len >> 8) & 0xff;
  buf[i++] = (p->content_len >> 0) & 0xff;

  memcpy(buf + i, p->content, p->content_len);

  return i + p->content_len;
}

bool packet_parse(uint8 *buf, uint32_t buf_len, packet *p) {
  uint32_t i = 0;
  int len = 0;


  if (!(buf[0] == 'A' && buf[1] == 'C' && buf[2] == 'T' && buf[3] == 'P')) {
    return false;
  }  //ACTP

  if ((buf[4] << 8) + buf[5] != 0) {
    return false;
  }  //ver
  i = 5;

  len = buf[++i];
  if (len + i + 8 > buf_len) {
    return false;
  }
  memcpy(p->method, buf + i + 1, min(len, MYPACKET_METHOD_MAX_LEN));
  i += len;  //method

  len = buf[++i];
  if (len + i + 7 > buf_len) {
    return false;
  }
  memcpy(p->path, buf + i + 1, min(len, MYPACKET_PATH_MAX_LEN));
  i += len;  //path

  len = buf[++i];
  if (len + i + 6 > buf_len) {
    return false;
  }
  memcpy(p->user, buf + i + 1, min(len, MYPACKET_USER_MAX_LEN));
  i += len;  //user

  len = buf[++i];
  if (len + i + 5 > buf_len) {
    return false;
  }
  memcpy(p->password, buf + i + 1, min(len, MYPACKET_PASSWORD_MAX_LEN));
  i += len;

  len = buf[++i];
  if (len + i + 4 > buf_len) {
    return false;
  }
  memcpy(p->content_type, buf + i + 1, min(len, MYPACKET_CON_TYPE_MAX_LEN));
  i += len;  //content type

  p->content_len = (buf[i] << 24) + (buf[i] << 16) + (buf[i] << 8) + (buf[i] << 0);
  i += 4;
  //content length

  len = buf[++i];
  if (len + i > buf_len) {
    return false;
  }
  memcpy(p->method, buf + i + 1, min(len, MYPACKET_METHOD_MAX_LEN));

  return true;
}

void packet_setMethod(packet *p, const char *method) {
  strncpy(p->method, method, MYPACKET_METHOD_MAX_LEN - 1);
}

void packet_setPath(packet *p, const char *path) {
  strncpy(p->path, path, MYPACKET_PATH_MAX_LEN);
}

void packet_setUser(packet *p, uint8_t *user, uint8_t user_len) {
  user_len = (user_len > MYPACKET_USER_MAX_LEN) ? MYPACKET_USER_MAX_LEN : user_len;
  memcpy(p->user, user, user_len);
  p->user_len = user_len;
}

void packet_setUserString(packet *p, const char *user) {
  p->user_len = strlen(user);
  p->user_len = (p->user_len > MYPACKET_USER_MAX_LEN) ? MYPACKET_USER_MAX_LEN : p->user_len;
  strncpy((char *)p->user, user, MYPACKET_USER_MAX_LEN);
}

void packet_setPassword(packet *p, uint8_t *password, uint8_t password_len) {
  password_len = (password_len > MYPACKET_PASSWORD_MAX_LEN) ? MYPACKET_PASSWORD_MAX_LEN : password_len;
  memcpy(p->password, password, password_len);
  p->password_len = password_len;
}

void packet_setPasswordString(packet *p, const char *password) {
  p->password_len = strlen(password);
  p->password_len = (p->password_len > MYPACKET_PASSWORD_MAX_LEN) ? MYPACKET_PASSWORD_MAX_LEN : p->password_len;
  strncpy((char *)p->password, password, MYPACKET_PASSWORD_MAX_LEN);
}


void packet_setHeader(packet *p, const char *method, const char *path, const char *user, const char *password) {
  packet_setMethod(p, method);
  packet_setPath(p, path);
  packet_setUserString(p, user);
  packet_setPasswordString(p, password);
}


void packet_setContent(packet *p, const char *type, uint32_t len,const uint8_t *content) {
  strncpy(p->content_type, type, MYPACKET_CON_TYPE_MAX_LEN);
  len = (len > MYPACKET_CON_MAX_LEN) ? MYPACKET_CON_MAX_LEN : len;
  memcpy(p->content, content, len);
  p->content_len = len;
}
