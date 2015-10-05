-- Name: bi.marketing_funnel_by_date_domain_channel_device
-- Created: 2015-04-24 18:19:24
-- Updated: 2015-09-30 17:43:56

CREATE VIEW bi.marketing_funnel_by_date_domain_channel_device
AS

SELECT 
vi.date_created,
vi.domain,
vi.marketing_channel,
vi.devicecategory,
'Google Analytics' as data_source,
SUM(vi.visits) as visits,
CASE
	WHEN pro.goal_1 = 'RE_Survey' THEN COALESCE(go1.goal_1,0)
	WHEN pro.goal_2 = 'RE_Survey' THEN COALESCE(go1.goal_2,0)
	WHEN pro.goal_3 = 'RE_Survey' THEN COALESCE(go1.goal_3,0)
	WHEN pro.goal_4 = 'RE_Survey' THEN COALESCE(go1.goal_4,0)
	WHEN pro.goal_5 = 'RE_Survey' THEN COALESCE(go1.goal_5,0)
	WHEN pro.goal_6 = 'RE_Survey' THEN COALESCE(go1.goal_6,0)
	WHEN pro.goal_7 = 'RE_Survey' THEN COALESCE(go1.goal_7,0)
	WHEN pro.goal_8 = 'RE_Survey' THEN COALESCE(go1.goal_8,0)
	WHEN pro.goal_9 = 'RE_Survey' THEN COALESCE(go1.goal_9,0)
	WHEN pro.goal_10 = 'RE_Survey' THEN COALESCE(go1.goal_10,0)
	WHEN pro.goal_11 = 'RE_Survey' THEN COALESCE(go2.goal_11,0)
	WHEN pro.goal_12 = 'RE_Survey' THEN COALESCE(go2.goal_12,0)
	WHEN pro.goal_13 = 'RE_Survey' THEN COALESCE(go2.goal_13,0)
	WHEN pro.goal_14 = 'RE_Survey' THEN COALESCE(go2.goal_14,0)
	WHEN pro.goal_15 = 'RE_Survey' THEN COALESCE(go2.goal_15,0)
	WHEN pro.goal_16 = 'RE_Survey' THEN COALESCE(go2.goal_16,0)
	WHEN pro.goal_17 = 'RE_Survey' THEN COALESCE(go2.goal_17,0)
	WHEN pro.goal_18 = 'RE_Survey' THEN COALESCE(go2.goal_18,0)
	WHEN pro.goal_19 = 'RE_Survey' THEN COALESCE(go2.goal_19,0)
	WHEN pro.goal_20 = 'RE_Survey' THEN COALESCE(go2.goal_20,0)
END as started_survey,
CASE
	WHEN pro.goal_1 = 'RE_AccountCreation1' THEN COALESCE(go1.goal_1,0)
	WHEN pro.goal_2 = 'RE_AccountCreation1' THEN COALESCE(go1.goal_2,0)
	WHEN pro.goal_3 = 'RE_AccountCreation1' THEN COALESCE(go1.goal_3,0)
	WHEN pro.goal_4 = 'RE_AccountCreation1' THEN COALESCE(go1.goal_4,0)
	WHEN pro.goal_5 = 'RE_AccountCreation1' THEN COALESCE(go1.goal_5,0)
	WHEN pro.goal_6 = 'RE_AccountCreation1' THEN COALESCE(go1.goal_6,0)
	WHEN pro.goal_7 = 'RE_AccountCreation1' THEN COALESCE(go1.goal_7,0)
	WHEN pro.goal_8 = 'RE_AccountCreation1' THEN COALESCE(go1.goal_8,0)
	WHEN pro.goal_9 = 'RE_AccountCreation1' THEN COALESCE(go1.goal_9,0)
	WHEN pro.goal_10 = 'RE_AccountCreation1' THEN COALESCE(go1.goal_10,0)
	WHEN pro.goal_11 = 'RE_AccountCreation1' THEN COALESCE(go2.goal_11,0)
	WHEN pro.goal_12 = 'RE_AccountCreation1' THEN COALESCE(go2.goal_12,0)
	WHEN pro.goal_13 = 'RE_AccountCreation1' THEN COALESCE(go2.goal_13,0)
	WHEN pro.goal_14 = 'RE_AccountCreation1' THEN COALESCE(go2.goal_14,0)
	WHEN pro.goal_15 = 'RE_AccountCreation1' THEN COALESCE(go2.goal_15,0)
	WHEN pro.goal_16 = 'RE_AccountCreation1' THEN COALESCE(go2.goal_16,0)
	WHEN pro.goal_17 = 'RE_AccountCreation1' THEN COALESCE(go2.goal_17,0)
	WHEN pro.goal_18 = 'RE_AccountCreation1' THEN COALESCE(go2.goal_18,0)
	WHEN pro.goal_19 = 'RE_AccountCreation1' THEN COALESCE(go2.goal_19,0)
	WHEN pro.goal_20 = 'RE_AccountCreation1' THEN COALESCE(go2.goal_20,0)
