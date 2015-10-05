-- Name: desk_com_connector_example.groups_overview_report
-- Created: 2015-08-10 15:24:29
-- Updated: 2015-08-10 15:24:29

CREATE view "desk_com_connector_example"."groups_overview_report" as select
        rr.groupname
        , rr.cont_created
        , rr.cont_resolved
        , ss2.Time_from_seconds_int as avg_frst_resolved
        , ss3.Time_from_seconds_int as avg_resolved
        , ss4.Time_from_seconds_int as avg_handletime
        , rr.FCR_RATE_proc
    from
        table ( select
                g.groupname
                , sum ( g.cou_created ) as cont_created
                , sum ( g.cou_resolved ) as cont_resolved
                , avg ( g.timedifffrstresolve ) as avg_timedifffrstresolve
                , avg ( g.timediffresolve ) as avg_timediffresolve
                , avg ( g.handletime ) / sum ( g.cou_created ) as avg_handletime
                , round ( ( cast ( sum ( g.cou_resolved ) as double ) / cast ( sum ( g.cou_created ) as double ) * 100 ), 2 ) as FCR_RATE_proc
            from
                table ( SELECT
                        gl."groupname"
                        , count ( dwhcase4.created_at ) as cou_created
                        , count ( dwhcase4.resolved_at ) as cou_resolved
                        , timestampdiff ( SQL_TSI_SECOND, dwhcase4."created_at", nvl ( dwhcase4."first_resolved_at", dwhcase4."created_at" ) ) as timedifffrstresolve
                        , timestampdiff ( SQL_TSI_SECOND, dwhcase4."created_at", nvl ( dwhcase4."resolved_at", dwhcase4."created_at" ) ) as timediffresolve
                        , timestampdiff ( SQL_TSI_SECOND, nvl ( dwhcase4."received_at", dwhcase4."created_at" ), nvl ( dwhcase4."first_resolved_at", dwhcase4."created_at" ) ) as handletime
                    FROM
                        "desk_com_connector_example.example_list_cases4" as dwhcase4
                        , "desk_com_connector_example.users_groups_list" as gl
                    where
                        gl."usrid" = dwhcase4."userid"
                    group by
                        gl."groupname"
                        , dwhcase4."created_at"
                        , dwhcase4.first_resolved_at
                        , dwhcase4.resolved_at
                        , dwhcase4.received_at ) as g
            group by
                g.groupname ) as rr, table ( call "desk_com_connector.internal_integer_to_Time2" ( "in_seconds" => cast ( rr.avg_timedifffrstresolve as integer ) ) ) ss2, table ( call "desk_com_connector.internal_integer_to_Time2" ( "in_seconds" => cast ( rr.avg_timediffresolve as integer ) ) ) ss3, table ( call "desk_com_connector.internal_integer_to_Time2" ( "in_seconds" => cast ( rr.avg_handletime as integer ) ) ) ss4
    order by
        rr.groupname asc


