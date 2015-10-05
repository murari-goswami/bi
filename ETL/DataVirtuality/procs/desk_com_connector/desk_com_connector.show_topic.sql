-- Name: desk_com_connector.show_topic
-- Created: 2015-08-10 15:23:33

CREATE virtual procedure desk_com_connector.show_topic (
    in in_topic_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"position" string
    ,"allow_questions" string
    ,"created_at" string
    ,"updated_at" string
    ,"description" string
    ,"in_support_center" string
    ,"name" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.position"
            ,"xml_table.allow_questions"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.description"
            ,"xml_table.in_support_center"
            ,"xml_table.name"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'topics/' || in_topic_id
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
                ,"position" STRING PATH 'position'
                ,"allow_questions" STRING PATH 'allow_questions'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"description" STRING PATH 'description'
                ,"in_support_center" STRING PATH 'in_support_center'
                ,"name" STRING PATH 'name'
            ) "xml_table" ;
end


