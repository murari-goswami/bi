-- Name: meta.schema__snowplow
-- Created: 2015-04-24 18:17:57
-- Updated: 2015-04-24 18:17:57

CREATE VIEW meta.schema__snowplow AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('snowplow', 'schema')) as a


