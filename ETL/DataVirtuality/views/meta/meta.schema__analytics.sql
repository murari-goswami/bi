-- Name: meta.schema__analytics
-- Created: 2015-04-24 18:17:57
-- Updated: 2015-04-24 18:17:57

CREATE VIEW meta.schema__analytics AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('analytics', 'schema')) as a


