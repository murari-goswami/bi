-- Name: meta.schema__postgres
-- Created: 2015-04-24 18:17:57
-- Updated: 2015-04-24 18:17:57

CREATE VIEW meta.schema__postgres AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('postgres', 'schema')) as a


