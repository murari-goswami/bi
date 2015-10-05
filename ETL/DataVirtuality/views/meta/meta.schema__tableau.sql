-- Name: meta.schema__tableau
-- Created: 2015-04-24 18:17:57
-- Updated: 2015-04-24 18:17:57

CREATE VIEW meta.schema__tableau AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('tableau', 'schema')) as a


