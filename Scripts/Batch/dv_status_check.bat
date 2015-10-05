@echo off

setlocal EnableExtensions
setlocal EnableDelayedExpansion

set scriptname=%~n0

set last_status="ALIVE"
set current_status="ALIVE"

rem Entering infinite loop (from 1 to 2 with step 0)...

for /l %%x in (1, 0, 2) do (
	rem echo Step 1
	rem echo Last: !last_status!
	rem echo Current: !current_status!
	rem echo Checking the DV connection...

	nc64.exe -z -w5 10.0.0.54 35432

	set minutes=!time:~3,1!
	set day=!date:~0,2!
	set logname=c:\Scripts\%scriptname%_!day!.log

	if errorlevel 1 (
		echo !date! !time! Connection to DataVirtuality is dead^^! >> !logname!
		set current_status="DEAD"
		rem echo Step 2.1
		rem echo Last: !last_status!
		rem echo Current: !current_status!
	) else (
		rem Reporting good status only once per hour to keep the log clean
		if !minutes!==0 (
			echo !date! !time! Connection to DataVirtuality is alive. >> !logname!
		)
		set current_status="ALIVE"
		rem echo Step 2.2
		rem echo Last: !last_status!
		rem echo Current: !current_status!
	)

	if !last_status!=="ALIVE" (
		if !current_status!=="DEAD" (
			echo !date! !time! Connection to DataVirtuality was lost^^! >> !logname!
			rem add to PATH: "C:\Email alert\"
			sendEmail.exe -f bireports@outfittery.de -t dmytro.lytvyn@outfittery.de hemanth.vulkundkar@outfittery.de murari.goswami@outfittery.de -u "Tableau Server lost DV connection" -m "Tableau Server lost DataVirtuality connection and will be restarted as soon as the connection is restored" -s smtp.gmail.com:587 -xu bireports@outfittery.de -xp <password> -o tls=yes >> !logname!
		)
	)

	if !last_status!=="DEAD" (
		if !current_status!=="ALIVE" (
			echo !date! !time! Connection to DataVirtuality was restored^^! >> !logname!
			echo !date! !time! Restarting the Tableau Server after DV connection restore... >> !logname!
			rem add to PATH: "C:\Program Files\Tableau\Tableau Server\9.0\bin\"
			start /wait tabadmin.exe restart
			echo !date! !time! Restarted Tableau Server with status %errorlevel% >> !logname!
			rem add to PATH: "C:\Email alert\"
			sendEmail.exe -f bireports@outfittery.de -t dmytro.lytvyn@outfittery.de hemanth.vulkundkar@outfittery.de murari.goswami@outfittery.de -u "Tableau Server restarted" -m "Tableau Server was restarted after DataVirtuality connection restore, please find the log attached" -s smtp.gmail.com:587 -xu bireports@outfittery.de -xp <password> -o tls=yes -a !logname! >> !logname!
		)
	)

	set last_status=!current_status!

	rem echo Step 3
	rem echo Last: !last_status!
	rem echo Current: !current_status!

	rem Waiting for 5 minutes (300 seconds)
	rem ping -n 301 127.0.0.1 >nul
	timeout 300 >nul
)
