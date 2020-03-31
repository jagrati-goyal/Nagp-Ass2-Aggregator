const express = require('express')
const app = express()
const port = 8090
const request = require('request')
const userSource = process.env.USER_URL || "http://localhost:8080";
const orderSource = process.env.ORDER_URL || "http://localhost:8085";

app.get('/orderdetails/:userId', (req, res) => {
    var userId = req.params.userId;
    console.log(`User Url ` + userSource + '/user/' + userId);
    request(userSource + '/user/' + userId, { json: true }, (err, resp, userBody) => {
        console.log(userBody);
        if (err || !userBody.name) {
	  	    res.send("Error while getting user from "+userSource);
	    } else {
            console.log(`Order URL ` + orderSource + '/orders/' + userId);
            var orderURL = orderSource + '/orders/' + userId;
            request(orderURL, {json: true}, (orderErr, orderResp, orderBody) => {
                console.log(orderBody);
                if (orderErr || !orderBody.orders.length > 0) {
                    res.send("Error while getting order from " +orderSource);
                } else {
                    res.send({
                        userDetails : {
                            name : userBody.name,
                            age : userBody.age,
                            email : userBody.email
                        },
                        orders : orderBody.orders
                    });
                }
            });
        }
    });
});

app.use(express.static('public'))

app.listen(port, () => console.log(`Aggregator app listening on port ${port}!`))