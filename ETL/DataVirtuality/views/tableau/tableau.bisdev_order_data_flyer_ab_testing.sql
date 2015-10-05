-- Name: tableau.bisdev_order_data_flyer_ab_testing
-- Created: 2015-05-05 10:11:14
-- Updated: 2015-05-05 10:13:10

CREATE VIEW tableau.bisdev_order_data_flyer_ab_testing
AS

SELECT 
co.order_id, 
co.date_created, 
co.shipping_country, 
co.box_type,
CASE
	WHEN co.order_type = 'First Order' THEN 'First Order'
	WHEN co.order_type in ('Repeat Order', 'Outfittery Club Order') THEN 'Repeat Order'
	WHEN co.order_type in ('First Order Follow-on', 'Repeat Order Follow-on') THEN 'Follow-on'
	ELSE 'Ask BI'
END as order_type
from bi.customer_order co
where cast(co.date_created as date) > '2014-10-01'


