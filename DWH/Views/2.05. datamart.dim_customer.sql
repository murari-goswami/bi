CREATE OR REPLACE VIEW datamart.dim_customer
AS

SELECT
	
	a.customer_id,
	c.first_sales_channel as acquisition_channel, /*first saleschannel of customer*/

	/*CASE
		WHEN d.cluster='CLUB' THEN 'Club' 
		WHEN d.cluster='AC' THEN 'Loyal'
		WHEN d.cluster IN ('NOCALL0','CALL0') THEN 'New'
		WHEN d.cluster IN ('CLIM','NCLIM') THEN 'Young'
		WHEN d.cluster='P6' THEN 'Passive'
		WHEN d.cluster='P12' THEN 'Inactive'
	END*/'New' as customer_segment,
	a.date_created as date_account_created,
	
	extract(year from age(cast(a.date_of_birth as date),current_date)) as customer_age,
	c.status_last_case,

	CASE
		WHEN a.phone_number IS NOT NULL THEN 'True'
		ELSE 'False'
	END AS has_phone_number,
	
	CASE 
		WHEN a.email IS NOT NULL THEN 'True'
		ELSE 'False'
	END AS has_email,
	
	CASE 
		WHEN a.providerid='facebook' THEN 'True'
		ELSE 'False'
	END AS has_facebook,
	
	CASE 
		WHEN a.providerid='linkedin' THEN 'True'
		ELSE 'False'
	END AS has_linkedin,
	
	CASE 
		WHEN a.providerid='xing' THEN 'True'
		ELSE 'False'
	END AS has_xing,

	CASE 
		WHEN club_member = True THEN 'True'
		ELSE 'False'
	END AS is_club_customer,

	a.domain_page,
	a.user_type,
	c.nb_orders,
	c.nb_cases

FROM stage.v_dim_customer a
LEFT JOIN
( 
	SELECT
		b.customer_id,
		COUNT(DISTINCT b.opportunity_id) as nb_orders,
		COUNT(DISTINCT b.case_no) as nb_cases,
		MIN(CASE WHEN b.rank_first=1 THEN b.sales_channel ELSE NULL END) as first_sales_channel,
		MIN(CASE WHEN b.rank_first=1 THEN b.date_opportunity_created ELSE NULL END) as first_date_opportunity_created,
		MIN(CASE WHEN b.rank_first=2 THEN b.date_opportunity_created ELSE NULL END) as second_date_opportunity_created,
		MIN(CASE WHEN b.rank_last=1 THEN b.date_opportunity_created ELSE NULL END) as last_date_opportunity_created,
		MIN(CASE WHEN b.rank_last=1 THEN b.case_status ELSE NULL END) as status_last_case
	FROM 
	(	
		SELECT
			row_number() over(partition by op.customer_id order by op.date_opportunity_created) as rank_first,
			row_number() over(partition by op.customer_id order by op.date_opportunity_created DESC) as rank_last,
			op.opportunity_id,
			op.customer_id,
			ca.case_no,
			ca.case_status,
			co_1.sales_channel,
			co.parent_order_id,
			op.date_opportunity_created,
			co.date_order_created
		FROM datamart.dim_opportunity op
		LEFT JOIN stage.v_dim_customer_order co_1 on co_1.order_id=op.opportunity_id
		LEFT JOIN datamart.dim_order co on co.order_id=op.opportunity_id
		LEFT JOIN datamart.dim_case ca on ca.case_id=op.opportunity_id
	)b
	GROUP BY b.customer_id
)c on c.customer_id=a.customer_id
--LEFT JOIN stage.customer_cluster d ON a.customer_id=d.customer_id