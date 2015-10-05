-- Name: meta.schema__pim
-- Created: 2015-04-24 18:17:57
-- Updated: 2015-04-24 18:17:57

CREATE VIEW meta.schema__pim AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('pim', 'schema')) as a


