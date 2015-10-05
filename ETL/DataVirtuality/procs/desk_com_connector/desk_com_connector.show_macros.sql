-- Name: desk_com_connector.show_macros
-- Created: 2015-08-10 15:23:30

CREATE virtual procedure desk_com_connector.show_macros (
	in in_macros_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"name" string
    ,"description" string
    ,"position" string
    ,"enabled" string
    ,"folders" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.name"
            ,"xml_table.description"
            ,"xml_table.position"
            ,"xml_table.enabled"
            ,"xml_table.folders"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'macros/'||in_macros_id
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
                ,"name" STRING PATH 'name'
                ,"id" STRING PATH 'id'
                ,"description" STRING PATH 'description'
                ,"position" STRING PATH 'position'
                ,"enabled" STRING PATH 'enabled'
                ,"folders" STRING PATH 'string-join(folders/text(),'', '')'
            ) "xml_table" ;
end


