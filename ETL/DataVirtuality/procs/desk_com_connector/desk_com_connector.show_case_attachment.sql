-- Name: desk_com_connector.show_case_attachment
-- Created: 2015-08-10 15:23:21

CREATE virtual procedure desk_com_connector.show_case_attachment (
    in in_case_id string
    ,in in_attachment_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"created_at" string
    ,"updated_at" string
    ,"erased_at" string
    ,"size" string
    ,"url" string
    ,"file_name" string
    ,"content_type" string
    ,"total_entries" string
    ,"page" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_case_id is null
        )
        or (
            in_case_id = ''
        )
        or (
            in_attachment_id is null
        )
        or (
            in_attachment_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.erased_at"
            ,"xml_table.size"
            ,"xml_table.url"
            ,"xml_table.file_name"
            ,"xml_table.content_type"
            ,"xml_table.total_entries"
            ,"xml_table.page"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'cases/' || in_case_id || '/attachments/' || in_attachment_id
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
                ) COLUMNS "idColumn" FOR ORDINALITY
                ,"id" STRING PATH 'id'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"erased_at" STRING PATH 'erased_at'
                ,"size" STRING PATH 'size'
                ,"url" STRING PATH 'url'
                ,"file_name" STRING PATH 'file_name'
                ,"content_type" STRING PATH 'content_type'
                ,"total_entries" STRING PATH '../../total_entries'
                ,"page" STRING PATH '../../page'
            ) "xml_table" ;
end


