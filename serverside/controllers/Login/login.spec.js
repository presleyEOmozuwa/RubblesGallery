const { expect, it } = require('@jest/globals');
const bcrypt = require('bcrypt');
const app = require('../../app');
const request = require('supertest');
const { connectDB, closeConnection } = require('../../db_connect_test');
const User = require('../Models/user-model');
const DeletedUser = require('../Models/deleted-user-model');
const BlockedUser = require('../Models/blocked-user-model');
const LocationTracker = require('../Models/location-tracker-model');
const RefreshToken = require('../Models/refreshToken-model');
const { deletedlist } = require('../MockData/deleted-user-mock-data');
const { blockedlist } = require('../MockData/block-mock-data');
const { userlist } = require('../MockData/user-mock-data');
const { locationlist } = require('../MockData/location-mock-data');
const { refreshtokenlist } = require('../MockData/refreshtoken-mock-data')
const speakeasy = require('speakeasy');


beforeEach(async () => await connectDB());
afterEach(async () => await closeConnection());

describe("Login.js", () => {
    it("should return status code 400 when payload is empty", async () => {
        const { body, statusCode } = await request(app).post('/login/payload').send({});

        expect(body.error).toEqual("email and password fields are required")
        expect(statusCode).toBe(400);
        console.log(body);
        console.log(statusCode);
    })

    it("should return status code 400 when user's provided email is associated to a closed account", async () => {
        await DeletedUser.create(deletedlist);

        const { body, statusCode } = await request(app).post('/login/payload').send({
            email: "smithblake@gmail.com",
            password: "Sook3400"
        });

        expect(body.error).toEqual("email is associated to a closed account")
        expect(statusCode).toBe(400);
        console.log(body);
        console.log(statusCode);
    })

    it("should return status code 400 when user's provided email is associated to a blocked account", async () => {
        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);

        const { body, statusCode } = await request(app).post('/login/payload').send({
            email: "wesleyomozuwa@gmail.com",
            password: "Wook3400"
        });

        expect(body.error).toEqual("email is associated to a blocked account")
        expect(statusCode).toBe(400);
        console.log(body);
        console.log(statusCode);
    })

    it("should return status code 400 when user's provided email is invalid", async () => {
        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);
        await User.create(userlist);

        const { body, statusCode } = await request(app).post('/login/payload').send({
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400"
        });

        expect(body.error).toEqual("invalid email or password")
        expect(statusCode).toBe(400);
        console.log(body);
        console.log(statusCode);
    })

    it("should return status code 400 when user's provided password is invalid", async () => {
        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(null);

        const { body, statusCode } = await request(app).post('/login/payload').send({
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400"
        });

        expect(body.error).toEqual("invalid email or password")
        expect(statusCode).toBe(400);
        console.log(body);
        console.log(statusCode);
    })

    it("should return status code 500 when otp token generation fails", async () => {
        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

        jest.spyOn(speakeasy, 'totp').mockReturnValueOnce(null);

        const { body, statusCode } = await request(app).post('/login/payload').send({
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400"
        });

        expect(body.error).toEqual("otp token generation failed");
        expect(statusCode).toBe(500);
        console.log(body);
        console.log(statusCode);
    })

    it("when user ENABLES TWO FACTOR AUTHENTICATION, send an OTP for further LOGIN VERIFICATION and return status code 200 when it is successfully sent", async () => {
        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);
        const users = await User.create(userlist);
        const locs = await LocationTracker.create(locationlist);
        locs[2].set({
            userId: users[2]._id
        })
        await locs[2].save();


        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
        
        const { body, statusCode } = await request(app).post('/login/payload').send({
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400",
            useToken: "use token",
            rememberMe: ""
        });

        expect(statusCode).toBe(200);
        console.log(body);
        console.log(statusCode);
    })

    it("when user ENABLES [remembeMe] checkbox, and his login SESSIONID MATCHES the one on DATABASE, generate JWT TOKEN with INCREASED EXPIRY TIME from the previous, and return status code 200 when it is successfully sent", async () => {
        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);
        
        const users = await User.create(userlist);
        
        const locs = await LocationTracker.create(locationlist);
        locs[2].set({
            userId: users[2]._id
        })
        await locs[2].save();
        
        const tokens = await RefreshToken.create(refreshtokenlist);
        
        tokens[2].set({
            userId: users[2]._id
        })
        await tokens[2].save();
        
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

        const { body, statusCode } = await request(app).post('/login/payload').send({
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400",
            useToken: " ",
            rememberMe: "remember me"
        });

        expect(statusCode).toBe(200);
        console.log(body);
        console.log(statusCode);
        console.log("The first")
    })

    it("when user DISABLES [remembeMe] checkbox, but his login SESSIONID MATCHES the one ON DATABASE, generate and send JWT TOKEN, return status code 200 when it is successfully sent", async () => {
        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);
        
        const users = await User.create(userlist);
        
        const locs = await LocationTracker.create(locationlist);
        locs[2].set({
            userId: users[2]._id
        })
        await locs[2].save();
        
        const tokens = await RefreshToken.create(refreshtokenlist);
        
        tokens[2].set({
            userId: users[2]._id
        })
        await tokens[2].save();
        
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

        const { body, statusCode } = await request(app).post('/login/payload').send({
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400",
            useToken: " ",
            rememberMe: " "
        });

        expect(statusCode).toBe(200);
        console.log(body);
        console.log(statusCode);
        console.log("The Second")
    })

    it("when user DISABLES [remembeMe] checkbox, and his login SESSIONID DO NOT MATCH the one ON DATABASE, send an OTP for further AUTHENTICATION and return status code 200 when it is successfully sent",  async () => {
        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);
        
        const users = await User.create(userlist);
        
        const tokens = await RefreshToken.create(refreshtokenlist);
        
        tokens[2].set({
            userId: users[2]._id
        })
        await tokens[2].save();
        
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

        jest.spyOn(LocationTracker, 'findOne').mockResolvedValueOnce(null);

        const { body, statusCode } = await request(app).post('/login/payload').send({
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400",
            useToken: "",
            rememberMe: ""
        });

        expect(statusCode).toBe(200);
        console.log(body);
        console.log(statusCode);
        console.log("The Third")
    })

})