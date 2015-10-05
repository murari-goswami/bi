-- Name: desk_com_connector.cases_dwh_update
-- Created: 2015-08-10 15:24:26

CREATE virtual procedure desk_com_connector.cases_dwh_update ( IN dwh_table string ) RETURNS ( "id" integer, "blurb" string, "priority" string, "locked_until" string, "label_ids" string, "active_at" timestamp, "changed_at" timestamp, "created_at" timestamp, "updated_at" timestamp, "first_opened_at" timestamp, "opened_at" timestamp, "first_resolved_at" timestamp, "resolved_at" timestamp, "status" string, "active_notes_count" string, "active_attachments_count" string, "has_pending_interactions" string, "has_failed_interactions" string, "description" string, "language" string, "received_at" timestamp, "type" string, "labels" string, "subject" string, "custom_fields" string, "message_href" string, "customerid" string, "labels_href" string, "userid" string, "assigned_group" string, "locked_by" string, "history_href" string, "case_links_href" string, "macro_preview_href" string, "replies_href" string, "replies__count" integer, "notes_href" string, "notes_count" integer, "attachements_href" string, "attachements_count" integer ) as
begin
    DECLARE string VARIABLES.dwh_schema = ( select
            nameindv
        from
            ( exec getCurrentDWH ( ) ) a ) ;
    IF ( VARIABLES.dwh_schema IS NULL )
    BEGIN
        ERROR 'DWH schema name cannot be NULL' ;
    END
    DECLARE string VARIABLES.vdb_name = 'datavirtuality' ;
    IF ( NOT EXISTS ( select
            *
        from
            SYS.Tables t
        where
            LCASE ( t.VDBName ) = LCASE ( VARIABLES.vdb_name )
            and LCASE ( t.schemaName ) = LCASE ( VARIABLES.dwh_schema )
            and LCASE ( ( t.schemaName || '.' || t.name ) ) = LCASE ( replace ( dwh_table, '"', '' ) ) ) )
    BEGIN
        error '
        		Please, first execute primary downloading cases procedure to DWH, and set table name equal to parameter dwh_table. ' ;
    END
    DECLARE integer tmpMaxID = null ;
    CREATE LOCAL TEMPORARY TABLE TabTmpMaxID ( c integer ) ;
    EXECUTE IMMEDIATE 'INSERT INTO TabTmpMaxID SELECT max ( id ) FROM ' || dwh_table WITHOUT RETURN ;
    tmpMaxID = select
            c
        from
            TabTmpMaxID ;
    call "desk_com_connector.get_list_cases" ( "in_since_id" => tmpMaxID, "dwh_table" => dwh_table ) WITHOUT RETURN ;
    execute immediate 'select * from ' || dwh_table as "id" integer
    , "blurb" string
    , "priority" string
    , "locked_until" string
    , "label_ids" string
    , "active_at" timestamp
    , "changed_at" timestamp
    , "created_at" timestamp
    , "updated_at" timestamp
    , "first_opened_at" timestamp
    , "opened_at" timestamp
    , "first_resolved_at" timestamp
    , "resolved_at" timestamp
    , "status" string
    , "active_notes_count" string
    , "active_attachments_count" string
    , "has_pending_interactions" string
    , "has_failed_interactions" string
    , "description" string
    , "language" string
    , "received_at" timestamp
    , "type" string
    , "labels" string
    , "subject" string
    , "custom_fields" string
    , "message_href" string
    , "customerid" string
    , "labels_href" string
    , "userid" string
    , "assigned_group" string
    , "locked_by" string
    , "history_href" string
    , "case_links_href" string
    , "macro_preview_href" string
    , "replies_href" string
    , "replies__count" integer
    , "notes_href" string
    , "notes_count" integer
    , "attachements_href" string
    , "attachements_count" integer ;
end


