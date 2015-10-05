-- Name: views.marketing_apptracking
-- Created: 2015-04-24 18:24:33
-- Updated: 2015-04-24 18:24:33

CREATE view views.marketing_apptracking
AS
SELECT 
	app.order_id,
	app.customer_id,
	app.country,
	app.campaign,
	app.trackingname,
	app.date_created,
	app.marketing_channel,
	app.first_channel,
	app.nb_of_installs,
	cc.costs
FROM
(
	SELECT 
		app.order_id,
		app.customer_id,
		app.country,
		app.network as campaign,
		app.trackingname,
		app.date_created,
		CASE 
			WHEN app.marketing_channel IS NULL and app.network='Organic' THEN 'app organic'
			WHEN app.marketing_channel IS NULL then 'app download campaign'
			ELSE app.marketing_channel
		END AS marketing_channel,
		app.first_channel,
	    app.nb_of_installs
	FROM
	(
		SELECT 
			ap.order_id,
			ac.customer_id,
			ac.network,
			ac.trackingname,
			cast(co.date_created AS date) AS date_created,
			mo.marketing_channel,
			mc.first_channel,
	    	app_installs.nb_of_installs,
	    	co.shipping_country as country,
			row_number() over (partition by ac.customer_id order by co.date_created desc) AS rank
		FROM dwh.apptracking ap
		LEFT JOIN dwh.apptracking_customer ac ON ac.customer_id=ap.customer_id
		LEFT JOIN views.customer_order co ON co.id=ap.order_id
		LEFT JOIN 
		(
			select
				case
				    when ga.transaction_id is null and tv.order_id is not null then tv.order_id
				    when ga.transaction_id is not null and tv.order_id is null then ga.transaction_id
				    when ga.transaction_id is not null and tv.order_id is not null then ga.transaction_id
				end as "order_id",
				case
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'affiliate'      then 'affiliate'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'crm'        then 'crm'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'display'      then 'display'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'facebook'       then 'facebook'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'google gdn'     then 'google gdn'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'kooperation'    then 'kooperation'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'praemienprogramm'   then 'praemienprogramm'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'remarketing'    then 'remarketing'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'twitter'      then 'twitter'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'youtube'      then 'youtube'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_3!=  'brand' then 'google sem nobrand'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_3= 'brand' then 'tv'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_1= 'bing' and ga.cam_bit_1= '0' then 'google sem nobrand'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_1= 'bing' and ga.cam_bit_1= '1' then 'tv'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'direct'       then 'tv'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'organic'      then 'tv'
				    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= '(not set)'      then 'tv'
				    when tv.order_id is not null and ga.cam_bit_1= 'rem'  then 'remarketing'
				    else '(not set)'
			 	end as "marketing_channel"
				from views.ga_information ga
				full join views.marketingtv tv on ga.transaction_id = tv.order_id
		) mo ON mo.order_id=co.id
		LEFT JOIN views.marketing_customer mc ON mc.customer_id=ap.customer_id
		LEFT JOIN
		(
			SELECT 
				network,
				upper(country) AS country,
				cast(date_created AS date) AS date_created,
				sum(installs) AS nb_of_installs
			FROM dwh.appdownloads
			GROUP BY 1,2,3
		)app_installs ON app_installs.network=ac.network and app_installs.date_created=cast(co.date_created AS date) and app_installs.country=co.shipping_country
		WHERE co.sales_channel in ('app','appWithDate','miniApp','miniAppWithDate')
	)app
	WHERE app.rank=1
)app
LEFT JOIN
(
	SELECT
		datecreated as date_created,
		LEFT(campaign,2) as country,
		campaign,
		sum(cast(costs as double)) as "costs"
	FROM "dwh.campaigncost" 
	GROUP BY 1,2,3
) cc on cc.date_created=app.date_created and cc.country=app.country and cc.campaign=app.campaign


