update stage.optimizely_experiments_updates
set skey = id || '_' || extract (epoch from last_modified);

insert into dwh.fact_optimizely_experiments_udpates
select distinct on(skey)
*
from stage.optimizely_experiments_updates
where skey not in (select skey from dwh.fact_optimizely_experiments_udpates );

truncate stage.optimizely_experiments_updates;
