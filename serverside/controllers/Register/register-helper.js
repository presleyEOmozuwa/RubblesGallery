
const { objCheckerOne } = require('../Utils/obj-checker-utils')

const stripe = require('stripe')(process.env.STRIPE_KEY);
const stripeCustomer = async (email) => {
    const customer = await stripe.customers.create({
        email: email
    });

    // if(!customer || objCheckerOne(customer) === 0){
    //     throw new Error("stripe registration failed")
    // }

    return customer;
}


module.exports = { stripeCustomer }