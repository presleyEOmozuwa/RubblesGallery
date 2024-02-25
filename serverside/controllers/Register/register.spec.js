const { expect, it } = require('@jest/globals');
const bcrypt = require('bcrypt');
const app = require('../../app');
const request = require('supertest');
const { connectDB, closeConnection } = require('../../db_connect_test');
const { stripeCustomer } = require('./register-helper');
const User = require('../Models/user-model');
const { Cart, SubCart, Order, OrderArchive, Subscription, SubArchive } = require('../Models/common-model');
const DeletedUser = require('../Models/deleted-user-model');
const LocationTracker = require('../Models/location-tracker-model');
const RefreshToken = require('../Models/refreshToken-model');
const { deletedlist } = require('../MockData/deleted-user-mock-data');
const { cartlist } = require('../MockData/cart-auth-mock.data');
const { subcartlist } = require('../MockData/cart-sub.mock.data');
const { userlist } = require('../MockData/user-mock-data');
const { locationlist } = require('../MockData/location-mock-data');
const { refreshtokenlist } = require('../MockData/refreshtoken-mock-data')
const { orderArchivelist } = require('../MockData/order-archive-mock-data');
const { subscriptionlist } = require('../MockData/sub-mock-data')
const { subArchivelist } = require('../MockData/sub-archive-mock-data')
const { orderlist } = require('../MockData/order.mock.data');


jest.mock('./register-helper');


beforeEach(async () => await connectDB());
afterEach(async () => await closeConnection());

