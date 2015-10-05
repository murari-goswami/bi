-- Name: desk_com_connector.get_list_customers
-- Created: 2015-08-10 15:23:37

CREATE virtual procedure desk_com_connector.get_list_customers ( IN in_since_id integer ) RETURNS ( "id" integer, "first_name" string, "last_name" string, "company" string, "title" string, "external_id" string, "locked_until" string, "created_at" timestamp, "updated_at" timestamp, "background" string, "language" string, "access_private_portal" string, "access_company_cases" string, "avatar" string, "uid" string, "custom_fields" string, "email_type" string, "email_value" string, "phone_type" string, "phone_value" string, "addresses_type" string, "addresses_value" string, "total_entries" string, "page" string, "locked_by" string, "company_id" string, "facebook_user" string, "twitter_user_id" string, "cases_href" string, "cases_count" integer ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
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
    declare string endpointstring = 'customers?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' ;
    declare string internal_since_id = 0 ;
    declare string internal_since___id = 0 ;
    DECLARE integer tmpMaxID = null ;
    CREATE LOCAL TEMPORARY TABLE TabTmpMax ( c integer ) ;
    CREATE LOCAL TEMPORARY TABLE tmpTable ( "id" integer, "first_name" string, "last_name" string, "company" string, "title" string, "external_id" string, "locked_until" string, "created_at" timestamp, "updated_at" timestamp, "background" string, "language" string, "access_private_portal" string, "access_company_cases" string, "avatar" string, "uid" string, "custom_fields" string, "email_type" string, "email_value" string, "phone_type" string, "phone_value" string, "addresses_type" string, "addresses_value" string, "total_entries" string, "page" string, "locked_by" string, "company_id" string, "facebook_user" string, "twitter_user_id" string, "cases_href" string, "cases_count" integer ) ;
    totalrecords = SELECT
            "xml_table.total_entries"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => 'customers?sort_field=created_at&sort_direction=asc&since_id=' || internal_since___id ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ;
    IF ( in_since_id IS NOT NULL )
    BEGIN
        internal_since_id = '&since_id=' || in_since_id ;
        endpointstring = 'customers?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
    END
    else internal_since_id = '&since_id=' || 0 ;
    if ( totalrecords > 0 )
    begin
        pagescount = cast ( totalrecords as double ) / PageSize ;
        mod_val = pagescount - floor ( pagescount ) ;
        querrycount = round ( cast ( pagescount as integer ), 0 ) + 1 ;
        exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_customers] Max Pages to get: ' || querrycount ) ;
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
                endpointstring = 'customers?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
                PageNum = PageNum + 1 ;
            END
            else
            begin
                if ( tmpMaxID is null )
                begin
                    endpointstring = 'customers?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
                end
                else
                begin
                    endpointstring = 'customers?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc&since_id=' || tmpMaxID ;
                end
                PageNum = PageNum + 1 ;
            end
            exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_customers] Executing "' || endpointstring || '"' ) ;
            INSERT
                INTO tmpTable SELECT
                        "xml_table.id"
                        , "xml_table.first_name"
                        , "xml_table.last_name"
                        , "xml_table.company"
                        , "xml_table.title"
                        , "xml_table.external_id"
                        , "xml_table.locked_until"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.created_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "created_at"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.updated_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "updated_at"
                        , "xml_table.background"
                        , "xml_table.language"
                        , "xml_table.access_private_portal"
                        , "xml_table.access_company_cases"
                        , "xml_table.avatar"
                        , "xml_table.uid"
                        , "xml_table.custom_fields"
                        , "xml_table.email_type"
                        , "xml_table.email_value"
                        , "xml_table.phone_type"
                        , "xml_table.phone_value"
                        , "xml_table.addresses_type"
                        , "xml_table.addresses_value"
                        , "xml_table.total_entries"
                        , "xml_table.page"
                        , "xml_table.locked_by"
                        , nvl ( substring ( "xml_table.company_id", 19 ), 0 ) as company_id
                        , "xml_table.facebook_user"
                        , nvl ( substring ( "xml_table.twitter_user_id", 23 ), 0 ) as twitter_user_id
                        , "xml_table.cases_href"
                        , "xml_table.cases_count"
                    FROM
                        ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                        , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//entries' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "id" INTEGER PATH 'id', "first_name" STRING PATH 'first_name', "last_name" STRING PATH 'last_name', "company" STRING PATH 'company', "title" STRING PATH 'title', "external_id" STRING PATH 'external_id', "locked_until" STRING PATH 'locked_until', "created_at" STRING PATH 'created_at', "updated_at" STRING PATH 'updated_at', "background" STRING PATH 'background', "language" STRING PATH 'language', "access_private_portal" STRING PATH 'access_private_portal', "access_company_cases" STRING PATH 'access_company_cases', "avatar" STRING PATH 'avatar', "uid" STRING PATH 'uid', "custom_fields" STRING PATH 'custom_fields', "email_type" STRING PATH 'string-join(emails/type/text(),'', '')', "email_value" STRING PATH 'string-join(emails/value/text(),'', '')', "phone_type" STRING PATH 'string-join(phone_numbers/type/text(),'', '')', "phone_value" STRING PATH 'string-join(phone_numbers/value/text(),'', '')', "addresses_type" STRING PATH 'string-join(addresses/type/text(),'', '')', "addresses_value" STRING PATH 'string-join(addresses/value/text(),'', '')', "total_entries" STRING PATH '../../total_entries', "page" STRING PATH '../../page', "locked_by" STRING PATH '_links/locked_by', "company_id" STRING PATH '_links/company/href', "facebook_user" STRING PATH '_links/facebook_user', "twitter_user_id" STRING PATH '_links/twitter_user/href', "cases_href" STRING PATH '_links/cases/href', "cases_count" integer PATH '_links/cases/count' ) "xml_table" ;
            if ( PageNum = PagesCountLimit )
            BEGIN
                page_limit_exceeded = true ;
                PageNum = 1 ;
                DELETE
                    FROM
                        TabTmpMax ;
                EXECUTE IMMEDIATE 'INSERT INTO TabTmpMax SELECT max ( id ) FROM tmpTable;' WITHOUT RETURN ;
                tmpMaxID = select
                        c
                    from
                        TabTmpMax ;
            END
            IF ( in_since_id IS NOT NULL )
            BEGIN
                if ( ( totalrecords2 - records_processed2 ) < PageSize ) PageSize = totalrecords2 - records_processed2 ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_customers] Totalrecords from get_list_customers are ' || totalrecords || '.
        Processed records are ' || records_processed2 ) ;
            end
            else
            BEGIN
                if ( totalrecords - cast ( cast ( records_processed as string ) as integer ) < PageSize ) PageSize = totalrecords - cast ( cast ( records_processed as string ) as integer ) ;
                records_processed = SELECT
                        count ( * )
                    FROM
                        tmpTable ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_customers] Totalrecords from get_list_customers are ' || totalrecords || '.
        Processed records are ' || records_processed ) ;
            end
            i = i + 1 ;
        end
    end
    SELECT
            *
        FROM
            tmpTable ;
end


