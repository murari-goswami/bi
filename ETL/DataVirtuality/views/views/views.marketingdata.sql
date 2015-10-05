-- Name: views.marketingdata
-- Created: 2015-04-24 18:24:40
-- Updated: 2015-08-07 10:54:15

CREATE VIEW views.marketingdata
AS
SELECT
	cu.customer_id as "cu_id",
	co.id as "co_id",
	sfa.CustomerStatus__c as "sfa_customerloyalty",
	CASE
		WHEN cu.salutation= '1' then 'Herr'
		WHEN cu.salutation= '2' then 'Frau'
	END as "cu_salutation",
	sfa.DuSie__c as "cu_du_sie",
	cu.first_name as "cu_firstname",
	cu.last_name as "cu_lastname",
	cu.token as "cu_token",
	cu.date_created as "cu_datecreated_timestamp",
	co.phone_date as "co_phonedate_timestamp",
	co.date_created as "co_datecreated_timestamp",
	co.customer_age as "co_customerage",
	co.state as "co_orderstate",
	CASE
		WHEN co.state= '4' then '1. Order Initiated'
		WHEN co.state= '8' then '2. Order Created'
		WHEN co.state in ('16','20','24','32','64') then '3. Order Packed'
		WHEN co.state in ('128','256','384') then '4. Order Shipped'
		WHEN co.state in ('512','1024') then '5. Order Completed'
		WHEN co.state= '2048' then '6. Order Cancelled'
		WHEN co.state= '1536' then '7.Order Lost'
		ELSE null
	END as "co_trueorderstate",
	CASE
		WHEN co.phone_date IS NULL then '0'
		ELSE '1'
	END as "co_phonedateset",
	co.sales_channel as "co_saleschannel",
	CASE 
		WHEN co.parent_order_id IS NULL then '0'
		ELSE '1'
	END as "co_followon",
	CASE
		WHEN co.real_repeat_order_count IS NULL AND co.parent_order_id IS NULL then 'first order'
		WHEN co.real_repeat_order_count= '1' AND co.parent_order_id IS NULL then 'first order'
		WHEN co.real_repeat_order_count> '1' AND co.parent_order_id IS NULL then 'real repeat order'
		WHEN co.real_repeat_order_count IS NULL AND co.parent_order_id is not null then 'follow on order'
		WHEN co.real_repeat_order_count= '1' AND co.parent_order_id is not null then 'follow on order'
		WHEN co.real_repeat_order_count> '1' AND co.parent_order_id is not null then 'follow on order'
	END as "co_newrepeatfollow",
	CASE
		WHEN co.real_order_count_completed IS NULL AND co.parent_order_id IS NULL AND co.state= '1024' then 'first order'
		WHEN co.real_order_count_completed= '1' AND co.parent_order_id IS NULL AND co.state= '1024' then 'first order'
		WHEN co.real_order_count_completed> '1' AND co.parent_order_id IS NULL AND co.state= '1024' then 'real repeat order'
		WHEN co.real_order_count_completed IS NULL AND co.parent_order_id is not null then 'follow on order'
		WHEN co.real_order_count_completed= '1' AND co.parent_order_id is not null then 'follow on order'
		WHEN co.real_order_count_completed> '1' AND co.parent_order_id is not null then 'follow on order'
	ELSE 'unclear'
	END as "co_newrepeatfollow_completed",
	co.real_repeat_order_count as "co_ordercount",
	co.real_order_count_completed as "co_ordercount_completed",
	co.parent_order_id as "co_parentorderid",
	pd2.parent_preview_id as "pd_topicboxid",
	CAST(cu.date_created as date) as "cu_datecreated",
	CAST(co.date_created as date) as "co_datecreated",
	CAST(co.phone_date as date) as "co_phonedate",
	CAST(co.date_picked as date) as "co_datepicked",
	CAST(co.date_shipped as date) as "co_dateshipped",
	CAST(co.date_returned as date) as "co_datereturned",
	CAST(co.date_completed as date) as "co_datecompleted",
	CAST(co.date_payed as date) as "co_datepaid",
	CAST(cu.date_of_birth as date) as "pro_dateofbirth",
	fo.fo_datefirstorder,
	fo.fo_datefirstorder_completed,
	op.op_totalbilled,
	op.op_articlesreturned,
	op.op_articleskept,
	op.op_articlesselected,
	co.total_amount_billed_retail_gross as "co_billed",
	co.total_amount_billed_discount as "co_discountgranted",
	CAST(CASE
			WHEN co.state in ('512','1024') then (co.total_amount_billed_retail_gross + co.total_amount_billed_discount)
			ELSE null
			END as decimal
		) as "co_totalbilled",
	CAST(CASE
			WHEN co.state in ('512','1024') then (co.total_amount_basket_retail_gross)
			ELSE null
			END as decimal
		) as "co_totalbasket",
	co.total_amount_payed as "co_totalamountpaid",
	co.payment_state as "co_paymentstate",
	co.payment_method as "co_paymentmethod",
	CASE
		WHEN co.vat_percentage= '19' then '0.19'
		WHEN co.vat_percentage= '20' then '0.20'
		WHEN co.vat_percentage= '8' then '0.08'
		ELSE null
	END as "co_vatpercentage",
	CASE
		WHEN co.payment_method= '1' then 'Invoice'
		WHEN co.payment_method= '2' then 'Credit Card'
		WHEN co.payment_method= '4' then 'Prepayment'
		WHEN co.payment_method= '6' then 'Arvato'
	END as "co_truepaymentmethod",
	CASE
		WHEN co.payment_state= '8' then 'Pending'
		WHEN co.payment_state= '16' then 'Authorised'
		WHEN co.payment_state= '32' then 'Captured'
		WHEN co.payment_state= '48' then 'Factored'
		WHEN co.payment_state= '64' then 'Paid'
		WHEN co.payment_state= '2048' then 'Cancelled'
	END as "co_truepaymentstate",
	CASE
		WHEN co.date_first_dunning IS NULL then '0'
		ELSE '1'
	END as "co_firstdunning",
	CASE
		WHEN co.date_second_dunning IS NULL then '0'
		ELSE '1'
	END as "co_seconddunning",
	CASE
		WHEN co.date_encashment IS NULL then '0'
		ELSE '1'
	END as "co_encashment",
	CAST(co.date_first_dunning as date) as "co_datefirstdunning",
	CAST(co.date_second_dunning as date) as "co_dateseconddunning",
	CAST(co.date_encashment as date) as "co_dateencashment",
	ga.source as "ga_source",
	ga.medium as "ga_medium",
	ga.campaign as "ga_campaign",
	ga.country as "domain_name",
	ga.cam_bit_1 as "ga_cam_bit_1",
	ga.cam_bit_2 as "ga_cam_bit_2",
	ga.cam_bit_3 as "ga_cam_bit_3",
	ga.keyword as "ga_keyword",
	ga.optimizely_campaign as "optimizely_campaign",
	CASE
	
		WHEN tv.order_id IS NULL  AND ga.channel= 'affiliate' AND ga.cam_bit_1!= 'rem' then 'affiliate'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'crm' AND ga.cam_bit_1!= 'rem' then 'crm'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'display' AND ga.cam_bit_1!= 'rem' then 'display'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'facebook' AND ga.cam_bit_1!= 'rem' then 'facebook'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'google gdn' AND ga.cam_bit_1!= 'rem' then 'google gdn'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'kooperation' AND ga.cam_bit_1!= 'rem' then 'kooperation'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'praemienprogramm' AND ga.cam_bit_1!= 'rem' then 'praemienprogramm'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'remarketing' AND ga.cam_bit_1!= 'rem' then 'remarketing'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'twitter' AND ga.cam_bit_1!= 'rem' then 'twitter'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'youtube' AND ga.cam_bit_1!= 'rem' then 'youtube'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'google sem' AND ga.cam_bit_1!= 'rem' AND ga.cam_bit_3!= 'brand' then 'google sem nobrand'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'google sem' AND ga.cam_bit_1!= 'rem' AND ga.cam_bit_3= 'brand' then 'google sem brand'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'direct' then 'direct'
	 	WHEN tv.order_id IS NULL  AND ga.channel= 'organic' AND ga.cam_bit_1!= 'rem' then 'organic'
	 	WHEN tv.order_id IS NULL  AND ga.channel= '(not set)' AND ga.cam_bit_1!= 'rem' then '(not set)'
	 	WHEN tv.order_id IS NULL  AND ga.cam_bit_1= 'rem' then 'remarketing'
	 	ELSE '(not set)'
	END as "tsm_channel",
	CASE
	  
	 	WHEN ga.channel= 'affiliate' AND ga.cam_bit_1!= 'rem' then 'affiliate'
	 	WHEN ga.channel= 'crm' AND ga.cam_bit_1!= 'rem' then 'crm'
	 	WHEN ga.channel= 'display' AND ga.cam_bit_1!= 'rem' then 'display'
	 	WHEN ga.channel= 'facebook' AND ga.cam_bit_1!= 'rem' then 'facebook'
	 	WHEN ga.channel= 'google gdn' AND ga.cam_bit_1!= 'rem' then 'google gdn'
	 	WHEN ga.channel= 'kooperation' AND ga.cam_bit_1!= 'rem' then 'kooperation'
	 	WHEN ga.channel= 'praemienprogramm' AND ga.cam_bit_1!= 'rem' then 'praemienprogramm'
	 	WHEN ga.channel= 'remarketing' AND ga.cam_bit_1!= 'rem' then 'remarketing'
	 	WHEN ga.channel= 'twitter' AND ga.cam_bit_1!= 'rem' then 'twitter'
	 	WHEN ga.channel= 'youtube' AND ga.cam_bit_1!= 'rem' then 'youtube'
	 	WHEN ga.channel= 'google sem' AND ga.cam_bit_1!= 'rem' AND ga.cam_bit_3!= 'brand' then 'google sem nobrand'
	 	WHEN ga.channel= 'google sem' AND ga.cam_bit_1!= 'rem' AND ga.cam_bit_3= 'brand' then 'google sem brand'
	 	WHEN ga.channel= 'direct' then 'direct'
	 	WHEN ga.channel= 'organic' AND ga.cam_bit_1!= 'rem' then 'organic'
	 	WHEN ga.channel= '(not set)' AND ga.cam_bit_1!= 'rem' then '(not set)'
	 	WHEN ga.cam_bit_1= 'rem' then 'remarketing'
	 	ELSE '(not set)'
	END as "tsm_channel_excluding_tv",
	fc1.channel as "fc_firstchannel",
	fc2.channel as "fc_firstchannel_completed",
	co.first_saleschannel_completed,
	ga.operating_system as "sy_operatingsystem",
	ga.device_category as "sy_devicecategory",
	ga.browser as "sy_browser",
	CAST(ga.visits_per_transactionid as integer) as "ga_visits_per_transactionid",
	tv.order_id as "tv_orderid",
	CASE
		WHEN tv.order_id IS NULL then 'not flagged as tv'
		WHEN tv.order_id is not null then 'flagged as tv'
		ELSE 'ask BI'
	END as "tv_spot",
	tv."date_spot_aired" as "tv_date_spot_aired",
	tv."timestamp_spot_aired" as "tv_time_spot_aired",
	tv.tv_station as "tv_station",
	tv.tv_program as "tv_program",
	cam.id as "cam_id",
	cam.code as "cam_code",
	cam.campaign_type as "cam_campaigntype",
	CASE
		WHEN left(cam.campaign_title,19)= 'DriveNow Rallye Dez' then 'drivenow rallye dez'
		ELSE cam.campaign_title
	END as "cam_campaigntitle",
	cam.useable_amount as "cam_usableamount",
	CAST(cam.date_start as date) as "cam_startdate",
	CAST(cam.date_end as date) as "cam_enddate",
	cam.version as "cam_version",
	cam.discount_absolute as "cam_absolutediscount",
	cam.discount_percentage as "cam_relativediscount",
	sty.first_name as "sty_firstname",
	sty.last_name as "sty_lastname",
	sty.user_role as "sty_team",
	cu.phone_number as "pro_phonenumber",
	cu.email as "cu_email",
	cu.preferred_language as "pro_preflanguage",
	cu.preferred_contact_time as "pro_prefcontacttime",
	cu.preferred_contact_channel as "pro_prefcontactchannel",
	cu.branch_working_in as "pro_branch",
	cu.branch_working_in_other as "pro_branchalt",
	cu.preferred_brand as "pro_prefbrand",
	cu.preferred_brand_other as "pro_prefbrandalt",
	cu.height_in_cm as "pro_heightcm",
	cu.weight_in_kg as "pro_weightkg",
	cu.default_page,
	CASE
		WHEN cu.spending_budget_for_jeans= '7' then '60 - 80'
		WHEN cu.spending_budget_for_jeans= '8' then '80 - 120'
		WHEN cu.spending_budget_for_jeans= '9' then '120 - 180'
		WHEN cu.spending_budget_for_jeans= '10' then '> 180'
		ELSE 'not defined'
	END as "pro_budgetjeans",
	CASE
		WHEN cu.spending_budget_for_shirts= '4' then '40 - 60'
		WHEN cu.spending_budget_for_shirts= '5' then '60 - 80'
		WHEN cu.spending_budget_for_shirts= '6' then '80 - 100'
		WHEN cu.spending_budget_for_shirts= '7' then '> 100'
		ELSE 'not defined'
	END as "pro_budgetshirts",
	CASE
		WHEN cu.spending_budget_for_shoes= '4' then '60 - 100'
		WHEN cu.spending_budget_for_shoes= '5' then '100 - 200'
		WHEN cu.spending_budget_for_shoes= '6' then '> 200'
		ELSE 'not defined'
	END as "pro_budgetshoes",
	CASE
		WHEN cu.spending_budget_for_sakkos= '4' then '100 - 150' 
		WHEN cu.spending_budget_for_sakkos= '5' then '150 - 200' 
		WHEN cu.spending_budget_for_sakkos= '6' then '> 200' 
		ELSE 'not defined'
	END as "pro_budgetsakkos",
	r.rank1_cluster,
	r.rank1_cluster_spent,
	r.rank1_cluster_articles,
	r.rank1_category1,
	r.rank1_category2,
	r.rank1_category3,
	r.rank1_category4,
	r.rank1_category5,
	r.rank1_category_articles,
	r.rank1_brand,
	r.rank2_category_articles,
	r.rank2_cluster,
	r.rank2_cluster_spent,
	r.rank2_cluster_articles,
	r.rank2_category1,
	r.rank2_category2,
	r.rank2_category3,
	r.rank2_category4,
	r.rank2_category5,
	r.rank2_brand,
	r.rank3_category1,
	r.rank3_category2,
	r.rank3_category3,
	r.rank3_category4,
	r.rank3_category5,
	r.rank3_category_articles,
	r.rank3_brand,
	r.rank3_cluster,
	r.rank3_cluster_spent,
	r.rank3_cluster_articles,
	r.cluster,
	cu.newsletter_accepted as "pro_newsletteraccepted",
	CASE
		WHEN cu.date_newsletter_confirmed IS NULL then '0'
		WHEN cu.date_newsletter_confirmed is not null then '1'
	END as "pro_newsletterconfirmed",
	cu.date_newsletter_confirmed as "pro_datenewsletterconfirmed",
	CASE
		WHEN sfa.UnsubscribedNL__c= 'true' then '1'
		WHEN sfa.UnsubscribedNL__c= 'false' then '0'
	END as "sfa_newsletterunsubscribed",
	 CASE
		WHEN cu.newsletter_accepted= 'true' AND cu.date_newsletter_confirmed IS NULL AND sfa.UnsubscribedNL__c= 'false' then 'soi'
		WHEN cu.newsletter_accepted= 'true' AND cu.date_newsletter_confirmed is not null AND sfa.UnsubscribedNL__c= 'false' then 'doi'
	  	WHEN cu.newsletter_accepted= 'true' AND cu.date_newsletter_confirmed IS NULL AND sfa.UnsubscribedNL__c= 'true' then 'unsubscribed'
	  	WHEN cu.newsletter_accepted= 'true' AND cu.date_newsletter_confirmed is not null AND sfa.UnsubscribedNL__c= 'true' then 'unsubscribed'
	  	WHEN cu.newsletter_accepted= 'false' AND cu.date_newsletter_confirmed IS NULL AND sfa.UnsubscribedNL__c= 'true' then 'unsubscribed'
	  	WHEN cu.newsletter_accepted= 'false' AND cu.date_newsletter_confirmed is not null AND sfa.UnsubscribedNL__c= 'true' then 'unsubscribed'
	  	WHEN cu.newsletter_accepted= 'false' AND cu.date_newsletter_confirmed IS NULL AND sfa.UnsubscribedNL__c= 'false' then 'not accepted'
	  	WHEN cu.newsletter_accepted= 'false' AND cu.date_newsletter_confirmed is not null AND sfa.UnsubscribedNL__c= 'false' then 'not accepted'
	  	ELSE '(not set)'
	 END as "subscribe_status",
	sfo.SalesChannel_Special__c as "sfo_saleschannel_special",
	CASE
	 	WHEN sfo.Vorkasse_Email_sent__c= 'false' then '0'
	 	WHEN sfo.Vorkasse_Email_sent__c= 'true' then '1'
	END as "sfo_prepaymentemail",
	CASE
		WHEN sfo.notReached__c= 'false' then '0'
		WHEN sfo.notReached__c= '0' then '0'
		WHEN sfo.notReached__c= 'true' then '1'
		WHEN sfo.notReached__c= '1' then '1' 
		ELSE 'not defined'
	END as "sfo_notreached",
	sfo.SalesChannel__c as "sfo_saleschannel",
	CASE 
		WHEN sfo.CallConfirmed__c= 'true' then '1'
		WHEN sfo.CallConfirmed__c= 'false' then '0'
		ELSE 'ask BI'
	END as "sfo_callconfirmed",
	CASE
		WHEN sfo.NoCall_Box__c= 'true' then '1'
		WHEN sfo.NoCall_Box__c= 'false' then '0'
		ELSE 'ask BI'
	END as "sfo_nocallbox",
	sfo.OpsCheck__c as "sfo_opscheck",
	sfo.DateFirstOrder__c as "sfo_datefirstorder",
	sfo.StageName as "sfo_stage",
	sfo.InactiveReason__c as "sfo_inactive_reason",
	sfo.CS_Reason__c as "sfo_cs_reason",
	co.shipping_country as "addr_country",
	co.shipping_city as "addr_city",
	co.shipping_zip as "addr_zip",
	co.shipping_street as "addr_street",
	co.shipping_street_number as "addr_streetnumber",
	co.shipping_first_name as "addr_firstname",
	co.shipping_last_name as "addr_lastname",
	cu.prefix as "cu_title",
	co.order_state as is_real_order