END as completed_survey,
CASE
	WHEN pro.goal_1 = 'RE_ProfileCreation' THEN COALESCE(go1.goal_1,0)
	WHEN pro.goal_2 = 'RE_ProfileCreation' THEN COALESCE(go1.goal_2,0)
	WHEN pro.goal_3 = 'RE_ProfileCreation' THEN COALESCE(go1.goal_3,0)
	WHEN pro.goal_4 = 'RE_ProfileCreation' THEN COALESCE(go1.goal_4,0)
	WHEN pro.goal_5 = 'RE_ProfileCreation' THEN COALESCE(go1.goal_5,0)
	WHEN pro.goal_6 = 'RE_ProfileCreation' THEN COALESCE(go1.goal_6,0)
	WHEN pro.goal_7 = 'RE_ProfileCreation' THEN COALESCE(go1.goal_7,0)
	WHEN pro.goal_8 = 'RE_ProfileCreation' THEN COALESCE(go1.goal_8,0)
	WHEN pro.goal_9 = 'RE_ProfileCreation' THEN COALESCE(go1.goal_9,0)
	WHEN pro.goal_10 = 'RE_ProfileCreation' THEN COALESCE(go1.goal_10,0)
	WHEN pro.goal_11 = 'RE_ProfileCreation' THEN COALESCE(go2.goal_11,0)
	WHEN pro.goal_12 = 'RE_ProfileCreation' THEN COALESCE(go2.goal_12,0)
	WHEN pro.goal_13 = 'RE_ProfileCreation' THEN COALESCE(go2.goal_13,0)
	WHEN pro.goal_14 = 'RE_ProfileCreation' THEN COALESCE(go2.goal_14,0)
	WHEN pro.goal_15 = 'RE_ProfileCreation' THEN COALESCE(go2.goal_15,0)
	WHEN pro.goal_16 = 'RE_ProfileCreation' THEN COALESCE(go2.goal_16,0)
	WHEN pro.goal_17 = 'RE_ProfileCreation' THEN COALESCE(go2.goal_17,0)
	WHEN pro.goal_18 = 'RE_ProfileCreation' THEN COALESCE(go2.goal_18,0)
	WHEN pro.goal_19 = 'RE_ProfileCreation' THEN COALESCE(go2.goal_19,0)
	WHEN pro.goal_20 = 'RE_ProfileCreation' THEN COALESCE(go2.goal_20,0)
END as account_created,
CASE
	WHEN pro.goal_1 = 'RE_OrderCreation' THEN COALESCE(go1.goal_1,0)
	WHEN pro.goal_2 = 'RE_OrderCreation' THEN COALESCE(go1.goal_2,0)
	WHEN pro.goal_3 = 'RE_OrderCreation' THEN COALESCE(go1.goal_3,0)
	WHEN pro.goal_4 = 'RE_OrderCreation' THEN COALESCE(go1.goal_4,0)
	WHEN pro.goal_5 = 'RE_OrderCreation' THEN COALESCE(go1.goal_5,0)
	WHEN pro.goal_6 = 'RE_OrderCreation' THEN COALESCE(go1.goal_6,0)
	WHEN pro.goal_7 = 'RE_OrderCreation' THEN COALESCE(go1.goal_7,0)
	WHEN pro.goal_8 = 'RE_OrderCreation' THEN COALESCE(go1.goal_8,0)
	WHEN pro.goal_9 = 'RE_OrderCreation' THEN COALESCE(go1.goal_9,0)
	WHEN pro.goal_10 = 'RE_OrderCreation' THEN COALESCE(go1.goal_10,0)
	WHEN pro.goal_11 = 'RE_OrderCreation' THEN COALESCE(go2.goal_11,0)
	WHEN pro.goal_12 = 'RE_OrderCreation' THEN COALESCE(go2.goal_12,0)
	WHEN pro.goal_13 = 'RE_OrderCreation' THEN COALESCE(go2.goal_13,0)
	WHEN pro.goal_14 = 'RE_OrderCreation' THEN COALESCE(go2.goal_14,0)
	WHEN pro.goal_15 = 'RE_OrderCreation' THEN COALESCE(go2.goal_15,0)
	WHEN pro.goal_16 = 'RE_OrderCreation' THEN COALESCE(go2.goal_16,0)
	WHEN pro.goal_17 = 'RE_OrderCreation' THEN COALESCE(go2.goal_17,0)
	WHEN pro.goal_18 = 'RE_OrderCreation' THEN COALESCE(go2.goal_18,0)
	WHEN pro.goal_19 = 'RE_OrderCreation' THEN COALESCE(go2.goal_19,0)
	WHEN pro.goal_20 = 'RE_OrderCreation' THEN COALESCE(go2.goal_20,0)
