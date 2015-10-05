-- Name: ml.project_outfit_ranking_molor
-- Created: 2015-04-24 18:25:22
-- Updated: 2015-04-24 18:25:22

CREATE VIEW ml.project_outfit_ranking_molor AS
SELECT
mr.molor_id,
mr.article_id_arbitrary,
ac.flat_category,
ac.outfit_slot__belt,
ac.outfit_slot__headwear,
ac.outfit_slot__jacket,
ac.outfit_slot__neckwear,
ac.outfit_slot__over_shirt,
ac.outfit_slot__shirt,
ac.outfit_slot__shoes,
ac.outfit_slot__socks,
ac.outfit_slot__suit,
ac.outfit_slot__tie,
ac.outfit_slot__trousers,
ac.outfit_slot__underwear,
aad.molor_mean_age,
aad.molor_stddev_age,
aad.model_mean_age,
aad.model_stddev_age,
aad.brand_mean_age,
aad.brand_stddev_age,
aaa.all_ages "amidala_age_all_ages",
aaa.under_40 "amidala_age_under_40",
aaa.over_40 "amidala_age_over_40",
abp.brand_over_40,
abp.brand_under_40,
abp.price_high "brand_price_high",
abp.price_medium "brand_price_medium",
abp.price_low "brand_price_low",
ars.year_2015,
ars.year_2014,
ars.year_2013,
ars.year_2012,
ars.year_2011,
ars.year_2010,
ars.year_2009,
ars.season_autumn_winter,
ars.season_spring_summer,
ars.basic_article,
akr.molor_kept,
akr.molor_returned,
akr.model_kept,
akr.model_returned,
akr.catbra_kept,
akr.catbra_returned,
akr.brand_kept,
akr.brand_returned,
akr.flat_category_kept,
akr.flat_category_returned,
a.article_sales_price_de AS sales_price_de,
a.article_brand AS brand,
ap.push_item
FROM
"ml.molor_raw" mr
LEFT JOIN "ml.articles_categories" ac ON ac.article_id = mr.article_id_arbitrary
LEFT JOIN "ml.article_age_distribution" aad ON aad.article_id = mr.article_id_arbitrary
LEFT JOIN "ml.article_amidala_age" aaa ON aaa.article_id = mr.article_id_arbitrary
LEFT JOIN "ml.article_brand_properties" abp ON abp.article_id = mr.article_id_arbitrary
LEFT JOIN "ml.article_season" ars ON ars.article_id = mr.article_id_arbitrary
LEFT JOIN "ml.article_kept_returned" akr ON akr.article_id = mr.article_id_arbitrary
LEFT JOIN "ml.article_push" ap ON ap.article_id = mr.article_id_arbitrary
LEFT JOIN "bi.article" a ON a.article_id = mr.article_id_arbitrary


