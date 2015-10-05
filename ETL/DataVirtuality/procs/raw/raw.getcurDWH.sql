-- Name: raw.getcurDWH
-- Created: 2015-09-04 11:20:40

CREATE VIRTUAL PROCEDURE raw.getcurDWH ()  RETURNS ( cdwh string )
AS 
BEGIN
select  cast (nameInDv as string) as cdwh
        from
            ( exec getCurrentDWH ( ) )a;
END


