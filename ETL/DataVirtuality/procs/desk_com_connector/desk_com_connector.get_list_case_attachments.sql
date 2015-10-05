-- Name: desk_com_connector.get_list_case_attachments
-- Created: 2015-08-10 15:23:21

CREATE virtual procedure desk_com_connector.get_list_case_attachments ( in in_case_id string, IN in_since_id integer ) RETURNS ( "id" integer, "created_at" timestamp, "updated_at" timestamp, "erased_at" timestamp, "size" string, "url" string, "file_name" string, "content_type" string, "total_entries" string, "page" string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
    if ( ( in_case_id is null )
    or ( in_case_id = '' ) ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
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
    declare string endpointstring = 'cases/' || in_case_id || '/attachments?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' ;
    declare string internal_since_id = 0 ;
    declare string internal_since___id = 0 ;
    DECLARE integer tmpMaxID = null ;
    CREATE LOCAL TEMPORARY TABLE TabTmpMax ( c integer ) ;
    CREATE LOCAL TEMPORARY TABLE TabTmpCount ( c long ) ;
    CREATE LOCAL TEMPORARY TABLE tbltmp ( "id" integer, "created_at" timestamp, "updated_at" timestamp, "erased_at" timestamp, "size" string, "url" string, "file_name" string, "content_type" string, "total_entries" string, "page" string ) ;
    totalrecords = SELECT
            "xml_table.total_entries"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => 'cases/' || in_case_id || '/attachments?sort_field=created_at&sort_direction=asc&since_id=' || internal_since___id ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ;
    IF ( in_since_id IS NOT NULL )
    BEGIN
        internal_since_id = '&since_id=' || in_since_id ;
        endpointstring = 'cases/' || in_case_id || '/attachments?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
    END
    else internal_since_id = '&since_id=' || 0 ;
    if ( totalrecords > 0 )
    begin
        pagescount = cast ( totalrecords as double ) / PageSize ;
        mod_val = pagescount - floor ( pagescount ) ;
        querrycount = round ( cast ( pagescount as integer ), 0 ) + 1 ;
        exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_case_attachments] Max Pages to get: ' || querrycount ) ;
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
                if ( ( totalrecords - cast ( cast ( records_processed as string ) as integer ) ) < PageSize )
                begin
                    PageSize = ( totalrecords - cast ( cast ( records_processed as string ) as integer ) ) ;
                end
                endpointstring = 'cases/' || in_case_id || '/attachments?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
            END
            else
            begin
                if ( tmpMaxID is null )
                begin
                    endpointstring = 'cases/' || in_case_id || '/attachments?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
                end
                else
                begin
                    endpointstring = 'cases/' || in_case_id || '/attachments?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc&since_id=' || tmpMaxID ;
                end
                PageNum = PageNum + 1 ;
            end
            exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_case_attachments] Executing "' || endpointstring || '"' ) ;
            INSERT
                INTO tbltmp SELECT
                        "xml_table.id"
                        , PARSETIMESTAMP ( "xml_table.created_at", 'yyyy-MM-dd''T''hh:mm:ssX' ) as "created_at"
                        , PARSETIMESTAMP ( "xml_table.updated_at", 'yyyy-MM-dd''T''hh:mm:ssX' ) as "updated_at"
                        , PARSETIMESTAMP ( "xml_table.erased_at", 'yyyy-MM-dd''T''hh:mm:ssX' ) as "erased_at"
                        , "xml_table.size"
                        , "xml_table.url"
                        , "xml_table.file_name"
                        , "xml_table.content_type"
                        , "xml_table.total_entries"
                        , "xml_table.page"
                    FROM
                        ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                        , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//entries' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "id" INTEGER PATH 'id', "created_at" STRING PATH 'created_at', "updated_at" STRING PATH 'updated_at', "erased_at" STRING PATH 'erased_at', "size" STRING PATH 'size', "url" STRING PATH 'url', "file_name" STRING PATH 'file_name', "content_type" STRING PATH 'content_type', "total_entries" STRING PATH '../../total_entries', "page" STRING PATH '../../page' ) "xml_table" ;
            if ( PageNum = PagesCountLimit )
            BEGIN
                page_limit_exceeded = true ;
                PageNum = 1 ;
                DELETE
                    FROM
                        TabTmpMax ;
                EXECUTE IMMEDIATE 'INSERT INTO TabTmpMax SELECT max ( id ) FROM tbltmp' WITHOUT RETURN ;
                tmpMaxID = select
                        c
                    from
                        TabTmpMax ;
            end
            IF ( in_since_id IS NOT NULL )
            BEGIN
                if ( ( totalrecords2 - records_processed2 ) < PageSize ) PageSize = totalrecords2 - records_processed2 ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_case_attachments] Totalrecords from get_list_case_attachments are ' || totalrecords || '.
        Processed records are ' || records_processed2 ) ;
            end
            else
            BEGIN
                if ( totalrecords - cast ( cast ( records_processed as string ) as integer ) < PageSize ) PageSize = totalrecords - cast ( cast ( records_processed as string ) as integer ) ;
                records_processed = SELECT
                        count ( * )
                    FROM
                        tbltmp ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_case_attachments] Totalrecords from get_list_case_attachments are ' || totalrecords || '.
        Processed records are ' || records_processed ) ;
            end
            i = i + 1 ;
        end
        select
                *
            from
                tbltmp ;
    end
end