FROM views.customer cu
LEFT JOIN views.customer_order co on cu.customer_id = co.customer_id
LEFT JOIN views.ga_information ga on co.id = ga.transaction_id
LEFT JOIN views.campaign cam on co.campaign_id = cam.id
LEFT JOIN views.salesforce_account sfa on cu.customer_id = sfa.ExternalCustomerid__c
LEFT JOIN views.salesforce_opportunity sfo on co.id = sfo.ExternalOrderId__c
LEFT JOIN views.stylist sty on co.stylelist_id = sty.stylist_id
LEFT JOIN views.marketingtv tv on co.id = tv.order_id
LEFT JOIN 
(
	SELECT
  		fc.customer_id as "customer_id",
  		CASE
		  
		   WHEN fc.order_id IS NULL  AND fc.channel= 'affiliate' AND fc.cam_bit_1!= 'rem' then 'affiliate'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'crm' AND fc.cam_bit_1!= 'rem' then 'crm'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'display' AND fc.cam_bit_1!= 'rem' then 'display'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'facebook' AND fc.cam_bit_1!= 'rem' then 'facebook'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'google gdn' AND fc.cam_bit_1!= 'rem' then 'google gdn'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'kooperation' AND fc.cam_bit_1!= 'rem' then 'kooperation'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'praemienprogramm' AND fc.cam_bit_1!= 'rem' then 'praemienprogramm'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'remarketing' AND fc.cam_bit_1!= 'rem' then 'remarketing'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'twitter' AND fc.cam_bit_1!= 'rem' then 'twitter'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'youtube' AND fc.cam_bit_1!= 'rem' then 'youtube'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'google sem' AND fc.cam_bit_1!= 'rem' AND fc.cam_bit_3!= 'brand' then 'google sem nobrand'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'google sem' AND fc.cam_bit_1!= 'rem' AND fc.cam_bit_3= 'brand' then 'google sem brand'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'direct' then 'direct'
		   WHEN fc.order_id IS NULL  AND fc.channel= 'organic' AND fc.cam_bit_1!= 'rem' then 'organic'
		   WHEN fc.order_id IS NULL  AND fc.channel= '(not set)' AND fc.cam_bit_1!= 'rem' then '(not set)'
		   WHEN fc.order_id IS NULL  AND fc.cam_bit_1= 'rem' then 'remarketing'
		   ELSE '(not set)'
		END as "channel"
	FROM 
	(
 		SELECT
	  		row_number() over (partition by co1.customer_id order by co1.date_created asc) as "rnum",
	  		co1.customer_id,
	  		co1.id,
	  		tv1.order_id,
	  		ga1.channel,
	  		ga1.cam_bit_1,
	  		ga1.cam_bit_3
  		FROM views.customer_order co1
  		LEFT JOIN views.ga_information ga1 on co1.id = ga1.transaction_id
  		LEFT JOIN views.marketingtv tv1 on co1.id = tv1.order_id
  	) fc 
 	WHERE fc.rnum= '1'
) fc1 on fc1.customer_id = cu.customer_id
LEFT JOIN 
(
	SELECT
  		fc.customer_id as "customer_id",
		CASE
		
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'affiliate' AND fc.cam_bit_1!= 'rem' then 'affiliate'
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'crm' AND fc.cam_bit_1!= 'rem' then 'crm'
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'display' AND fc.cam_bit_1!= 'rem' then 'display'
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'facebook' AND fc.cam_bit_1!= 'rem' then 'facebook'
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'google gdn' AND fc.cam_bit_1!= 'rem' then 'google gdn'
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'kooperation' AND fc.cam_bit_1!= 'rem' then 'kooperation'
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'praemienprogramm' AND fc.cam_bit_1!= 'rem' then 'praemienprogramm'
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'remarketing' AND fc.cam_bit_1!= 'rem' then 'remarketing'
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'twitter' AND fc.cam_bit_1!= 'rem' then 'twitter'
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'youtube' AND fc.cam_bit_1!= 'rem' then 'youtube'
		  	 	WHEN fc.order_id IS NULL  AND fc.channel= 'google sem' AND fc.cam_bit_1!= 'rem' AND fc.cam_bit_3!= 'brand' then 'google sem nobrand'
		  		WHEN fc.order_id IS NULL  AND fc.channel= 'google sem' AND fc.cam_bit_1!= 'rem' AND fc.cam_bit_3= 'brand' then 'google sem brand'
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'direct' then 'direct'
		   		WHEN fc.order_id IS NULL  AND fc.channel= 'organic' AND fc.cam_bit_1!= 'rem' then 'organic'
		   		WHEN fc.order_id IS NULL  AND fc.channel= '(not set)' AND fc.cam_bit_1!= 'rem' then '(not set)'
		   		WHEN fc.order_id IS NULL  AND fc.cam_bit_1= 'rem' then 'remarketing'
		   		ELSE '(not set)'
			END as "channel"
 		FROM 
 		(
			SELECT
				row_number() over (partition by co1.customer_id order by co1.date_created asc) as "rnum",
				co1.customer_id,
				co1.id,
				tv1.order_id,
				ga1.channel,
				ga1.cam_bit_1,
				ga1.cam_bit_3
			FROM views.customer_order co1
			LEFT JOIN views.ga_information ga1 on co1.id = ga1.transaction_id
			LEFT JOIN views.marketingtv tv1 on co1.id = tv1.order_id
			WHERE co1.state= '1024'
		) fc
		WHERE fc.rnum= '1'
) fc2 on fc2.customer_id = cu.customer_id
LEFT JOIN 
(
	SELECT
		customer_id,
		MIN(case when state=1024 then cast(date_completed as date) else null end) as fo_datefirstorder,
		MIN(cast(date_created as date)) as fo_datefirstorder_completed
	FROM views.customer_order
	GROUP BY 1
) fo on fo.customer_id = cu.customer_id
LEFT JOIN 
(
	SELECT
		order_id,
		COUNT(CASE WHEN state= '512'  THEN'1' ELSE null END) as op_articlesreturned,
  		COUNT(CASE WHEN state= '1024' THEN '1' ELSE null END) as op_articleskept,
  		COUNT(CASE WHEN state>= '128' THEN '1' ELSE null END) as op_articlesselected,
	    SUM(CASE WHEN state=1024 THEN CAST(retail_price as decimal) else 0 end) as op_totalbilled
	FROM views.order_position
	GROUP BY 1
)op on op.order_id = co.id
LEFT JOIN
(
	SELECT 
 		pd.parent_preview_id,
 		pd.order_id
	FROM
	(
		SELECT 
  			parent_preview_id,
  			order_id,
  			row_number() over (partition by order_id order by date_created desc) as "rnum"
 		FROM views.preview_data
 	) pd
	WHERE pd.rnum= '1'
) pd2 on pd2.order_id = co.id
LEFT JOIN views.customer_ranked r on r.customer_id = cu.customer_id
WHERE cu.customer_id is not null
AND co.order_state='Real Order'


