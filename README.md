# paypal-to-discord-logs

views/index.ejs is the webpage for the payment form

in index.js, `res.send('asd')` would print `asd` at the success page. I will fix everything else later but this would work. Fill out `guild` and `channel` at the starting. They are the guild id and channel id where the message will be send respectively



`res.send()` will have HTML formatting, eg `res.send('<a href = "https://google.com"> this is google </a>')` will create a hyperlink to google with the name 'this is google'


You can change the webpage name by chosing another file inside `/views` by changing `index` inside `res.render('index')` in **Line 24** to with the name of the file you would like. Eg. I want to use paypal.html for this, so I would do `res.render('paypal')`
