-- Name: raw.sec_2_hrmisec
-- Created: 2015-09-08 12:02:17

CREATE virtual procedure raw.sec_2_hrmisec (IN in_seconds long ) RETURNS ("hms" string) 
as
begin
    DECLARE long VARIABLES.MINUTES_IN_AN_HOUR = 60;
    DECLARE long VARIABLES.SECONDS_IN_A_MINUTE = 60;
    
    DECLARE long VARIABLES.local_second=in_seconds;
    DECLARE long VARIABLES.hours=0;
    DECLARE long VARIABLES.minutes=0;
    DECLARE string hms=null;
    
    VARIABLES.minutes = VARIABLES.local_second / VARIABLES.SECONDS_IN_A_MINUTE;
    VARIABLES.local_second = VARIABLES.local_second - (minutes * VARIABLES.SECONDS_IN_A_MINUTE);

    VARIABLES.hours = (VARIABLES.minutes / VARIABLES.MINUTES_IN_AN_HOUR);
    VARIABLES.minutes = VARIABLES.minutes - (VARIABLES.hours * VARIABLES.MINUTES_IN_AN_HOUR);
	
	hms = lpad(cast(VARIABLES.hours as string),2,0)||':'||lpad(cast(VARIABLES.minutes as string),2,0)||':'||lpad(cast(VARIABLES.local_second as string),2,0);
	select hms;
end


