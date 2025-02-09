import {Injectable} from '@nestjs/common';
import {OAuth2Client} from "google-auth-library";
import {User} from "./entities/user.entity";
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import * as crypto from 'crypto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }

    private googleClient = new OAuth2Client(process.env.CLIENT_ID);  // Replace with your Google Client ID

    async verifyGoogleToken(idToken: string) {
        const ticket = await this.googleClient.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID, // Replace with your Client ID
        });

        const payload = ticket.getPayload();
        return payload; // The payload contains the user's information from Google
    }

    // Generate JWT token
    private generateJwtToken(user: User) {
        const payload = {email: user.email, sub: user.id};
        return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});
    }

    // Generate random verification token
    private generateVerificationToken() {
        return crypto.randomBytes(32).toString('hex');
        //return Math.random().toString(36).substr(2);  // Just a basic example, replace with a better method
    }


    async loginOrSignup(googlePayload: any) {
        const {email, name, sub} = googlePayload;

        // Check if user already exists in the database
        let user = await this.userRepository.findOne({where: {email: email}});

        if (!user) {
            // If the user doesn't exist, create a new user
            user = await this.userRepository.save({
                emailVerified: false,
                email: email,
                verificationToken: this.generateVerificationToken(),
                fullName: name,
                googleId: sub,
            });

            // Send email verification (for simplicity, assume you handle this separately)
            // await this.sendEmailVerification(user);
            // Here you can send a JWT token or any other response as needed
        }

        // To Generate JWT token
        const token = this.generateJwtToken(user);

        return {token, user};
    }


    async sendVerificationEmail(user: User) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password',
            },
        });

        const verificationToken = 'SOME_VERIFICATION_TOKEN';  // Generate a verification token
        const verificationLink = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: user.email,
            subject: 'Email Verification',
            text: `Click on the following link to verify your email: ${verificationLink}`,
        };

        await transporter.sendMail(mailOptions);
    }

    async verifyEmail(token: string) {
        // Validate token and mark the user as verified
        // In a real scenario, you would decode the token and verify it
        // Here we assume the token is valid and mark the user as verified

        // Update user in the database to set emailVerified = true
        const user = await this.userRepository.findOne({where: {verificationToken: token}});
        if (user) {
            await this.userRepository.update(user.id, {
                emailVerified: true
            });
            return {message: 'Email successfully verified!'};
        } else {
            return {message: 'Invalid or expired verification link.'};
        }
    }
}