END as size_details_added,
CASE
	WHEN pro.goal_1 = 'RE_PickCallDate' THEN COALESCE(go1.goal_1,0)
	WHEN pro.goal_2 = 'RE_PickCallDate' THEN COALESCE(go1.goal_2,0)
	WHEN pro.goal_3 = 'RE_PickCallDate' THEN COALESCE(go1.goal_3,0)
	WHEN pro.goal_4 = 'RE_PickCallDate' THEN COALESCE(go1.goal_4,0)
	WHEN pro.goal_5 = 'RE_PickCallDate' THEN COALESCE(go1.goal_5,0)
	WHEN pro.goal_6 = 'RE_PickCallDate' THEN COALESCE(go1.goal_6,0)
	WHEN pro.goal_7 = 'RE_PickCallDate' THEN COALESCE(go1.goal_7,0)
	WHEN pro.goal_8 = 'RE_PickCallDate' THEN COALESCE(go1.goal_8,0)
	WHEN pro.goal_9 = 'RE_PickCallDate' THEN COALESCE(go1.goal_9,0)
	WHEN pro.goal_10 = 'RE_PickCallDate' THEN COALESCE(go1.goal_10,0)
	WHEN pro.goal_11 = 'RE_PickCallDate' THEN COALESCE(go2.goal_11,0)
	WHEN pro.goal_12 = 'RE_PickCallDate' THEN COALESCE(go2.goal_12,0)
	WHEN pro.goal_13 = 'RE_PickCallDate' THEN COALESCE(go2.goal_13,0)
	WHEN pro.goal_14 = 'RE_PickCallDate' THEN COALESCE(go2.goal_14,0)
	WHEN pro.goal_15 = 'RE_PickCallDate' THEN COALESCE(go2.goal_15,0)
	WHEN pro.goal_16 = 'RE_PickCallDate' THEN COALESCE(go2.goal_16,0)
	WHEN pro.goal_17 = 'RE_PickCallDate' THEN COALESCE(go2.goal_17,0)
	WHEN pro.goal_18 = 'RE_PickCallDate' THEN COALESCE(go2.goal_18,0)
	WHEN pro.goal_19 = 'RE_PickCallDate' THEN COALESCE(go2.goal_19,0)
	WHEN pro.goal_20 = 'RE_PickCallDate' THEN COALESCE(go2.goal_20,0)
END as personal_details_added,
CASE
	WHEN pro.goal_1 = 'RE_SuccessNC' THEN COALESCE(go1.goal_1,0)
	WHEN pro.goal_2 = 'RE_SuccessNC' THEN COALESCE(go1.goal_2,0)
	WHEN pro.goal_3 = 'RE_SuccessNC' THEN COALESCE(go1.goal_3,0)
	WHEN pro.goal_4 = 'RE_SuccessNC' THEN COALESCE(go1.goal_4,0)
	WHEN pro.goal_5 = 'RE_SuccessNC' THEN COALESCE(go1.goal_5,0)
	WHEN pro.goal_6 = 'RE_SuccessNC' THEN COALESCE(go1.goal_6,0)
	WHEN pro.goal_7 = 'RE_SuccessNC' THEN COALESCE(go1.goal_7,0)
	WHEN pro.goal_8 = 'RE_SuccessNC' THEN COALESCE(go1.goal_8,0)
	WHEN pro.goal_9 = 'RE_SuccessNC' THEN COALESCE(go1.goal_9,0)
	WHEN pro.goal_10 = 'RE_SuccessNC' THEN COALESCE(go1.goal_10,0)
	WHEN pro.goal_11 = 'RE_SuccessNC' THEN COALESCE(go2.goal_11,0)
	WHEN pro.goal_12 = 'RE_SuccessNC' THEN COALESCE(go2.goal_12,0)
	WHEN pro.goal_13 = 'RE_SuccessNC' THEN COALESCE(go2.goal_13,0)
	WHEN pro.goal_14 = 'RE_SuccessNC' THEN COALESCE(go2.goal_14,0)
	WHEN pro.goal_15 = 'RE_SuccessNC' THEN COALESCE(go2.goal_15,0)
	WHEN pro.goal_16 = 'RE_SuccessNC' THEN COALESCE(go2.goal_16,0)
	WHEN pro.goal_17 = 'RE_SuccessNC' THEN COALESCE(go2.goal_17,0)
	WHEN pro.goal_18 = 'RE_SuccessNC' THEN COALESCE(go2.goal_18,0)
	WHEN pro.goal_19 = 'RE_SuccessNC' THEN COALESCE(go2.goal_19,0)
	WHEN pro.goal_20 = 'RE_SuccessNC' THEN COALESCE(go2.goal_20,0)
