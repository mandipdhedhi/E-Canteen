// //to,from,subject,text
const mailer = require('nodemailer');

// ///function

const sendingMail = async(to,subject,text) => {

    const transporter = mailer.createTransport({
        service: 'gmail',
        auth:{
            user:"mandipdhedhi18@gmail.com",
            pass:"zpjq hhjx fhxz baop"
        }
    })

    const mailOptions = {
        from: 'mandipdhedhi18@gmail.com',
        to: to,
        subject: subject,
        html: text
        //html:"<h1>"+text+"</h1>"
    }

    const mailresponse = await transporter.sendMail(mailOptions);
    console.log(mailresponse);
    return mailresponse;

}

module.exports ={
    sendingMail
}
// sendingMail("mandipdhedhi18@gmail.com","Test Mail","this is test mail")
