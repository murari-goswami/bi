-- Name: views.supplier_article_categories
-- Created: 2015-04-24 18:18:04
-- Updated: 2015-04-24 18:18:04

CREATE view views.supplier_article_categories
AS

SELECT 
  distinct t1.supplier_article_id,
  t1.gender,
  /*Category-1*/
  INITCAP(case
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2)= 'premium' then t1.cat3
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2) in ('sport','sports') then t1.cat3
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2)!= 'premium' then t1.cat2
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2) not in ('sport','sports') then t1.cat2
    else t1.cat1
  end) as "cat1", 
  INITCAP(case 
    when t1.cat2 = 'anzüge' and lower(t1.cat3) = 'businesshemden' then 'hemden'
    when t1.cat2 = 'anzüge' and lower(t1.cat3) = 'krawatten & accessoires' then 'krawatten & accessoires' 
    when t1.cat2 = 'bademode' and lower(t1.cat3) = 'bademäntel' then 'wäsche'
    when t1.cat2 = 'hosen' and lower(t1.cat3) = 'badeshorts' then 'bade- & surfmode'
    when t1.cat2 = 'bade- & surfmode' and lower(t1.cat3) = 'bademäntel' then 'wäsche'
    when t1.cat2 = 'bademode' and lower(t1.cat3) = 'badeshorts' then 'bade- & surfmode'
    when t1.cat2 = 'bademode' then 'bade- & surfmode'
    when t1.cat2 = 'boots/stiefel' then 'boots / stiefel' 
    when t1.cat2 = 'brillen' and lower(t1.cat3) = 'sonnenbrillen' then 'sport- & sonnenbrillen' 
    when t1.cat2 = 'business-schuhe' and lower(t1.cat3) = 'slipper' then 'slipper'
    when t1.cat2 = 'business-schuhe' then 'business schuhe' 
    when t1.cat2 = 'funktionswäsche' and lower(t1.cat3) = 'hosen lang' then 'wäsche' 
    when t1.cat2 = 'funktionswäsche' and lower(t1.cat3) = 'shirts' then 'shirts'  
    when t1.cat2 = 'geldbörsen' then 'geldbörsen & etuis' 
    when t1.cat2 = 'halbschuhe' and lower(t1.cat3) = 'slipper' then 'business schuhe'
    when t1.cat2 = 'handschuhe & schals' then 'handschuhe' 
    when t1.cat2 = 'shirts' and lower(t1.cat3) = 'hemden' then 'hemden'
    when t1.cat2 = 'hosen' and lower(t1.cat3) = 'gürtel' then 'gürtel'
    when t1.cat2 = 'wäsche' and lower(t1.cat3) = 'hosen kurz' then 'hosen' 
    when t1.cat2 = 'jacken' and lower(t1.cat3) = 'westen' then 'jacken & westen'
    when t1.cat2 = 'jacken' and lower(t1.cat3) = 'sakkos' then 'jacken / sakkos'
    when t1.cat2 = 'jacken / sakkos' and lower(t1.cat3) ='winterjacken' then 'jacken'
    when t1.cat2 = 'jacken / sakkos' and lower(t1.cat3) ='leichte jacken' then 'jacken'
    when t1.cat2 = 'jacken & westen' and lower(t1.cat3) = 'trainingsjacken' then 'jacken'
    when t1.cat2 = 'jacken & westen' and lower(t1.cat3) = 'fleecejacken' then 'jacken'
    when t1.cat2 = 'jacken / sakkos' and lower(t1.cat3) ='lederjacken' then 'jacken'
    when t1.cat2 = 'jacken / sakkos' and lower(t1.cat3) ='leichte jacken' then 'jacken'
    when t1.cat2 = 'jacken & westen' and lower(t1.cat3) = 'winterjacken & -mäntel' then 'winterjacken'
    when t1.cat2 = 'jacken / sakkos' and lower(t1.cat3) = 'winterjacken & -mäntel' then 'winterjacken'
    when t1.cat2 = 'jacken' and lower(t1.cat3) = 'winterjacken & -mäntel' then 'winterjacken'
    when t1.cat2 = 'mäntel' and lower(t1.cat3) = 'winterjacken & -mäntel' then 'winterjacken'
    when t1.cat2 = 'jacken & westen' and lower(t1.cat3) = 'westen' then 'jacken & westen'
    when t1.cat2 = 'kopfbedeckungen' then 'hüte / mützen' 
    when t1.cat2 = 'krawatten & accessoires' then 'krawatten & accessoires' 
    when t1.cat2 = 'mützen' then 'hüte / mützen' 
    when t1.cat2 = 'offene schuhe' and lower(t1.cat3) = 'zehentrenner' then 'offene schuhe'
    when t1.cat2 = 'offene schuhe' then 'offene schuhe'
    when t1.cat2 = 'outdoorschuhe' and lower(t1.cat3) = 'hikingschuhe' then 'wander- & bergschuhe'
    when t1.cat2 = 'pullover & strickjacken' and lower(t1.cat3) = 'kapuzenpullover' then 'pullover'
    when t1.cat2 = 'pullover & strickjacken' and lower(t1.cat3) = 'fleecepullover' then 'pullover'
    when t1.cat2 = 'pullover & strickjacken' and lower(t1.cat3) = 'sweatjacken' then 'sweater'
    when t1.cat2 = 'pullover & strickjacken' and lower(t1.cat3) = 'strickpullover' then 'strick'
    when t1.cat2 = 'pullover & strickjacken' and lower(t1.cat3) = 'strickjacken' then 'strick'
    when t1.cat2 = 'pullover & strickjacken' and lower(t1.cat3) = 'sweatshirts' then 'sweater'
    when t1.cat2 = 'pullover & strickjacken' then 'strick'
    when t1.cat2 = 'pullover & sweater' and lower(t1.cat3) = ' kapuzenpullover' then 'pullover' 
    when t1.cat2 = 'pullover & sweater' and lower(t1.cat3) = ' fleecepullover' then 'pullover' 
    when t1.cat2 = 'pullover & sweater' and lower(t1.cat3) = 'sweatjacken' then 'sweater'
    when t1.cat2 = 'pullover & sweater' then 'pullover' 
    when t1.cat2 = 'rucksäcke' then 'taschen & koffer' 
    when t1.cat2 = 'sandalen & zehentrenner' then 'offene schuhe' 
    when t1.cat2 = 'sandalen / pantoletten' then 'offene schuhe' 
    when t1.cat2 = 'schmuck' and lower(t1.cat3) = 'halsketten' then 'uhren & schmuck'
    when t1.cat2 = 'schmuck' then 'uhren & schmuck' 
    when t1.cat2 = 'schnürschuhe' and lower(t1.cat3) = 'bootsschuhe' then 'boots / stiefel'
    when t1.cat2 = 'schnürer' then 'schnürschuhe' 
    when t1.cat2 = 'schuhzubehör' then 'schuhzubehör' 
    when t1.cat2 = 'slipper' and lower(t1.cat3) = 'null' then 'slipper' 
    when t1.cat2 = 'socken & strümpfe' then 'socken & strümpfe' 
    when t1.cat2 = 'sonnenbrillen' then 'sport- & sonnenbrillen' 
    when t1.cat2 = 'sport- & sonnenbrillen' and lower(t1.cat3) = 'sonnenbrillen' then 'sport- & sonnenbrillen' 
    when t1.cat2 = 'sportuhren' and lower(t1.cat3) = 'zeitmesser' then 'sportuhren & elektronik' 
    when t1.cat2 = 'sportuhren' then 'sportuhren & elektronik' 
    when t1.cat2 = 'sportuhren & elektronik' then 'sportuhren & elektronik' 
    when t1.cat2 = 'stiefel & boots' and lower(t1.cat3) = 'snowboots' then 'boots / stiefel'
    when t1.cat2 = 'stiefel & boots' and lower(t1.cat3) = 'trekkingstiefel' then 'outdoorschuhe'
    when t1.cat2 = 'stiefel & boots' then 'boots / stiefel' 
    when t1.cat2 = 'strick / sweat' and lower(t1.cat3) = 'strickjacken' then 'strick'
    when t1.cat2 = 'strick / sweat' and lower(t1.cat3) = 'strickpullover' then 'strick'
    when t1.cat2 = 'strick / sweat' and lower(t1.cat3) = 'sweatshirts' then 'sweater'
    when t1.cat2 = 'strick / sweat' and lower(t1.cat3) = 'sweatjacken' then 'sweater'
    when t1.cat2 = 'strick / sweat' then 'sweater' 
    when t1.cat2 = 'strümpfe' then 'socken & strümpfe' 
    when t1.cat2 = 'taschen' and lower(t1.cat3) = 'rucksäcke' then 'taschen & koffer'
    when t1.cat2 = 'taschen' and lower(t1.cat3) = 'umhängetaschen' then 'taschen & koffer'
    when t1.cat2 = 'taschen' then 'taschen & koffer' 
    when t1.cat2 = 'tennisschuhe' then 'tennis- & golfschuhe' 
    when t1.cat2 = 'trainings- & hallenschuhe' then 'trainings- & hallenschuhe' 
    when t1.cat2 = 'trainingsanzüge' then 'trainingsanzüge' 
    when t1.cat2 = 'trikots & fanartikel' then 'trikots & fanartikel' 
    when t1.cat2 = 'tücher & schals' then 'tücher / schals'  
    when t1.cat2 = 'tücher/schals' then 'tücher / schals' 
    when t1.cat2 = 'uhren' then 'uhren & schmuck' 
    when t1.cat2 = 'umhängetaschen' then 'taschen & koffer' 
    when t1.cat2 = 'unterwäsche' and lower(t1.cat3) = 'shirts' then 'shirts'
    when t1.cat2 = 'unterwäsche' then 'wäsche' 
    else t1.cat2 
  end) as "category2",
  /*Category-2*/
  INITCAP(case
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2)= 'premium' then t1.cat4
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2) in ('sport','sports') then t1.cat4
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2)!= 'premium' then t1.cat3
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2) not in ('sport','sports') then t1.cat3
    when lower(t1.cat2) = 'Mützen Hüte & Caps' THEN 'Mützen, Hüte & Caps'
    else t1.cat2
  end) as "cat2", 
  /*Category-3*/
  INITCAP(replace(case
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2)= 'premium' then t1.cat5
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2) in ('sport','sports') then t1.cat5
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2)!= 'premium' then t1.cat4
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2) not in ('sport','sports') then t1.cat4
    else t1.cat3
  end,' Alle',''))as "cat3",
  INITCAP(case  
    when lower(t1.cat3) =  'sporttaschen' then  'sport- & reisetaschen' 
    when lower(t1.cat3) =  'winterjacken' then  'winterjacken & -mäntel' 
    when lower(t1.cat3) =  'winterjacken & -mäntel' then  'winterjacken & -mäntel' 
    when lower(t1.cat3) =  'wintermäntel' then  'winterjacken & -mäntel' 
    else lower(t1.cat3) 
  end) as "category3",
  /*Category-4*/
  INITCAP(case
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2)= 'premium' then null
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2) in ('sport','sports') then null
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2)!= 'premium' then null
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2) not in ('sport','sports') then null
    else t1.cat4
  end) as "cat4", 
  /*Category-5*/
  INITCAP(case
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2)= 'premium' then null
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2) in ('sport','sports') then null
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2)!= 'premium' then null
    when lower(t1.cat1) IN ('sale','premium','sport','sports') and lower(t1.cat2) not in ('sport','sports') then null
    else t1.cat5
  end) as "cat5"
FROM
(
  SELECT
  supplier_article_id,
  gender,
  replace(lower(cat1),'herren','') as cat1,
  replace(lower(cat2),'herren','') as cat2,
  replace(lower(cat3),'herren','') as cat3,
  replace(lower(cat4),'herren','') as cat4,
  replace(lower(cat5),'herren','') as cat5,
  replace(lower(cat6),'herren','') as cat6,
  replace(lower(cat7),'herren','') as cat7
  from
  (
  	/*Split columns based on delimiter '>', column values assigns amidala category if own stock or else z-categories*/
    SELECT
      a.supplier_article_id,
      CASE
        WHEN a.amidala_categories IS NOT NULL THEN replace(a.amidala_categories,',','')
        WHEN a.amidala_categories IS NULL AND a.category_breadcrumbs IS NULL AND a.category IS NOT NULL THEN replace(a.category,',','')
        WHEN a.amidala_categories IS NULL AND a.category_breadcrumbs IS NOT NULL THEN replace(a.category_breadcrumbs,',','')
    END as category1
  FROM views.article a
  )a1,
  texttable (a1.category1 columns gender string, cat1 string,cat2 string,cat3 string,cat4 string,cat5 string,cat6 string,cat7 string delimiter '>') t
)t1


