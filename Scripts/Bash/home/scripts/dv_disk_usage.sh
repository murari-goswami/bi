#!/bin/bash
echo `date +"%F %T"` `df -h | grep sda1 | awk '{print $1,$5}'` >> /var/log/dv_disk_usage.log
