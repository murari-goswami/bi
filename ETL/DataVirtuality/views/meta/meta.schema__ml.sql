-- Name: meta.schema__ml
-- Created: 2015-04-24 18:17:56
-- Updated: 2015-04-24 18:17:56

CREATE VIEW meta.schema__ml AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('ml', 'schema')) as a


