#! /usr/bin/env python
# -*- coding: utf-8 -*-

"""
在节点服务器上运行该程序，主服务器上通过运行 v2-ui address remark 添加节点服务器后在更新配置文件时会自动传输配置文件给节点服务
器。
"""

from socket import *
import json
import struct
import subprocess


def node_added(conn_socket):
    print("[I] Handling node added...")
    conn_socket.send("ack".encode("utf-8"))


def config_changed(conn_socket, filesize):
    print("[I] Handling config changed...")
    print("[I] Ready to receive file with size: %d" % filesize)
    recv_len = 0
    with open("/etc/v2ray/config.json", "wb") as f:
        while recv_len < filesize:
            data = conn_socket.recv(1024)
            # print(data)
            f.write(data)
            recv_len += len(data)
    print("[I] File receiving done.")
    print("[I] Restarting v2ray service...")
    code = -100
    p = None
    try:
        p = subprocess.Popen("service v2ray restart", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        code = p.wait()
        if code != 0:
            print(p.stdout.read().decode('utf-8'), code)
        result = p.stdout.read()
        print("[I] %s" % result.decode('utf-8'))
        print("[I] Successfully started.")
    except Exception as e:
        print(str(e), code)
    finally:
        print("[I] Done.")


if __name__ == "__main__":
    svr = socket(AF_INET, SOCK_STREAM)
    try:
        svr.bind(("0.0.0.0", 40001))
    except OSError as e:
        svr.setsockopt(SOL_SOCKET, SO_REUSEPORT)
        svr.bind(("0.0.0.0", 40001))
    svr.listen(5)
    print("[I] Listening on 40001...")
    while True:
        try:
            conn, addr = svr.accept()
            print("[I] Received connection from: %s:%d" % addr)
            header_len = conn.recv(4)
            if header_len:
                print("[I] Ready to receive data.")
            header_len = struct.unpack('i', header_len)[0]
            data = conn.recv(header_len).decode("utf-8")
            data = json.loads(data)
            if data:
                cmd = data["command"]
                if cmd == "node_added":
                    node_added(conn)
                elif cmd == "config_changed":
                    config_changed(conn, data["filesize"])
                else:
                    print("[E] Unsupported command: %s." % cmd)
            else:
                print("[E] No data received.")
            conn.close()
        except Exception as e:
            print("[E] Catched exceptions: %s " % str(e))
            continue
        except KeyboardInterrupt as e:
            break
