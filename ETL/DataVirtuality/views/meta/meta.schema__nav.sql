-- Name: meta.schema__nav
-- Created: 2015-06-16 17:34:33
-- Updated: 2015-06-16 17:34:33

CREATE VIEW meta.schema__nav AS 
SELECT a.* FROM (call SYSADMIN.getResourceDependencies('nav_test', 'schema')) as a


