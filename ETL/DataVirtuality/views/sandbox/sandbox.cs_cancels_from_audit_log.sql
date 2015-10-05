-- Name: sandbox.cs_cancels_from_audit_log
-- Created: 2015-06-30 17:32:21
-- Updated: 2015-06-30 17:33:26

CREATE VIEW sandbox.cs_cancels_from_audit_log AS

/* 	currently, cs cancels is coming from salesforce; this is a different approach, but likely not as accurate;
	plus, it has to be manually updated
*/

WITH orders AS
(
SELECT
	persisted_object_id,
	MIN(CAST(a.date_created AS DATE)) AS date_created,
	MIN(CASE
			WHEN property_name = 'dateCanceled' 
				AND actor IN
				( /* THIS LIST NEEDS TO BE UPDATED FOR NEW CUSTOMER SUPPORT PERSONALE */
				'alan.schouten@outfittery.de',
				'amena.zoltani@outfittery.de',
				'caroline.christiansen@outfittery.de',
				'christina.ek@outfittery.de',
				'daniel.schumann@outfittery.de',
				'elisabeth.lengefeldt@outfittery.de',
				'flavia.ostermann@outfittery.de',
				'gregor.becker@outfittery.de',
				'hoang-cam.vu@outfittery.de',
				'jaimie.refo@outfittery.de',
				'janni.bittner@outfittery.de',
				'julia.thierfelder@outfittery.de',
				'lars@outfittery.de',
				'lucie.lauble@outfittery.de',
				'lynsey.sime@outfittery.de',
				'maria.nehme@outfittery.de',
				'mehdi.sangsari@outfittery.de',
				'neele.sippel@outfittery.de',
				'patrick.lueke@outfittery.de',
				'philipp.risse@outfittery.de',
				'roy.roelandt@outfittery.nl',
				'roy@outfittery.de',
				'sandra.jovanovic@outfittery.de',
				'sarah.pawlonka@outfittery.de',
				'sophie.poelchau@outfittery.de',
				'sven.klein@outfittery.de',
				'tolga.tosunoglu@outfittery.de',
				'yanafts@googlemail.com',
				'sarah.juergens@outfittery.de'
				) THEN CAST(a.date_created AS DATE)		
		END) AS date_cancelled
FROM
	postgres.audit_log a
	JOIN
	postgres.customer_order co
		ON a.persisted_object_id = co.id
WHERE
		a.date_created >= '2014-01-01'
	AND co.date_created >= '2014-01-01'
GROUP BY 1
HAVING
	MIN(a.date_created) >= '2014-01-01'
)

SELECT
	date_created,
	COUNT(*) AS orders,
	SUM(CASE WHEN date_cancelled IS NOT NULL THEN 1 END) AS cs_cancels,
	SUM(CASE WHEN date_cancelled IS NOT NULL THEN TIMESTAMPDIFF(SQL_TSI_DAY, date_created, date_cancelled) END) AS total_days_to_cs_cancel
FROM
	orders
GROUP BY 1


