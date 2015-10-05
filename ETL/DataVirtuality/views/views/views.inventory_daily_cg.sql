-- Name: views.inventory_daily_cg
-- Created: 2015-04-24 18:18:54
-- Updated: 2015-04-24 18:18:54

CREATE VIEW views.inventory_daily_cg
AS
SELECT
	datum,  
	sum(case when cg3 = 'Schuhe' then quantity else 0 end) as c_Schuhe, 
	sum(case when cg3 = 'Outdoor' then quantity else 0 end) as c_Outdoor,	
	sum(case when cg3 = 'Kleinaccessoires' then quantity else 0 end) as c_Kleinaccessoires,
	sum(case when cg3 = 'Schlaf- und Bademode' then quantity else 0 end) as c_schlafbade,
	sum(case when cg3 = 'Konfektion' then quantity else 0 end) as c_Konfektion,
	sum(case when cg3 = 'Schuhpflege' then quantity else 0 end) as c_Schuhpflege,
	sum(case when cg3 = 'Tücher und Schals' then quantity else 0 end) as c_tuecherschals,
	sum(case when cg3 = 'Gürtel' then quantity else 0 end) as c_Guertel,
	sum(case when cg3 = 'Stiefel' then quantity else 0 end) as c_Stiefel,
	sum(case when cg3 = 'Krawatten und Fliegen' then quantity else 0 end) as c_KrawattenFliegen,
	sum(case when cg3 = 'Formal wear accessories' then quantity else 0 end) as c_Formalwearaccessories,
	sum(case when cg3 = 'Kooperationen' then quantity else 0 end) as c_cooperations,
	sum(case when cg3 = 'Oberteile' then quantity else 0 end) as c_Oberteile,
	sum(case when cg3 = 'Handschuhe' then quantity else 0 end) as c_Handschuhe,
	sum(case when cg3 = 'Electronic cases' then quantity else 0 end) as c_Electroniccases,
	sum(case when cg3 = 'Kopfaccessoires' then quantity else 0 end) as c_Kopfaccessoires,
	sum(case when cg3 = 'Hosen' then quantity else 0 end) as c_Hosen,
	sum(case when cg3 = 'Taschen' then quantity else 0 end) as c_Taschen,
	sum(case when cg3 = 'Unterbekleidung' then quantity else 0 end) as c_Unterbekleidung,
	sum(case when cg3 is null then quantity else 0 end) as c_unknowncg3,
	sum(case when cg3 = 'Schuhe' then quantity*purchase_price else 0 end) as v_Schuhe,
	sum(case when cg3 = 'Outdoor' then quantity*purchase_price else 0 end) as v_Outdoor,	
	sum(case when cg3 = 'Kleinaccessoires' then quantity*purchase_price else 0 end) as v_Kleinaccessoires,
	sum(case when cg3 = 'Schlaf- und Bademode' then quantity*purchase_price else 0 end) as v_schlafbade,
	sum(case when cg3 = 'Konfektion' then quantity*purchase_price else 0 end) as v_Konfektion,
	sum(case when cg3 = 'Schuhpflege' then quantity*purchase_price else 0 end) as v_Schuhpflege,
	sum(case when cg3 = 'Tücher und Schals' then quantity*purchase_price else 0 end) as v_tuecherschals,
	sum(case when cg3 = 'Gürtel' then quantity*purchase_price else 0 end) as v_Guertel,
	sum(case when cg3 = 'Stiefel' then quantity*purchase_price else 0 end) as v_Stiefel,
	sum(case when cg3 = 'Krawatten und Fliegen' then quantity*purchase_price else 0 end) as v_KrawattenFliegen,
	sum(case when cg3 = 'Formal wear accessories' then quantity*purchase_price else 0 end) as v_Formalwearaccessories,
	sum(case when cg3 = 'cooperations' then quantity*purchase_price else 0 end) as v_cooperations,
	sum(case when cg3 = 'Oberteile' then quantity*purchase_price else 0 end) as v_Oberteile,
	sum(case when cg3 = 'Handschuhe' then quantity*purchase_price else 0 end) as v_Handschuhe,
	sum(case when cg3 = 'Electronic cases' then quantity*purchase_price else 0 end) as v_Electroniccases,
	sum(case when cg3 = 'Kopfaccessoires' then quantity*purchase_price else 0 end) as v_Kopfaccessoires,
	sum(case when cg3 = 'Hosen' then quantity*purchase_price else 0 end) as v_Hosen,
	sum(case when cg3 = 'Taschen' then quantity*purchase_price else 0 end) as v_Taschen,
	sum(case when cg3 = 'Unterbekleidung' then quantity*purchase_price else 0 end) as v_Unterbekleidung,
	sum(case when cg3 is null then quantity*purchase_price else 0 end) as v_unknowncg3 
FROM 
(
	SELECT 
		seh.sku, 
		cast(date_created as date) as datum, 
		quantity, 
		p.commodity_group3 as cg3, 
		p.purchase_price 
	FROM dwh.stock_entry_history seh
	JOIN views.article a  on a.article_id = sku 
	JOIN views.pim_article p on p.ean = a.article_ean
) as inv 
GROUP BY datum


