require('dotenv').config()
const express = require ('express')
const app = express();
port = process.env.PORT || 7001

app.use(express.json())
app.use(express.static('public'))

const stripe = require ('stripe')(process.env.STRIPE_PRIVATE_KEY)
const storeItems = new Map([
    [1,  {priceInCents: 7000, name: 'stripe crash course'}],
    [2,  {priceInCents: 897000, name: 'backend crash course'}]
])

app.listen(port, ()=>{
    console.log(`app started running on ${port} successfully`)
})
app.post('/creating payment', async(req, res)=>{
    try{
        const session = stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item=>{
                const storeItem = storeItems.get(item.id)
                return{
                    pricing_data:{
                        currency: 'nga',
                        product_data:{ 
                            name: storeItem.name,
                        },
                        unit_amount: storeItem.priceInCents

                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.SERVER_URL}/success.html`,
            cancel_url: `${process.env.SERVER_URL}/cancel.html`,

        })
        res.json({url: session.url})

    } catch(e){
           res.status(500).json({ error: e.message })
    }
})