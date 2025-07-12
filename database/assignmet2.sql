-- DATABASE QUERY TOOL
SELECT * FROM inventory
WHERE inv_id = 5;

UPDATE inventory SET inv_year=2019 WHERE inv_id=5;

DELETE FROM inventory WHERE id=5;


SELECT * FROM account;

INSERT INTO account(account_firstname, account_lastname, account_email, account_password)
VALUES(
	'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n'
);

UPDATE account SET account_type='Admin' WHERE account_email= 'tony@starkent.com';

DELETE FROM account WHERE account_id=1;



SELECT * FROM inventory i
JOIN classification c
	ON c.classification_id = i.classification_id
WHERE classification_name = 'Sport';

SELECT * FROM inventory
WHERE inv_make = 'GM';

SELECT * FROM inventory;