describe("register.js", () => {
    it("should return status code 400 when payload is empty", async () => {

        const { body, statusCode } = await request(app).post('/register').send({
            payload: null
        });

        expect(body.error).toEqual("please provide required fields")
        expect(statusCode).toBe(400);
    })

    it("should return status code 400 when username validation fails", async () => {
        const { body, statusCode } = await request(app).post('/register').send({
            payload: {
                username: "Hen",
                email: "hensleyomozuwa@gmail.com",
                password: "Hook3400",
                terms: true
            }
        });

        expect(statusCode).toBe(400);
    })

    it("should return status code 400  when user's provided email is associated with a deleted account", async () => {
        await DeletedUser.create(deletedlist);
        const { body, statusCode } = await request(app).post('/register').send({
            payload: {
                username: "Smith77",
                email: "smithblake@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });

        expect(body.error).toEqual("email cannot be used for registration, it is associated to a deleted account")
        expect(statusCode).toBe(400);
    })
    
    it("should return status code 400 when user's provided email already exist on the database", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);

        const { body, statusCode } = await request(app).post('/register').send({
            payload: {
                username: "WesleyPongo",
                email: "wesleyomozuwa@gmail.com",
                password: "Wook3400",
                terms: true
            }
        });

        expect(body.error).toEqual("email already in use");
        expect(statusCode).toBe(400);
    })

    it("should return 500 when password hashing fails", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(null);

        const { body, statusCode } = await request(app).post('/register').send({
            payload: {
                username: "Sammy88",
                email: "samadams@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });

        expect(body.error).toEqual("password hashing failed")
        expect(statusCode).toBe(500);
    })

    it("should return status code 500 when registration fails not because of user inputs but due to backend issues", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        
        stripeCustomer.mockResolvedValueOnce({id: "stripe004"})

        jest.spyOn(User, 'create').mockResolvedValueOnce(null);

        const { body, statusCode } = await request(app).post('/register').send({
            payload: {
                username: "Sammy88",
                email: "samadams@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });

        expect(body.error).toEqual("Sorry, try again later")
        expect(statusCode).toBe(500);
    })

    it("should return status code 500 when trying to save user's session id on database fails", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        await LocationTracker.create(locationlist);
        
        stripeCustomer.mockResolvedValueOnce({id: "stripe004"})

        jest.spyOn(LocationTracker, 'create').mockResolvedValueOnce(null);

        const { body, statusCode, } = await request(app).post('/register').send({
            payload: {
                username: "Sammy88",
                email: "samadams@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });
        expect(body.error).toEqual("saving user's sessionId to the database failed");
        expect(statusCode).toBe(500);
    })

    it("should return status code 500 when user's shopping cart creation fails", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        await LocationTracker.create(locationlist);
        await Cart.create(cartlist);

        stripeCustomer.mockResolvedValueOnce({id: "stripe004"})
        
        jest.spyOn(Cart, 'create').mockResolvedValueOnce(null);

        const { body, statusCode, } = await request(app).post('/register').send({
            payload: {
                username: "Sammy88",
                email: "samadams@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });
        expect(body.error).toEqual("user's cart creation failed");
        expect(statusCode).toBe(500);
    })

    it("should return status code 500 when user's subscription cart creation fails", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        await LocationTracker.create(locationlist);
        await Cart.create(cartlist);
        await SubCart.create(subcartlist);
        
        stripeCustomer.mockResolvedValueOnce({id: "stripe004"})
        
        jest.spyOn(SubCart, 'create').mockResolvedValueOnce(null);

        const { body, statusCode, } = await request(app).post('/register').send({
            payload: {
                username: "Sammy88",
                email: "samadams@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });
        expect(body.error).toEqual("subscription cart creation failed");
        expect(statusCode).toBe(500);
    })

    it("should return status code 500 when user's refreshtoken store creation fails", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        await LocationTracker.create(locationlist);
        await Cart.create(cartlist);
        await SubCart.create(subcartlist);
        await RefreshToken.create(refreshtokenlist);
        
        stripeCustomer.mockResolvedValueOnce({id: "stripe004"})

        jest.spyOn(RefreshToken, 'create').mockResolvedValueOnce(null);

        const { body, statusCode, } = await request(app).post('/register').send({
            payload: {
                username: "Sammy88",
                email: "samadams@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });
    
        expect(statusCode).toBe(500);
    })

    it("should return status code 500 when user's order store creation fails", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        await LocationTracker.create(locationlist);
        await Cart.create(cartlist);
        await SubCart.create(subcartlist);
        await RefreshToken.create(refreshtokenlist);
        await Order.create(orderlist)
        
        stripeCustomer.mockResolvedValueOnce({id: "stripe004"})

        jest.spyOn(Order, 'create').mockResolvedValueOnce(null);

        const { body, statusCode, } = await request(app).post('/register').send({
            payload: {
                username: "Sammy88",
                email: "samadams@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });
    
        expect(statusCode).toBe(500);
    })

    it("should return status code 500 when user's order archive store creation fails", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        await LocationTracker.create(locationlist);
        await Cart.create(cartlist);
        await SubCart.create(subcartlist);
        await RefreshToken.create(refreshtokenlist);
        await Order.create(orderlist)
        await OrderArchive.create(orderArchivelist)
        
        stripeCustomer.mockResolvedValueOnce({id: "stripe004"})

        jest.spyOn(OrderArchive, 'create').mockResolvedValueOnce(null);

        const { body, statusCode, } = await request(app).post('/register').send({
            payload: {
                username: "Sammy88",
                email: "samadams@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });
    
        expect(statusCode).toBe(500);
    })

    it("should return status code 500 when user's subscription store creation fails", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        await LocationTracker.create(locationlist);
        await Cart.create(cartlist);
        await SubCart.create(subcartlist);
        await RefreshToken.create(refreshtokenlist);
        await Order.create(orderlist)
        await OrderArchive.create(orderArchivelist)
        await Subscription.create(subscriptionlist)
        
        stripeCustomer.mockResolvedValueOnce({id: "stripe004"})

        jest.spyOn(Subscription, 'create').mockResolvedValueOnce(null);

        const { body, statusCode, } = await request(app).post('/register').send({
            payload: {
                username: "Sammy88",
                email: "samadams@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });
    
        expect(statusCode).toBe(500);
    })

    it("should return status code 500 when user's subscription archive store creation fails", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        await LocationTracker.create(locationlist);
        await Cart.create(cartlist);
        await SubCart.create(subcartlist);
        await RefreshToken.create(refreshtokenlist);
        await Order.create(orderlist)
        await OrderArchive.create(orderArchivelist)
        await Subscription.create(subscriptionlist)
        await SubArchive.create(subArchivelist)
        
        stripeCustomer.mockResolvedValueOnce({id: "stripe004"})

        jest.spyOn(SubArchive, 'create').mockResolvedValueOnce(null);

        const { body, statusCode, } = await request(app).post('/register').send({
            payload: {
                username: "Sammy88",
                email: "samadams@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });
    
        expect(statusCode).toBe(500);
    })

    it("should return status code 200 when user is successfully registered", async () => {
        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        await LocationTracker.create(locationlist);
        await Cart.create(cartlist);
        await SubCart.create(subcartlist);
        await RefreshToken.create(refreshtokenlist);
        await Order.create(orderlist)
        await OrderArchive.create(orderArchivelist)
        await Subscription.create(subscriptionlist)
        await SubArchive.create(subArchivelist)

        stripeCustomer.mockResolvedValueOnce({id: "stripe004"})

        const { body, statusCode, } = await request(app).post('/register').send({
            payload: {
                username: "Sammy88",
                email: "samadams@gmail.com",
                password: "Sook3400",
                terms: true
            }
        });
    
        expect(statusCode).toBe(200);
    })

})