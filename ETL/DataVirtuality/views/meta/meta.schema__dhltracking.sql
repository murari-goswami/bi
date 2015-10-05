-- Name: meta.schema__dhltracking
-- Created: 2015-04-24 18:17:57
-- Updated: 2015-04-24 18:17:57

CREATE VIEW meta.schema__dhltracking AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('dhltracking', 'schema')) as a


