-- Name: meta.schema__salesforce
-- Created: 2015-04-24 18:17:57
-- Updated: 2015-04-24 18:17:57

CREATE VIEW meta.schema__salesforce AS SELECT a.* FROM (call SYSADMIN.getResourceDependencies('salesforce', 'schema')) as a