END as placed_first_order
FROM raw.daily_visits vi
LEFT JOIN 
( 
	SELECT 
		date_created, 
		domain, 
		source, 
		medium, 
		campaign, 
		devicecategory, 
		SUM(goal_1) as goal_1 , 
		SUM(goal_2) as goal_2, 
		SUM(goal_3) as goal_3, 
		SUM(goal_4) as goal_4, 
		SUM(goal_5) as goal_5, 
		SUM(goal_6) as goal_6, 
		SUM(goal_7) as goal_7, 
		SUM(goal_8) as goal_8, 
		SUM(goal_9) as goal_9, 
		SUM(goal_10) as goal_10
	FROM dwh.ga_goals_1
	GROUP BY date_created, domain, source, medium, campaign, devicecategory
) go1 ON vi.date_created = go1.date_created
	AND vi.domain = go1.domain 
	AND vi.source = go1.source
	AND vi.medium = go1.medium
	AND vi.campaign = go1.campaign
	AND vi.devicecategory = go1.devicecategory
LEFT JOIN 
( 
	SELECT 
		date_created, 
		domain, 
		source, 
		medium, 
		campaign, 
		devicecategory, 
		SUM(goal_11) as goal_11, 
		SUM(goal_12) as goal_12, 
		SUM(goal_13) as goal_13, 
		SUM(goal_14) as goal_14, 
		SUM(goal_15) as goal_15, 
		SUM(goal_16) as goal_16, 
		SUM(goal_17) as goal_17, 
		SUM(goal_18) as goal_18, 
		SUM(goal_19) as goal_19, 
		SUM(goal_20) as goal_20
	FROM dwh.ga_goals_2
	GROUP BY date_created, domain, source, medium, campaign, devicecategory
) go2 ON vi.date_created = go2.date_created
	AND vi.domain = go2.domain 
	AND vi.source = go2.source
	AND vi.medium = go2.medium
	AND vi.campaign = go2.campaign
	AND vi.devicecategory = go2.devicecategory
LEFT JOIN dwh.ga_profiles_to_import pro ON vi.domain = pro.domain
WHERE pro.status = 'current'
AND  vi.date_created < '2015-05-28' AND /* Until Snowplow data is fixed */ vi.date_created = '2015-08-24'
GROUP BY 1,2,3,4,5,7,8,9,10,11,12

UNION
	SELECT
		CAST(date_created as date) as date_created,
		domain,
		marketing_channel,
		CASE 
    		WHEN device_type = 'Computer' THEN 'desktop'
        	WHEN device_type = 'Mobile' THEN 'mobile'
        	WHEN device_type = 'Tablet' THEN 'tablet'   
    	END AS devicecategory,
    	'Snowplow' as data_source,
    	COUNT(visitor_session_id) as visits,
		SUM(funnel_questionnaire_visit) as started_survey,
		SUM(funnel_customer_create_visit) as completed_survey,
		SUM(funnel_profile_edit_visit) as account_created,
		SUM(funnel_orders_create_visit) as size_details_added,
		SUM(funnel_pick_call_visit) as personal_details_added,
		SUM(funnel_success_nc_visit) as placed_first_order
	FROM "raw.snowplow_visits"
	WHERE  CAST(date_created as date) >= '2015-05-28' AND /* Until Snowplow data is fixed */ CAST(date_created as date) != '2015-08-24'
	GROUP BY 1,2,3,4,5


