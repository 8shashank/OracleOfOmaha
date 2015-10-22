#Introduction
This is a barebones algorithmic trading platform that allows the user to trade using simple rules. The user can also 
track different stocks and see their values at any given time. On sign up, the user is given a dummy account with a 
fixed amount of cash that they can use to trade.

#Details
The bots trade every five seconds when the stock information updates. The rules are easy to set up. A rule can only be
satisfied once within a time span of 12 hours. This prevents the situation when the bot keeps on buying a fixed amount
 until the user is out of cash.

#Data source
The project uses the Yahoo Finance API to get real-time stock information.

#How to set up
Node.js has to be installed on the user's machine to run this project. First do 

    npm install
    
to install all the dependencies. Then run

    node server.js
    
to run the project. Then go to 

    localhost:8080 
    
to access the application. To add a new user, use the Sign Up link, or 
play around with the account of the test user 'Joe West'. From here, you can now check the balance, add or remove rules,
and track different stocks for any of the bots you wish.
