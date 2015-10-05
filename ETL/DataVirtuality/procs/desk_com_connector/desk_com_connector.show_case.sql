-- Name: desk_com_connector.show_case
-- Created: 2015-08-10 15:23:19

CREATE virtual procedure desk_com_connector.show_case (
    in in_case_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"blurb" string
    ,"priority" string
    ,"locked_until" string
    ,"label_ids" string
    ,"active_at" string
    ,"changed_at" string
    ,"created_at" string
    ,"updated_at" string
    ,"first_opened_at" string
    ,"opened_at" string
    ,"first_resolved_at" string
    ,"resolved_at" string
    ,"status" string
    ,"active_notes_count" string
    ,"active_attachments_count" string
    ,"has_pending_interactions" string
    ,"has_failed_interactions" string
    ,"description" string
    ,"language" string
    ,"received_at" string
    ,"type" string
    ,"labels" string
    ,"subject" string
    ,"custom_fields" string
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
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.blurb"
            ,"xml_table.priority"
            ,"xml_table.locked_until"
            ,"xml_table.label_ids"
            ,"xml_table.active_at"
            ,"xml_table.changed_at"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.first_opened_at"
            ,"xml_table.opened_at"
            ,"xml_table.first_resolved_at"
            ,"xml_table.resolved_at"
            ,"xml_table.status"
            ,"xml_table.active_notes_count"
            ,"xml_table.active_attachments_count"
            ,"xml_table.has_pending_interactions"
            ,"xml_table.has_failed_interactions"
            ,"xml_table.description"
            ,"xml_table.language"
            ,"xml_table.received_at"
            ,"xml_table.type"
            ,"xml_table.labels"
            ,"xml_table.subject"
            ,"xml_table.custom_fields"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'cases/' || in_case_id
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
                ,"blurb" STRING PATH 'blurb'
                ,"priority" STRING PATH 'priority'
                ,"locked_until" STRING PATH 'locked_until'
                ,"label_ids" STRING PATH 'label_ids'
                ,"active_at" STRING PATH 'active_at'
                ,"changed_at" STRING PATH 'changed_at'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"first_opened_at" STRING PATH 'first_opened_at'
                ,"opened_at" STRING PATH 'opened_at'
                ,"first_resolved_at" STRING PATH 'first_resolved_at'
                ,"resolved_at" STRING PATH 'resolved_at'
                ,"status" STRING PATH 'status'
                ,"active_notes_count" STRING PATH 'active_notes_count'
                ,"active_attachments_count" STRING PATH 'active_attachments_count'
                ,"has_pending_interactions" STRING PATH 'has_pending_interactions'
                ,"has_failed_interactions" STRING PATH 'has_failed_interactions'
                ,"description" STRING PATH 'description'
                ,"language" STRING PATH 'language'
                ,"received_at" STRING PATH 'received_at'
                ,"type" STRING PATH 'type'
                ,"labels" STRING PATH 'labels'
                ,"subject" STRING PATH 'subject'
                ,"custom_fields" STRING PATH 'custom_fields'
            ) "xml_table" ;
end


