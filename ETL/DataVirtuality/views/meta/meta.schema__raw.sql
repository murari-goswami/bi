-- Name: meta.schema__raw
-- Created: 2015-04-24 18:17:56
-- Updated: 2015-04-24 18:17:56

CREATE VIEW meta.schema__raw AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('raw', 'schema')) as a


