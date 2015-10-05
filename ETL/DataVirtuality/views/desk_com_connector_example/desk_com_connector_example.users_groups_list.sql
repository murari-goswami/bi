-- Name: desk_com_connector_example.users_groups_list
-- Created: 2015-08-10 15:24:27
-- Updated: 2015-08-10 15:24:27

create view desk_com_connector_example.users_groups_list as select
        gro."id" as groupid
        , gro."name" as groupname
        , usr."id" as usrid
        , usr."name" as usrname
        , usr."email" as usremail
        , usr."created_at" as usrcreated_at
        , usr."updated_at" as usrupdated_at
        , usr."current_login_at" as usrcurrent_login_at
        , usr."last_login_at" as usrlast_login_at
        , usr."level" as usrlevel
        , usr."email_verified" as usremail_verified
        , usr."public_name" as usrpublic_name
        , usr."avatar" as usravatar
        , usr."available" as usravailable
    from
        table ( call "desk_com_connector.get_list_groups" ( ) ) as gro
        , table ( call "desk_com_connector.get_list_group_users" ( "in_group_id" => gro."id" ) ) as usr


