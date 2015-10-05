-- Name: desk_com_connector.get_list_cases_facebook_likes
-- Created: 2015-08-10 15:23:53

create virtual procedure desk_com_connector.get_list_cases_facebook_likes (
    in in_case_id string
) RETURNS (
    "idColumn" integer
    ,"facebook_id" string
    ,"liked_by_page" string
    ,"like_count" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    declare string endpointstring = 'cases/' || in_case_id || '/message/likes' ;
    if (
        (
            in_case_id is null
        )
        or (
            in_case_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.facebook_id"
            ,"xml_table.liked_by_page"
            ,"xml_table.like_count"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => endpointstring
                )
            ) w
            ,XMLTABLE (
                XMLNAMESPACES (
                    'http://www.w3.org/2001/XMLSchema-instance' as "xsi"
                )
                ,'//entries' PASSING JSONTOXML (
                    'root'
                    ,to_chars (
                        w.result
                        ,'UTF-8'
                    )
                ) COLUMNS "idColumn" FOR ORDINALITY
                ,"facebook_id" STRING PATH 'facebook_id'
                ,"liked_by_page" STRING PATH 'liked_by_page'
                ,"like_count" STRING PATH 'like_count'
            ) "xml_table" ;
end


