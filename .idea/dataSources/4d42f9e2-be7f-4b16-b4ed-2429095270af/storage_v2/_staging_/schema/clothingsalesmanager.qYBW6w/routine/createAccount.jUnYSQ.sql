create
    definer = root@localhost procedure createAccount(IN customerUserName varchar(30), IN customerPassword varchar(30),
                                                     IN customerName varchar(100), IN customerPhone varchar(11),
                                                     IN customerEmail varchar(30), IN customerAddress varchar(100))
BEGIN
    INSERT INTO Customer ( customerUserName, customerPassword, customerName, customerPhone,customerEmail,customerAddress)  VALUES(customerUserName,customerPassword,customerName,customerPhone,customerEmail,customerAddress);
    SET @customerId = 0;
    SET @customerId = (select customerId from customer order by customerId DESC LIMIT 1);
    INSERT INTO rolecustomerdetails(roleId, customerId)  value (2, @customerId);
END;

