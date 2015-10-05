-- Name: views.preview_data
-- Created: 2015-04-24 18:17:11
-- Updated: 2015-04-24 18:17:11

CREATE view views.preview_data
as
select
p.preview_id as parent_preview_id,
p.id as preview_id,
p.customer_id as customer_id,
p.date_created as date_created,
p.last_updated as last_updated,
p.order_id as order_id,
p.state as state,
p.class as class,
p.created_by_id as created_by_id,
p.name as name,
pp.id as position_id,
pp.version as position_version,
pp.article_id as position_article_id,
pp.date_created as position_date_created,
pp.feedback_reason_id as position_feedback_reason_id,
pp.last_updated as position_last_updated,
pp.property_id as position_property_id,
pp.variant as position_variant,
pp.preview_positions_idx as position_preview_position_idx,
pp.group_id as position_group_id
from postgres.preview p 
inner join postgres.preview_position pp on pp.preview_id = p.id


