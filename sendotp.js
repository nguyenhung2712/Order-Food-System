/* 
const accountSid = "ACee65355833b031a9d8d6dc56abb00aa9";
const authToken = "faddea7b6c348c3bb65af238f0f3afbb";
const verifySid = "VA344222967bf39f79cccb4f78d348a64d";
const client = require("twilio")(accountSid, authToken);

client.verify.v2
    .services(verifySid)
    .verifications.create({ to: "+84706096936", channel: "sms" })
    .then((verification) => console.log(verification.status))
    .then(() => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        readline.question("Please enter the OTP:", (otpCode) => {
            client.verify.v2
                .services(verifySid)
                .verificationChecks.create({ to: "+84706096936", code: otpCode })
                .then((verification_check) => console.log(verification_check.status))
                .then(() => readline.close());
        });
    }); */