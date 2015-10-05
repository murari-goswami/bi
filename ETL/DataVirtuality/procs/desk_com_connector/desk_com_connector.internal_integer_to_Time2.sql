-- Name: desk_com_connector.internal_integer_to_Time2
-- Created: 2015-08-10 15:23:15

create virtual procedure desk_com_connector.internal_integer_to_Time2 ( IN in_seconds integer ) returns ( Time_from_seconds_int string ) as
BEGIN
    select
            "result" as Time_from_seconds_int
        from
            OBJECTTABLE ( LANGUAGE 'javascript' 'var sec = par1;
						var min = java.util.concurrent.TimeUnit.SECONDS.toMinutes(sec);
						var hours = java.util.concurrent.TimeUnit.MINUTES.toHours(min);
						var remainMinute = min - java.util.concurrent.TimeUnit.HOURS.toMinutes(hours);
						var remainSeconds = sec - java.util.concurrent.TimeUnit.MINUTES.toSeconds(min);

						var result =  hours + ":" + remainMinute+":"+  remainSeconds;
						result.toString();
						' PASSING in_seconds AS "par1" COLUMNS "result" string 'dv_row' ) as g ;
end


