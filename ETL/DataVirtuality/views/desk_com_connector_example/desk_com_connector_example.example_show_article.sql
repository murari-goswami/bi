-- Name: desk_com_connector_example.example_show_article
-- Created: 2015-08-10 15:24:01
-- Updated: 2015-08-10 15:24:01

CREATE view desk_com_connector_example.example_show_article as 
select * from (call "desk_com_connector.show_article"(
    "in_article_id" => '1947938')
)ss


