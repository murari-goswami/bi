-- Name: views.customer_ranked
-- Created: 2015-04-24 18:22:58
-- Updated: 2015-08-07 11:01:29

CREATE VIEW views.customer_ranked
AS
/*This sql replaces the views.ranked_customer_information, this is used in sub queries to get 3 clusters*/
WITH cust_cluster AS
(
	SELECT
	cast(clu2.rnum as integer) as "rnum",
	clu2.customerid as "customer_id",
	clu2.brand as "brand",
	clu2.marketing_cluster as "cluster",
	clu2.spent_per_brand as "spent_in_cluster",
	clu2.number_of_articles as "articles_in_cluster",
	foo2.category1,
	foo2.category2,
	foo2.category3,
	foo2.category4,
	foo2.category5,
	foo2.number_of_articles as "articles_in_category"
	FROM 
	(
		SELECT
			row_number() over (partition by clu.customerid order by clu.spent_per_brand desc, clu.number_of_articles desc) as "rnum",
			clu.customerid as "customerid",
			clu.brand as "brand",
			clu.marketing_cluster,
			clu.number_of_articles as "number_of_articles",
			cast(clu.spent_per_brand as decimal) as "spent_per_brand"
		FROM 
		(
			SELECT
				co.customer_id as "customerid",
				foo.brand,
				foo.marketing_cluster,
				sum(foo.op_retail_price) as "spent_per_brand",
				count(foo.op_orderid) as "number_of_articles"
			FROM views.customer_order co
			JOIN
			( 
				SELECT
	    			op.order_id as "op_orderid",
					art.article_brand as "brand",
					b.marketing_cluster,
					op.retail_price as "op_retail_price"
				FROM views.order_position op
				left join views.article art on art.article_id = op.article_id
				left join dwh.brands b on b.name = art.article_brand
				WHERE op.state= '1024'
			) foo on foo.op_orderid = co.id
			WHERE co.state= '1024'
			group by 1,2 ,3
		) clu 
	) clu2
	left join 
	(
		SELECT
			foo1.rnum,
			foo1.customer_id,
			foo1.category1,
			foo1.category2,
			foo1.category3,
			foo1.category4,
			foo1.category5,
			foo1.number_of_articles
		FROM 
		(
			SELECT
				row_number() over (partition by foo.customer_id order by foo.number_of_articles desc) as "rnum",
				foo.customer_id,
				foo.category1,
				foo.category2,
				foo.category3,
				foo.category4,
				foo.category5,
				foo.number_of_articles
			FROM 
			(
				SELECT
					co.customer_id as "customer_id",
					sac.cat1 as "category1",
					sac.category2 as "category2",
					sac.category3 as "category3",
					sac.cat4 as "category4",
					sac.cat5 as "category5",
					count(distinct(op.id)) as "number_of_articles"
				FROM views.customer_order co
	  			inner join views.order_position op on op.order_id = co.id
	  			inner join views.supplier_article_categories sac on sac.supplier_article_id = op.supplier_article_id
	  			WHERE op.state=	'1024'
	  			and co.state= '1024'
	  			group by 1,2,3,4,5,6 
	  		) foo
	 		WHERE foo.category2 is not null
	 	) foo1
		WHERE foo1.rnum<= '5'
	) foo2
	on foo2.rnum = clu2.rnum and clu2.customerid = foo2.customer_id
	WHERE clu2.rnum<= '5'
)
SELECT
	cu.customer_id,
	cu.email,
	cu.first_name,
	cu.last_name,
	cu.postfix,
	cu.prefix,
	cu.profile_id,
	cu.salutation,
	cu.date_created,
	cu.last_login,
	cu.token,
	cu.default_page,
	cu.facebook_page,
	cu.salesforce_id,
	cu.referred_by_id,
	cu.first_order_date,   
	cu.first_order_date_completed,
	cu.branch_working_in,
	cu.date_of_birth,
	cu.height_in_cm,
	cu.phone_number,
	cu.preferred_brand,
	cu.preferred_contact_channel,
	cu.preferred_contact_time,
	cu.shirt_size,
	cu.shoe_size,
	cu.trousers_size,
	cu.weight_in_kg,
	cu.buying_problem_other,
	cu.newsletter_accepted,
	cu.preferred_brand_other,
	cu.spending_budget_for_jeans,
	cu.spending_budget_for_shirts,
	cu.spending_budget_for_shoes,
	cu.branch_working_in_other,
	cu.trousers_size_length,
	cu.trousers_size_width,
	cu.spending_budget_for_sakkos,
	cu.profile_date_created,
	cu.profile_last_updated,
	cu.referral,
	cu.date_newsletter_confirmed,
	cu.preferred_language,
	cu.collar_size,
	cu.spending_budget_for_shirts_FROM,
	cu.spending_budget_for_shirts_to,
	cu.spending_budget_for_jeans_FROM,
	cu.spending_budget_for_jeans_to,
	cu.spending_budget_for_shoes_FROM,
	cu.spending_budget_for_shoes_to,
	cu.spending_budget_for_sakkos_FROM,
	cu.spending_budget_for_sakkos_to,
	cu.buying_problems,
	cu.piclanguage,
	cu.picusagereason,
	cu.pictypicalbag,
	cu.pictypicalshoes,
	cu.picclothwork,
	cu.picagerange,
	cu.pictypicalstyle,
	cu.customer_image_min_date_created,
	cu.customer_image_max_last_updated,
	cu.customer_image_image_count,
	cu.customer_image_facebook_image_count,
	cu.customer_image_other_image_count,
	clust.rank1_category_articles,
	clust.rank1_brand,
	clust.rank1_cluster,
	clust.rank1_cluster_spent,
	clust.rank1_cluster_articles,
	clust.rank1_category1,
	clust.rank1_category2,
	clust.rank1_category3,
	clust.rank1_category4,
	clust.rank1_category5,
	clust.rank2_category_articles,
	clust.rank2_category1,
	clust.rank2_category2,
	clust.rank2_category3,
	clust.rank2_category4,
	clust.rank2_category5,
	clust.rank2_brand,
	clust.rank2_cluster,
	clust.rank2_cluster_spent,
	clust.rank2_cluster_articles,
	clust.rank3_category_articles,
	clust.rank3_category1,
	clust.rank3_category2,
	clust.rank3_category3,
	clust.rank3_category4,
	clust.rank3_category5,
	clust.rank3_brand,
	clust.rank3_cluster,
	clust.rank3_cluster_spent,
	clust.rank3_cluster_articles,
	clust.cluster
