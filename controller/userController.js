import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import User from '../models/userModel.js';

const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;


export const authenticateToken = (req, res, next) => {
    const { token } = req.headers;

    // console.log(req.headers);

    jwt.verify(token, ACCESS_SECRET_KEY, (err, user) => {

        if (err) {
            // console.log(err, err.message);

            res.status(403).json({ msg: 'TOKEN NOT VERIFIED' });
        }
        else {
            // console.log(req.user);
            req.user = user;
            // console.log(req.user);

            // console.log('this user is token verified');
            next();
        }
    });
}


export const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        // console.log(21, user);

        if (user) {
            const match = await bcrypt.compare(password, user.password);

            // console.log(26, match);

            if (match) {
                const accessToken = jwt.sign(user.toJSON(), ACCESS_SECRET_KEY, { expiresIn: '1h' });

                // console.log(32, accessToken);


                return res.status(200).json({ accessToken, user, msg: 'Login successfull' });
            }
            else {
                return res.status(400).json({ msg: 'Password does not match' });
            }
        }
        else {
            return res.status(400).json({ msg: 'Email does not match' });
        }
    }
    catch (err) {
        // console.log(46, err)
        return res.status(500).json({ msg: 'Error while login the user' });
    }
}


export const signupUser = async (req, res) => {

    try {
        const { fullname, email, password, age, gender, mobile } = req.body;

        const user = {
            fullname, email, password, age, gender, mobile
        };

        // jwt.sign wale code me user me toJSON() nhi lgana hai because user plain js object hai jbki 
        // login wale code me jwt sign wale code me user me toJSON() lgana tha because wha pe user
        // plain js object nhi tha , mongoose plain js object return nhi krta hai 

        // toJSON() method mongoose provide krta hai isiliye is method ko mongoose ke returned object pe 
        // hi apply kr skte hai normal js object pe nhi . agar niche wale jwt sign method me user pe 
        // toJSON() apply krenge to error aayega jbki loginUser function me jwt sign method me user 
        // pe toJSON() apply krne pe error nhi aayega 

        const accessToken = jwt.sign(user, ACCESS_SECRET_KEY, { expiresIn: '1h' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;

        const newUser = new User(user);
        // console.log(newUser);

        await newUser.save();
        // console.log(newUser);

        return res.status(200).json({ msg: 'Signup successfull', accessToken, user: newUser });
    }
    catch (err) {
        // console.log(81, err);
        return res.status(500).json({ msg: 'Error while signup the user' });
    }
}

export const premiumUser = (req, res) => {
    // console.log(req.user);
    // console.log(req.headers);

    // console.log('premium user');

    res.status(200).json({ msg: 'This is premium user' });
}


export const rootRoute = (req, res) => {
    res.send('this is dashboard page');
}