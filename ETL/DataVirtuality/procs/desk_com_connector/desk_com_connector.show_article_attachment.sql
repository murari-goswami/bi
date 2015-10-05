-- Name: desk_com_connector.show_article_attachment
-- Created: 2015-08-10 15:23:50

create virtual procedure desk_com_connector.show_article_attachment (
    in in_article_id string
    ,in in_attachment_id string
) RETURNS (
    "id" string
    ,"file_name" string
    ,"content_type" string
    ,"url" string
    ,"created_at" string
    ,"updated_at" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_article_id is null
        )
        or (
            in_article_id = ''
        )
        or (
            in_attachment_id is null
        )
        or (
            in_attachment_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'articles/' || in_article_id || '/attachemnts/' || in_attachment_id ;
    SELECT
            "xml_table.id"
            ,"xml_table.file_name"
            ,"xml_table.content_type"
            ,"xml_table.url"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
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
                ,"file_name" STRING PATH 'file_name'
                ,"content_type" STRING PATH 'content_type'
                ,"url" STRING PATH 'url'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
            ) "xml_table" ;
end


