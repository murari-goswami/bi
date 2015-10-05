-- Name: desk_com_connector.show_case_note
-- Created: 2015-08-10 15:23:52

CREATE virtual procedure desk_com_connector.show_case_note (
    in in_case_id string
    ,in in_note_id string    
) RETURNS (
	"id" string
    ,"body" string
    ,"created_at" string
    ,"updated_at" string
    ,"erased_at" string
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
            in_note_id is null
        )
        or (
            in_note_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;    
    declare integer totalrecords ;
    declare double pagescount ;
    declare double mod_val ;
    declare integer i = 1 ;
    declare integer querrycount ;
    declare integer CurrentPage = 1 ;
    declare integer PageSize = 100 ;
    declare string endpointstring = 'cases/' || in_case_id || '/notes/' || in_note_id || '?page=' || CurrentPage || '&per_page=' || PageSize ;
    totalrecords = SELECT
            "xml_table.total_entries"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'cases/' || in_case_id || '/notes/' || in_note_id
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
                ) COLUMNS "total_entries" INTEGER PATH 'total_entries'
            ) "xml_table" ;
    if (
        totalrecords > 0
    )
    begin
        pagescount = cast (
            totalrecords as double
        ) / PageSize ;
        mod_val = pagescount - floor (pagescount) ;
        if (
            mod_val < 0.5
        )
        begin
            querrycount = round (
                cast (
                    pagescount as integer
                )
                ,0
            ) + 1 ;
        end
        else
        begin
            querrycount = round (
                cast (
                    pagescount as integer
                )
                ,0
            ) ;
        end
        CREATE LOCAL TEMPORARY TABLE tbltmp (
            "id" string
            ,"body" string
            ,"created_at" string
            ,"updated_at" string
            ,"erased_at" string
        ) ;
        while (
            i <= querrycount
        )
        begin
            endpointstring = 'cases/' || in_case_id || '/notes/' || in_note_id || '?page=' || i || '&per_page=' || PageSize ;
            INSERT
                INTO tbltmp SELECT
                        "xml_table.id"
                        ,"xml_table.body"
                        ,"xml_table.created_at"
                        ,"xml_table.updated_at"
                        ,"xml_table.erased_at"
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
                            ) COLUMNS 
                            "id" STRING PATH 'id'
                            ,"body" STRING PATH 'body'
                            ,"created_at" STRING PATH 'created_at'
                            ,"updated_at" STRING PATH 'updated_at'
                            ,"erased_at" STRING PATH 'erased_at'
                        ) "xml_table" ;
            i = i + 1 ;
        end
        select
                *
            from
                tbltmp ;
    end
end


