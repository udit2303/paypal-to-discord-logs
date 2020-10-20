  
const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
const Discord = require('discord.js');
const db = require('quick.db');
const client = new Discord.Client();

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AcQH3bwM2FiVd6HPfcFDmB5JB42nmxTVZ31kE1eG1rYy4L3DUvBaobWQCR_fLCWIuJ5cRxd797SE4iTo',
  'client_secret': 'ENcXfye_A932C_p4YWTNXw5IU8Ng6DCWa0PtDXcdShXprFndB1CMbdB4r2dN57xTnPDxOtodDWONExNJ'
});

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.post('/pay', (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Tier 1",
                "sku": "001",
                "price": "50.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "50.00"
        },
        "description": "Tier 1"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
});

});

app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "50.00"
        }
    }]
  };
  
  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
      const pay = payment.id;
      client.on('message', message => {
        const ab = db.fetch(`paypal`);
        for(var n in ab){
        if(pay == ab[n]) return;
      }
      const amount = JSON.stringify(payment.transactions[0].amount.total)
      const cur = JSON.stringify(payment.transactions[0].amount.currency)
      const ver = amount.replace("\"", "");
      const ver2 = ver.replace("\"", "");
      const ver3 = cur.replace("\"", "");
      const ver4 = ver3.replace("\"", "");
      const final = `${ver2} ` + `${ver4}`;
      const embed = new Discord.MessageEmbed()
      .setTitle('New Donation')
      .setColor('BLUE')
      .setDescription(`A new donation has been recieved.`)
      .addField('Transaction ID:', pay , true)
      .addField('Amount:',`**${final}**`, true)
      .addField('Item Purchased:',JSON.stringify(payment.transactions[0].item_list.items[0].name));
        if(message.author.bot) return ;
        message.channel.send(embed);
        db.push(`paypal`, pay);
        
      })
      
        //console.log(JSON.stringify(payment.id));
        console.log(JSON.stringify(payment.transactions[0].amount.total))
        res.send('asd');
    }
});
});
client.on("ready", () => {
  console.log(`\n${client.user.username} ready!`);
  client.user.setActivity(` 123. Use .help for help`, { type : 'WATCHING' });
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

client.login('idk what to put here')
app.get('/cancel', (req, res) => res.send('Cancelled'));

app.listen(3000, () => console.log('Server Started'));
