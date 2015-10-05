create or replace view stage.v_dim_customer
as
select
	p.id as customer_id,
	p.date_created,
	p.email,
	p.first_name,
	p.last_name,
	case
		when club_status = 'ACTIVE'
			then true 
		else false
	end as club_member,
	pr.date_of_birth,
	pr.phone_number,
	p.default_page as domain_page,
	uc.providerid,
	case 
		when lower(p.first_name) in ('test','tester')
			or lower(p.last_name) in ('test','tester')
			or lower(p.first_name) like '% test %'
			or lower(p.last_name) like '% test %'
			or (lower(p.email) like '%test%' and lower(p.email) like '%@outfittery%')
			or (lower(p.email) like '%+%' and lower(p.email) like '%@outfittery%')
			then 'test user'
		when p.id in ('179899816','179886634','11804631','31281783',
			'143553094','834667','197384812','163836386','62252329',
			'94204965','234063161','242674884','243692185')
			then 'Outfittery Showroom'
		else 'Real User'
	end as user_type,
	case 
		when extract(year from age(current_date, cast(pr.date_of_birth as date))) >= 18 and extract(year from age(current_date, cast(pr.date_of_birth as date))) <= 30 then '18-30'
		when extract(year from age(current_date, cast(pr.date_of_birth as date))) >= 31 and extract(year from age(current_date, cast(pr.date_of_birth as date))) <= 35 then '31-35'
		when extract(year from age(current_date, cast(pr.date_of_birth as date))) >= 36 and extract(year from age(current_date, cast(pr.date_of_birth as date))) <= 45 then '36-45'
		when extract(year from age(current_date, cast(pr.date_of_birth as date))) >= 46 and extract(year from age(current_date, cast(pr.date_of_birth as date))) <= 55 then '46-55'
		when extract(year from age(current_date, cast(pr.date_of_birth as date))) >= 56 then '56+'
		else null
	end as age_group
from stage.postgres_principal p
	left join stage.postgres_profile pr on pr.id=p.profile_id
	left join (
		select
			row_number() over(partition by userid order by providerid) as r_num,
			userid,
			providerid 
		from stage.postgres_userconnection
		where rank = 1 
			and secret is not null
	) uc on uc.userid = p.email and r_num = 1
	/* This table has club information of customer from grails
	only Outfittery_Club_Einf_hrungskampagne__c as club_campaign_member is missing in grails */
	left join (
		select 
			row_number() over(partition by customer_id order by date_created desc) as rank, 
			customer_id,
			status as club_status
		from stage.postgres_customer_subscription
	) cl on cl.customer_id = p.id and cl.rank = 1
;