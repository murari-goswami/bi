-- Name: desk_com_connector_example.case_overview_report
-- Created: 2015-08-10 15:24:28
-- Updated: 2015-08-10 15:24:28

CREATE view "desk_com_connector_example"."case_overview_report" as select
        rr.date_created_at
        , rr.cont_created
        , rr.cont_resolved
        , ss2.Time_from_seconds_int as avg_frst_resolved
        , ss3.Time_from_seconds_int as avg_resolved
        , ss4.Time_from_seconds_int as avg_handletime
        , rr.FCR_RATE_proc
    from
        table ( select
                parsedate ( g.date_created_at, 'yyyy-MM-dd' ) as date_created_at
                , sum ( g.cou_created ) as cont_created
                , sum ( g.cou_resolved ) as cont_resolved
                , avg ( g.timedifffrstresolve ) as timedifffrstresolve
                , avg ( g.timediffresolve ) as timediffresolve
                , avg ( g.handletime ) / sum ( g.cou_created ) as handletime
                , round ( ( cast ( sum ( g.cou_resolved ) as double ) / cast ( sum ( g.cou_created ) as double ) * 100 ), 2 ) as FCR_RATE_proc
            from
                table ( SELECT
                        count ( created_at ) as cou_created
                        , count ( resolved_at ) as cou_resolved
                        , FORMATTIMESTAMP ( created_at, 'yyyy-MM-dd' ) as date_created_at
                        , timestampdiff ( SQL_TSI_SECOND, "created_at", nvl ( "first_resolved_at", "created_at" ) ) as timedifffrstresolve
                        , timestampdiff ( SQL_TSI_SECOND, "created_at", nvl ( "resolved_at", "created_at" ) ) as timediffresolve
                        , timestampdiff ( SQL_TSI_SECOND, nvl ( "received_at", "created_at" ), nvl ( "first_resolved_at", "created_at" ) ) as handletime
                    FROM
                        "desk_com_connector_example.example_list_cases4"
                    group by
                        created_at
                        , first_resolved_at
                        , resolved_at
                        , received_at ) as g
            group by
                g.date_created_at ) as rr, table ( call "desk_com_connector.internal_integer_to_Time2" ( "in_seconds" => cast ( rr.timedifffrstresolve as integer ) ) ) ss2, table ( call "desk_com_connector.internal_integer_to_Time2" ( "in_seconds" => cast ( rr.timediffresolve as integer ) ) ) ss3, table ( call "desk_com_connector.internal_integer_to_Time2" ( "in_seconds" => cast ( rr.handletime as integer ) ) ) ss4