FROM views.customer cu
LEFT JOIN
(
	SELECT 
		r1.customer_id,
		r1.articles_in_category as "rank1_category_articles",
		r1.brand as "rank1_brand",
		r1.cluster as "rank1_cluster",
		r1.spent_in_cluster as "rank1_cluster_spent",
		r1.articles_in_cluster as "rank1_cluster_articles",
		r1.category1 as "rank1_category1",
		r1.category2 as "rank1_category2",
		r1.category3 as "rank1_category3",
		r1.category4 as "rank1_category4",
		r1.category5 as "rank1_category5",
		r2.articles_in_category as "rank2_category_articles",
		r2.category1 as "rank2_category1",
		r2.category2 as "rank2_category2",
		r2.category3 as "rank2_category3",
		r2.category4 as "rank2_category4",
		r2.category5 as "rank2_category5",
		r2.brand as "rank2_brand",
		r2.cluster as "rank2_cluster",
		r2.spent_in_cluster as "rank2_cluster_spent",
		r2.articles_in_cluster as "rank2_cluster_articles",
		r3.articles_in_category as "rank3_category_articles",
		r3.category1 as "rank3_category1",
		r3.category2 as "rank3_category2",
		r3.category3 as "rank3_category3",
		r3.category4 as "rank3_category4",
		r3.category5 as "rank3_category5",
		r3.brand as "rank3_brand",
		r3.cluster as "rank3_cluster",
		r3.spent_in_cluster as "rank3_cluster_spent",
		r3.articles_in_cluster as "rank3_cluster_articles",
		s.cluster
	FROM
	(
		/*Rank-1 Cluster*/
		SELECT
			customer_id,
			category1,
			category2,
			category3,
			category4,
			category5,
			articles_in_category,
			brand,
			cluster,
			spent_in_cluster,
			articles_in_cluster
		FROM cust_cluster
		WHERE rnum= '1'
	)r1
	LEFT JOIN 
	(
		/*Rank-2 Cluster*/
		SELECT
			customer_id,
			category1,
			category2,
			category3,
			category4,
			category5,
			articles_in_category,
			brand,
			cluster,
			spent_in_cluster,
			articles_in_cluster
		FROM cust_cluster
		WHERE rnum= '2'
	)r2 on r1.customer_id=r2.customer_id
	LEFT JOIN
	(
		/*Rank-3 Cluster*/
		SELECT
			customer_id,
			category1,
			category2,
			category3,
			category4,
			category5,
			articles_in_category,
			brand,
			cluster,
			spent_in_cluster,
			articles_in_cluster
		FROM cust_cluster
		WHERE rnum= '3'
	)r3 on r1.customer_id=r3.customer_id
	LEFT JOIN
	(
		SELECT
 			a.customer_id, 
 			a.cluster
		FROM 
		(
 			SELECT 
  				rc.customer_id, 
  				rc.cluster, 
  				COUNT(*) cluster_count, 
  				SUM(rc.spent_in_cluster) cluster_spend,
   				RANK() OVER (PARTITION BY rc.customer_id ORDER BY COUNT(*) DESC) as cluster_rank,
   				ROW_NUMBER() OVER (PARTITION BY rc.customer_id, COUNT(*) ORDER BY SUM(rc.spent_in_cluster) DESC) as spend_row
 			FROM cust_cluster rc
 			WHERE rc.cluster IS NOT NULL
 			GROUP BY 1,2
  		)a
		WHERE a.cluster_rank = 1 
		AND a.spend_row = 1
	)s on s.customer_id = r1.customer_id
)clust on clust.customer_id=cu.customer_id


