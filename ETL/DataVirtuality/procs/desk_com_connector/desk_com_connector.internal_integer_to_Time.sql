-- Name: desk_com_connector.internal_integer_to_Time
-- Created: 2015-08-10 15:23:17

CREATE virtual procedure desk_com_connector.internal_integer_to_Time ( IN in_seconds integer ) returns ( Time_from_seconds_int string ) as
BEGIN
    select
            x."hours" || ':' || x."minutes" || ':' || x."seconds" as Time_from_seconds_int
        from
            ( OBJECTTABLE ( language 'javascript' ' 
                             var myDate = new Date(seconds * 1000 );
                             var thedate = {};
                             thedate["hours"] = myDate.getUTCHours();
                            thedate["minutes"] = myDate.getUTCMinutes();
                            thedate["seconds"] = myDate.getUTCSeconds();
                           thedate
                   ' PASSING "in_seconds" as "seconds" COLUMNS "hours" integer 'dv_row.hours', "minutes" integer 'dv_row.minutes', "seconds" integer 'dv_row.seconds' ) as "x" ) ;
END


