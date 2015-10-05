-- Name: am.o__pics
-- Created: 2015-04-24 18:19:21
-- Updated: 2015-04-24 18:19:21

CREATE VIEW "am.o__pics" AS
SELECT
x.o_id "o_id",
CASE
WHEN x.filename6 IS NOT NULL
THEN x.filename1 || '|' || x.filename2 || '|' || x.filename3 || '|' || x.filename4 || '|' || x.filename5 || '|' || x.filename6
WHEN x.filename5 IS NOT NULL
THEN x.filename1 || '|' || x.filename2 || '|' || x.filename3 || '|' || x.filename4 || '|' || x.filename5
WHEN x.filename4 IS NOT NULL
THEN x.filename1 || '|' || x.filename2 || '|' || x.filename3 || '|' || x.filename4
WHEN x.filename3 IS NOT NULL
THEN x.filename1 || '|' || x.filename2 || '|' || x.filename3
WHEN x.filename2 IS NOT NULL
THEN x.filename1 || '|' || x.filename2
WHEN x.filename1 IS NOT NULL
THEN x.filename1
ELSE NULL
END "pics"
FROM
( SELECT
o.o_id,
assets1.filename "filename1",
assets2.filename "filename2",
assets3.filename "filename3",
assets4.filename "filename4",
assets5.filename "filename5",
assets6.filename "filename6"
FROM "am.object_17" o
LEFT JOIN "am.assets" assets1 ON assets1.id = o.pic1
LEFT JOIN "am.assets" assets2 ON assets2.id = o.pic2
LEFT JOIN "am.assets" assets3 ON assets3.id = o.pic3
LEFT JOIN "am.assets" assets4 ON assets4.id = o.pic4
LEFT JOIN "am.assets" assets5 ON assets5.id = o.pic5
LEFT JOIN "am.assets" assets6 ON assets6.id = o.pic6 ) x


