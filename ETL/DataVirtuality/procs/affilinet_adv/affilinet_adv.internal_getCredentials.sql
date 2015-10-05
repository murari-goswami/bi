-- Name: affilinet_adv.internal_getCredentials
-- Created: 2015-04-24 19:18:33

CREATE virtual procedure affilinet_adv.internal_getCredentials (
    IN datasourceName string
    ,IN username string
    ,IN password string
) RETURNS (
    username string
    ,password string
) AS
BEGIN
    DECLARE string dsParams = (
        SELECT
                modelProperties
            FROM
                "SYSADMIN.DataSources"
            where
                "name" = datasourceName
    ) ;
    DECLARE string i_username = 'USERNAME' ;
    DECLARE string i_password = 'PASSWORD' ;
    IF (
        username IS NOT NULL
    )
    BEGIN
        i_username = username ;
    END
    IF (
        password IS NOT NULL
    )
    BEGIN
        i_password = password ;
    END
    create local temporary table cre (
        username string
        ,password string
    ) ;
    EXECUTE IMMEDIATE 'insert into cre select
cast(username as string), cast( password as string)
from 
   ( 
       OBJECTTABLE ( 
           language    ''javascript'' ''var matches = par1.match(/([^=,]*)=("(?:\\.|[^"\\]+)*"|[^,"]*)/g);
						var result = {};
						for( i=0;i<matches.length;i++) {
							var key = matches[i].match(/([^=,]*)=("[^"]*"|[^,"]*)/)[1];
							var value = matches[i].match(/([^=,]*)=("[^"]*"|[^,"]*)/)[2];
							result[key] = value;
						}
						result''
                       PASSING dsParams AS "par1"  COLUMNS "username" object ''dv_row.' || i_username || ''', "password" object ''dv_row.' || i_password || '''
       ) AS x 
   );' without return ;
    select
            *
        from
            cre ;
END


