-- Name: tableau.product_nocall_no_survey_info
-- Created: 2015-04-30 15:49:31
-- Updated: 2015-05-18 09:54:32

CREATE VIEW tableau.product_nocall_no_survey_info
AS

SELECT 
	co.order_id,
    co.customer_id,
    co.sales_channel,
	co.date_created,
	co.order_state,
	co.order_state_number,
	cu.date_created as customer_date_created,
	co.shipping_country,
	co.order_type,
	co.kept_state,
	co.articles_sent,
	co.articles_kept,
	co.articles_returned,
	cast(cu.additional_info as string) as additional_info,
	/*snowplow successpage*/
	ns.collector_tstamp,
	ns.user_id,
	ns.page_url,
	ns.page_urlpath,
	ns.refr_urlquery,
	substring(page_urlpath,locate('/success',page_urlpath)+1,length(page_urlpath)) as success_goal_shares,
	case when page_urlpath like '%sucess%' then 'success screen' else 'no success_screen' end as sucess_url,
	case when page_referrer like '%create%' then 'create_order'
	else null
	end page_referrer,
	mo.utm_keyword
	
FROM bi.customer_order co
LEFT JOIN bi.customer cu on co.customer_id=cu.customer_id
LEFT JOIN sandbox.snowplow_nocall_success ns on ns.tr_orderid=co.order_id
LEFT JOIN views.marketing_order mo on mo.order_id=co.order_id
WHERE cast(co.date_created as date)>='2015-04-01'
AND co.sales_channel in ('websiteWithoutDate','websiteWithoutDateAndPendingConfirmation')
AND cu.additional_info NOT LIKE '{limited-look%'


