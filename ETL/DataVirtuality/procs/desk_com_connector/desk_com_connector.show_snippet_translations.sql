-- Name: desk_com_connector.show_snippet_translations
-- Created: 2015-08-10 15:23:57

create virtual procedure desk_com_connector.show_snippet_translations (
    in in_snippet_id string
    ,in in_locale string
) RETURNS (
    "id" string
    ,"locale" string
    ,"text" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_snippet_id is null
        )
        or (
            in_snippet_id = ''
        )
        or (
            in_locale is null
        )
        or (
            in_locale = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'snippets/' || in_snippet_id || '/translations/' || in_locale ;
    SELECT
            "xml_table.id"
            ,"xml_table.locale"
            ,"xml_table.text"
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
                ,'//root' PASSING JSONTOXML (
                    'root'
                    ,to_chars (
                        w.result
                        ,'UTF-8'
                    )
                ) COLUMNS "id" STRING PATH 'id'
                ,"locale" STRING PATH 'locale'
                ,"text" STRING PATH 'text'
            ) "xml_table" ;
end


