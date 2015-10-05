-- Name: desk_com_connector.get_list_articles_attachments
-- Created: 2015-08-10 15:23:50

CREATE virtual procedure desk_com_connector.get_list_articles_attachments ( in in_article_id string, IN in_since_id integer, IN dwh_table string ) RETURNS ( "id" integer, "file_name" string, "content_type" string, "url" string, "created_at" timestamp, "updated_at" timestamp, "total_entries" string, "page" string, topic_id string, translations_href string, attachements_href string, attachments_count integer, created_by_user_id string, updated_by_user_id string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
    if ( ( in_article_id is null )
    or ( in_article_id = '' ) ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare long unixtimestamp = 0 ;
    declare integer PagesCountLimit = 501 ;
    declare integer PageNum = 1 ;
    declare long records_processed = 0 ;
    declare integer records_processed2 = 0 ;
    declare integer totalrecords ;
    declare integer totalrecords2 ;
    declare double pagescount ;
    declare double mod_val ;
    declare integer i = 1 ;
    declare integer querrycount ;
    declare integer CurrentPage = 1 ;
    declare integer PageSize = 100 ;
    declare boolean page_limit_exceeded = false ;
    declare string endpointstring = 'articles/' || in_article_id || '/attachemnts?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' ;
    declare string internal_since_id = 0 ;
    declare string internal_since___id = 0 ;
    DECLARE string VARIABLES.dwh_schema = ( select
            nameindv
        from
            ( exec getCurrentDWH ( ) ) a ) ;
    DECLARE string VARIABLES.vdb_name = 'datavirtuality' ;
    DECLARE string VARIABLES.deltatable = LCASE ( replace ( dwh_table, '"', '' ) || 'delta' ) ;
    DECLARE string VARIABLES.locktable = LCASE ( replace ( dwh_table, '"', '' ) || 'lock' ) ;
    DECLARE integer tmpMaxID = null ;
    CREATE LOCAL TEMPORARY TABLE TabTmpMax ( c integer ) ;
    CREATE LOCAL TEMPORARY TABLE TabTmpCount ( c long ) ;
    IF ( VARIABLES.dwh_schema IS NULL )
    BEGIN
        ERROR 'DWH schema name cannot be NULL' ;
    END
    IF ( EXISTS ( select
            *
        from
            SYS.Tables t
        where
            LCASE ( t.VDBName ) = LCASE ( VARIABLES.vdb_name )
            and LCASE ( t.schemaName ) = LCASE ( VARIABLES.dwh_schema )
            and LCASE ( ( t.schemaName || '.' || t.name ) ) = LCASE ( VARIABLES.locktable ) ) )
    BEGIN
        ERROR 'Another "get_list_articles_attachments" incremental update is already running on the provided DWH table. Please, wait until the concurrent update is completed. If the server has been suddenly shut down when a batch udpate was running or an unexpected error occurred during a previous batch execution, it is possible that the lock table has not been correctly dropped. Only in this case, please manually delete the lock table from the DV Server running the command DROP TABLE ' || VARIABLES.locktable ;
    END
    EXECUTE IMMEDIATE 'CREATE TABLE ' || VARIABLES.locktable || '(a integer)' WITHOUT RETURN ;
    CREATE LOCAL TEMPORARY TABLE tmpTable ( "id" integer, "file_name" string, "content_type" string, "url" string, "created_at" timestamp, "updated_at" timestamp, "total_entries" string, "page" string, topic_id string, translations_href string, attachements_href string, attachments_count integer, created_by_user_id string, updated_by_user_id string ) ;
    IF ( NOT EXISTS ( select
            *
        from
            SYS.Tables t
        where
            LCASE ( t.VDBName ) = LCASE ( VARIABLES.vdb_name )
            and LCASE ( t.schemaName ) = LCASE ( VARIABLES.dwh_schema )
            and LCASE ( ( t.schemaName || '.' || t.name ) ) = LCASE ( replace ( dwh_table, '"', '' ) ) ) )
    BEGIN
        EXECUTE IMMEDIATE 'SELECT * INTO ' || dwh_table || ' FROM  tmpTable LIMIT 0' WITHOUT RETURN ;
    END
    IF ( EXISTS ( select
            *
        from
            SYS.Tables t
        where
            LCASE ( t.VDBName ) = LCASE ( VARIABLES.vdb_name )
            and LCASE ( t.schemaName ) = LCASE ( VARIABLES.dwh_schema )
            and LCASE ( ( t.schemaName || '.' || t.name ) ) = LCASE ( VARIABLES.deltatable ) ) )
    BEGIN
        EXECUTE IMMEDIATE 'DROP TABLE ' || deltatable WITHOUT RETURN ;
    END
    totalrecords = SELECT
            "xml_table.total_entries"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => 'articles/' || in_article_id || '/attachemnts?sort_field=created_at&sort_direction=asc&since_id=' || internal_since___id ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ;
    IF ( in_since_id IS NOT NULL )
    BEGIN
        internal_since_id = '&since_id=' || in_since_id ;
        endpointstring = 'articles/' || in_article_id || '/attachemnts?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
        totalrecords = ( SELECT
                "xml_table.total_entries"
            FROM
                ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ) ;
    END
    else internal_since_id = '&since_id=' || 0 ;
    if ( totalrecords > 0 )
    begin
        pagescount = cast ( totalrecords as double ) / PageSize ;
        mod_val = pagescount - floor ( pagescount ) ;
        querrycount = round ( cast ( pagescount as integer )
        , 0 ) + 1 ;
        exec "SYSADMIN.logMsg" ( "level" => 'INFO'
        , "context" => 'org.teiid.PROCESSOR'
        , "msg" => '[desk_com_connector.get_list_articles_attachments] Max Pages to get: ' || querrycount ) ;
        while ( i <= querrycount )
        begin
            if ( ( in_since_id is not null )
            and ( i = 1 ) )
            begin
                totalrecords2 = totalrecords ;
                records_processed2 = i * PageSize ;
            end
            else if ( ( in_since_id is not null )
            and ( i > 1 ) )
            begin
                records_processed2 = i * PageSize ;
            end
            IF ( ( NOT page_limit_exceeded )
            and ( ( in_since_id IS NULL )
            or ( in_since_id = 0 ) ) )
            BEGIN
                if ( totalrecords - cast ( cast ( records_processed as string ) as integer ) < PageSize ) PageSize = totalrecords - cast ( cast ( records_processed as string ) as integer ) ;
                endpointstring = 'articles/' || in_article_id || '/attachemnts?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since___id
                , '' ) ;
                PageNum = PageNum + 1 ;
            END
            else
            begin
                if ( tmpMaxID is null )
                begin
                    endpointstring = 'articles/' || in_article_id || '/attachemnts?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since___id
                    , '' ) ;
                end
                else
                begin
                    endpointstring = 'articles/' || in_article_id || '/attachemnts?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc&since_id=' || tmpMaxID ;
                end
                PageNum = PageNum + 1 ;
            end
            exec "SYSADMIN.logMsg" ( "level" => 'INFO'
            , "context" => 'org.teiid.PROCESSOR'
            , "msg" => '[desk_com_connector.get_list_articles_attachments] Executing "' || endpointstring || '"' ) ;
            INSERT
                INTO tmpTable SELECT
                        "xml_table.id"
                        , "xml_table.file_name"
                        , "xml_table.content_type"
                        , "xml_table.url"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.created_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "created_at"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.updated_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "updated_at"
                        , "xml_table.total_entries"
                        , "xml_table.page"
                        , substring ( "xml_table.topic_id", 16 ) as topic_id
                        , "xml_table.translations_href"
                        , "xml_table.attachements_href"
                        , "xml_table.attachments_count"
                        , substring ( "xml_table.created_by_user_id", 15 ) as created_by_user_id
                        , substring ( "xml_table.updated_by_user_id", 15 ) as updated_by_user_id
                    FROM
                        ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                        , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//entries' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "id" INTEGER PATH 'id', "file_name" STRING PATH 'file_name', "content_type" STRING PATH 'content_type', "url" STRING PATH 'url', "created_at" STRING PATH 'created_at', "updated_at" STRING PATH 'updated_at', "total_entries" STRING PATH '../../total_entries', "page" STRING PATH '../../page', "topic_id" STRING PATH '_links/topic/href', "translations_href" STRING PATH '_links/translations/href', "attachements_href" STRING PATH '_links/attachments/href', "attachments_count" INTEGER PATH '_links/attachments/count', "created_by_user_id" STRING PATH '_links/created_by/href', "updated_by_user_id" STRING PATH '_links/updated_by/href' ) "xml_table" ;
            EXECUTE IMMEDIATE 'SELECT * INTO ' || VARIABLES.deltatable || ' FROM tmpTable' WITHOUT RETURN ;
            DELETE
                FROM
                    tmpTable ;
            /*----------------------------------------checking duplicates*/
            /*            EXECUTE IMMEDIATE 'DELETE FROM ' || dwh_table || '  WHERE id IN (SELECT id as a FROM ' || VARIABLES.deltatable || ')' WITHOUT RETURN ;*/
            /*----------------------------------------checking duplicates*/
            EXECUTE IMMEDIATE 'INSERT INTO ' || dwh_table || ' SELECT * FROM ' || deltatable WITHOUT RETURN ;
            EXECUTE IMMEDIATE 'DROP TABLE ' || deltatable WITHOUT RETURN ;
            if ( PageNum = PagesCountLimit )
            BEGIN
                page_limit_exceeded = true ;
                PageNum = 1 ;
                DELETE
                    FROM
                        TabTmpMax ;
                EXECUTE IMMEDIATE 'INSERT INTO TabTmpMax SELECT max ( id ) FROM ' || dwh_table WITHOUT RETURN ;
                tmpMaxID = select
                        c
                    from
                        TabTmpMax ;
            END
            IF ( in_since_id IS NOT NULL )
            BEGIN
                if ( ( totalrecords2 - records_processed2 ) < PageSize ) PageSize = totalrecords2 - records_processed2 ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_articles_attachments] Totalrecords from get_list_articles_attachments are ' || totalrecords || '.
        Processed records are ' || records_processed2 ) ;
            end
            else
            BEGIN
                if ( totalrecords - cast ( cast ( records_processed as string ) as integer ) < PageSize ) PageSize = totalrecords - cast ( cast ( records_processed as string ) as integer ) ;
                DELETE
                    FROM
                        TabTmpCount ;
                EXECUTE IMMEDIATE 'INSERT INTO TabTmpCount SELECT count(*) FROM ' || dwh_table WITHOUT RETURN ;
                records_processed = select
                        c
                    from
                        TabTmpCount ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_articles_attachments] Totalrecords from get_list_articles_attachments are ' || totalrecords || '.
        Processed records are ' || records_processed ) ;
            end
            i = i + 1 ;
        end
    end
    EXECUTE IMMEDIATE 'DROP TABLE ' || VARIABLES.locktable WITHOUT RETURN ;
    execute immediate 'select * from ' || dwh_table as "id" integer
    , "file_name" string
    , "content_type" string
    , "url" string
    , "created_at" timestamp
    , "updated_at" timestamp
    , "total_entries" string
    , "page" string
    , topic_id string
    , translations_href string
    , attachements_href string
    , attachments_count integer
    , created_by_user_id string
    , updated_by_user_id string ;
end


