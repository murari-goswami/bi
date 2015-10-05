-- Name: meta.schema__am
-- Created: 2015-04-24 18:17:56
-- Updated: 2015-04-24 18:17:56

CREATE VIEW meta.schema__am AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('am', 'schema')) as a


