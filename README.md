# paypal-to-discord-logs

views/index.ejs is the webpage for the payment form

in index.js, `res.send('asd')` would print `asd` at the success page. I will fix everything else later but this would work. change to `client.guilds.cache.get('<guild id>').channels.cache.get('<channel id>').send(embed);`



`res.send()` will have HTML formatting, eg `<a href = "https://google.com"> this is google </a>`
