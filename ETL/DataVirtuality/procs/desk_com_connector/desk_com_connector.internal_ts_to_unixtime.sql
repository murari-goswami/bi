-- Name: desk_com_connector.internal_ts_to_unixtime
-- Created: 2015-08-10 15:23:16

CREATE virtual procedure desk_com_connector.internal_ts_to_unixtime (
    in in_strsrc timestamp
) returns (
    unixtimestamp long
) as
begin
    /*    declare string strsrc = '2013-10-14T08:26:51Z' ;*/
    select
            TIMESTAMPDIFF (
                SQL_TSI_SECOND
                ,'1970-01-01 00:00:00.0'
				, in_strsrc
            ) -3600 ;
end


