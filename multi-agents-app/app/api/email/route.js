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
        from: '"Multi Agent App" <nathancollard1@gmail.com>',  // sender address
        to: "ncollard@openblackbox.be",  // list of receivers
        subject: req.subject,  // Subject line
        html: "<h2><b>Priority Level: </b></h2>" + req.content.priority_level + "<br><br>" + "<h2><b>People concerned: </b></h2>" + req.content.employees_to_inform.join(", ") + "<br><br>" + "<h2><b>Main Topic: </b></h2>" + req.content.main_topic + "<br><br>" + "<h2><b>Explanation: </b></h2>" + req.content.justification + "<br><br>" + "<h2><b>Strategic Plan: </b></h2>" + req.content.strategy + "<br>",  // HTML body content
    });

    res.status(200).json({ message: 'Email sent successfully!' });
    return res;
}
