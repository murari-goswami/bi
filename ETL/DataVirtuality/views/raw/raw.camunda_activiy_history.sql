-- Name: raw.camunda_activiy_history
-- Created: 2015-08-04 16:29:03
-- Updated: 2015-08-04 16:29:03

CREATE view raw.camunda_activiy_history
AS

SELECT 
  row_number() over(partition by execution_id_ order by start_time_ desc) as rank,
  execution_id_ as execution_id,
  act_name_ as activiti_name,
  act_type_ as activiti_type,
  start_time_ as start_time,
  end_time_ as end_time,
  duration_ as duration
FROM camunda.act_hi_actinst


