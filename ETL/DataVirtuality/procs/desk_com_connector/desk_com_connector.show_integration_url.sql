-- Name: desk_com_connector.show_integration_url
-- Created: 2015-08-10 15:23:28

CREATE virtual procedure desk_com_connector.show_integration_url (
    in in_url_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"name" string
    ,"rendered" string
    ,"created_at" string
    ,"updated_at" string
    ,"description" string
    ,"enabled" string
    ,"markup" string
    ,"open_location" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_url_id is null
        )
        or (
            in_url_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.name"
            ,"xml_table.rendered"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.description"
            ,"xml_table.enabled"
            ,"xml_table.markup"
            ,"xml_table.open_location"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'integration_urls/' || in_url_id
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
                ,"name" STRING PATH 'name'
                ,"rendered" STRING PATH 'rendered'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"description" STRING PATH 'description'
                ,"enabled" STRING PATH 'enabled'
                ,"markup" STRING PATH 'markup'
                ,"open_location" STRING PATH 'open_location'
            ) "xml_table" ;
end


