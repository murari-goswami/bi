-- Name: meta.schema__bi
-- Created: 2015-04-24 18:17:56
-- Updated: 2015-04-24 18:17:56

CREATE VIEW meta.schema__bi AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('bi', 'schema')) as a


