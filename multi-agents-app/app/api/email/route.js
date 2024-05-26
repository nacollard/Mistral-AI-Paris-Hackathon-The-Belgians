// pages/api/sendEmail.js
import nodemailer from 'nodemailer';

export async function POST(request) {
    const req = await request.json()

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",  // e.g., smtp.gmail.com for Gmail
        port: 587,
        secure: false,  // true for 465, false for other ports
        auth: {
            user: 'nathancollard1@gmail.com',  // your email
            pass: 'gsvk jssw puqn vjpl',  // your email password
        },
    });

    let info = await transporter.sendMail({
        from: '"Multi Agent" <nathancollard1@gmail.com>',  // sender address
        to: "ncollard@openblackbox.be",  // list of receivers
        subject: req.subject,  // Subject line
        text: "Hello this is a pure text",  // plain text body
        html: `<b>Just a text</b>`,  // HTML body content
    });

    res.status(200).json({ message: 'Email sent successfully!' });
    return res;
}
