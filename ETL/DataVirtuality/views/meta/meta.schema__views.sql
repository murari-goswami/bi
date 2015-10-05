-- Name: meta.schema__views
-- Created: 2015-04-24 18:17:57
-- Updated: 2015-04-24 18:17:57

CREATE VIEW meta.schema__views AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('views', 'schema')) as a


