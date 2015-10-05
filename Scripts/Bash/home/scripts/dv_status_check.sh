#!/bin/bash

SCRIPTNAME="DV status check"
LOCKFILE="/tmp/.dv_status_check.lock"
LOGFILE="/var/log/dv_status_check.log"
RECIPIENTS="dmytro.lytvyn@outfittery.de; hemanth.vulkundkar@outfittery.de; murari.goswami@outfittery.de"

function notify {
	NOW=$(date +"%F %T")
	echo "${NOW} ${SCRIPTNAME}: ! ERROR: $1" >&2
	echo "${NOW} ${SCRIPTNAME}: ! ERROR: $1" >> ${LOGFILE}
	echo "${NOW} ${SCRIPTNAME}: ! ERROR: $1" | mutt -s "${SCRIPTNAME}" "${RECIPIENTS}" -a "${LOGFILE}" --
}

function mecho {
	NOW=$(date +"%F %T")
	echo "${NOW} ${SCRIPTNAME}: * $1"
	echo "${NOW} ${SCRIPTNAME}: * $1" >> ${LOGFILE}
}

function conn_test()
{
	echo `nc -z -w5 127.0.0.1 35432; echo $?`
}

if [ -f "$LOCKFILE" ]
then
	mecho "Script seems to be already running ($LOCKFILE is present), exiting..."
	exit
else
	#mecho "Script doesn't seem to be running, creating $LOCKFILE..."
	touch ${LOCKFILE}
fi

# Testing the connection to DV
if [[ $(conn_test) == "1" ]]
then
	mecho "DV server is not responding, restarting it!"
	service datavirtuality restart

	mecho "Waiting for 20 minutes (usually it starts within 15 minutes)..."
	sleep 20m
	mecho "Checking the DV connection again..."

	if [[ $(conn_test) == "1" ]]
	then
		notify "DV server is not responding, restarting it doesn't seem to have help! Manual interference is needed!"
	else
		notify "DV server was not responding, but returned back online after a restart."
	fi
else
	mecho "DV server is responding fine."
fi

#mecho "Script is finished, removing $LOCKFILE..."
rm ${LOCKFILE}
