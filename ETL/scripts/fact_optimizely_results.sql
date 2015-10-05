update stage.optimizely_results
set skey = experiment_id || '_' || goal_id || '_' || variation_id || '_' || extract (epoch from end_time);

insert into dwh.fact_optimizely_results
select * from stage.optimizely_results omr
where omr.skey not in (select skey from dwh.fact_optimizely_results);

delete from stage.optimizely_results omr
where skey in (select skey from dwh.fact_optimizely_results)