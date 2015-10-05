-- Name: desk_com_connector.show_customer
-- Created: 2015-08-10 15:23:23

CREATE virtual procedure desk_com_connector.show_customer (
    in in_customer_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"first_name" string
    ,"last_name" string
    ,"company" string
    ,"title" string
    ,"external_id" string
    ,"locked_until" string
    ,"created_at" string
    ,"updated_at" string
    ,"background" string
    ,"language" string
    ,"access_private_portal" string
    ,"access_company_cases" string
    ,"avatar" string
    ,"uid" string
    ,"custom_fields" string
    ,"email_type" string
    ,"email_value" string
    ,"phone_type" string
    ,"phone_value" string
    ,"addresses_type" string
    ,"addresses_value" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.first_name"
            ,"xml_table.last_name"
            ,"xml_table.company"
            ,"xml_table.title"
            ,"xml_table.external_id"
            ,"xml_table.locked_until"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.background"
            ,"xml_table.language"
            ,"xml_table.access_private_portal"
            ,"xml_table.access_company_cases"
            ,"xml_table.avatar"
            ,"xml_table.uid"
            ,"xml_table.custom_fields"
            ,"xml_table.email_type"
            ,"xml_table.email_value"
            ,"xml_table.phone_type"
            ,"xml_table.phone_value"
            ,"xml_table.addresses_type"
            ,"xml_table.addresses_value"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'customers/' || in_customer_id
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
                ,"first_name" STRING PATH 'first_name'
                ,"last_name" STRING PATH 'last_name'
                ,"company" STRING PATH 'company'
                ,"title" STRING PATH 'title'
                ,"external_id" STRING PATH 'external_id'
                ,"locked_until" STRING PATH 'locked_until'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"background" STRING PATH 'background'
                ,"language" STRING PATH 'language'
                ,"access_private_portal" STRING PATH 'access_private_portal'
                ,"access_company_cases" STRING PATH 'access_company_cases'
                ,"avatar" STRING PATH 'avatar'
                ,"uid" STRING PATH 'uid'
                ,"custom_fields" STRING PATH 'custom_fields'
                ,"email_type" STRING PATH 'string-join(emails/type/text(),'', '')'
                ,"email_value" STRING PATH 'string-join(emails/value/text(),'', '')'
                ,"phone_type" STRING PATH 'string-join(phone_numbers/type/text(),'', '')'
                ,"phone_value" STRING PATH 'string-join(phone_numbers/value/text(),'', '')'
                ,"addresses_type" STRING PATH 'string-join(addresses/type/text(),'', '')'
                ,"addresses_value" STRING PATH 'string-join(addresses/value/text(),'', '')'
            ) "xml_table" ;
end


