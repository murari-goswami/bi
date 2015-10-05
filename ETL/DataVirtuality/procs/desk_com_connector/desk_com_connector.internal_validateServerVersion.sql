-- Name: desk_com_connector.internal_validateServerVersion
-- Created: 2015-08-10 15:23:14

create virtual procedure desk_com_connector.internal_validateServerVersion (
) as
begin
    declare integer server_build_min = 2976 ;
    declare integer server_interfaces_min = 4342 ;
    declare integer server_core_min = 4481 ;
    declare integer server_infrastructure_min = 1682 ;
    declare integer server_build_current ;
    declare integer server_interfaces_current ;
    declare integer server_core_current ;
    declare integer server_infrastructure_current ;
    server_build_current = select
            cast (
                substring (
                    b.build
                    ,1
                    ,4
                ) as integer
            )
        from
            (
                call "SYSADMIN.getServerVersion" ()) b ;
    server_interfaces_current = select
            cast (
                substring (
                    i.interfaces
                    ,1
                    ,4
                ) as integer
            )
        from
            (
                call "SYSADMIN.getServerVersion" ()) i ;
    server_core_current = select
            cast (
                substring (
                    c.core
                    ,1
                    ,4
                ) as integer
            )
        from
            (
                call "SYSADMIN.getServerVersion" ()) c ;
    server_infrastructure_current = select
            cast (
                substring (
                    infra.infrastructure
                    ,1
                    ,4
                ) as integer
            )
        from
            (
                call "SYSADMIN.getServerVersion" ()) infra ;
    if (
        (
            server_build_current < server_build_min
        )
        or (
            server_core_current < server_core_min
        )
        or (
            server_interfaces_current < server_interfaces_min
        )
        or (
            server_infrastructure_current < server_infrastructure_min
        )
    )
    begin
        error 'Please, for correct connector running upgrade server to: Server build : ' || server_build_min || ' ; Interfaces build: ' || server_interfaces_min || ' ; Core build: ' || server_core_min || ' ; Infrastructure build: ' || server_infrastructure_min || ' . Your current are:  Server build: ' || server_build_current || ' ; Interfaces build: ' || server_interfaces_current || ' ; Core build: ' || server_core_current || ' ; Infrastructure build: ' || server_infrastructure_current ;
    end
end


