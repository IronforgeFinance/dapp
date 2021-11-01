#!/usr/bin/env bash

# yarn build:test
# tar -zcvf dist.tar.gz dist
# 指定pem配置文件
# scp -rp -i ~/.ssh/ironforge_dev_aliyun.pem dist.tar.gz root@47.243.188.91:/usr/workspace/ironforge_front
# scp dist.tar.gz root@47.243.188.91:/usr/workspace/ironforge_front   

# 上传video文件到服务器，如果已经上传过则忽略
# scp src/assets/videos/mint.webm root@47.243.188.91:/usr/workspace/ironforge_front/dist/static
# scp src/assets/videos/burn.webm root@47.243.188.91:/usr/workspace/ironforge_front/dist/static

set HOST 47.243.188.91
set USER root

ssh -t $USER@$HOST -i ~/.ssh/ironforge_dev_aliyun.pem  "cd /usr/workspace/ironforge_front && echo 'done'"



# deploy在服务器上解压文件即可
# cd /usr/workspace/ironforge_front
# tar -xzvf dist.tar.gz dist