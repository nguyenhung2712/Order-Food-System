/* const admin = require('firebase-admin');
const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQwZTFkMjM5MDllNzZmZjRhNzJlZTA4ODUxOWM5M2JiOTg4ZjE4NDUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTmd1eeG7hW4gSMawbmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4Ym9OTnZVbFhuMGFjWEF3aE5wRWR1b0Ntd05oT1JWU25iTzRNRnQ9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVhY3QtY2hhdC10ZXN0LWQ0ZDNiIiwiYXVkIjoicmVhY3QtY2hhdC10ZXN0LWQ0ZDNiIiwiYXV0aF90aW1lIjoxNjg0OTIyNzIxLCJ1c2VyX2lkIjoicnFYYkVhb2JIdVdiV2VUY0NDaW1od3RGWDNYMiIsInN1YiI6InJxWGJFYW9iSHVXYldlVGNDQ2ltaHd0RlgzWDIiLCJpYXQiOjE2ODQ5MjI3MjEsImV4cCI6MTY4NDkyNjMyMSwiZW1haWwiOiJuZ3V5ZW5odW5nMTJjMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNzc4Nzk5MDA5MjU2MTY1NDg0MiJdLCJlbWFpbCI6WyJuZ3V5ZW5odW5nMTJjMUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.gSvXKZvscK28gNy4OMbGvGnZy4OdIHiQ1ut1Jbv1hUdPepOOBFE_A9pRfHAc3_YLZ9683nXqJ5s554zSsZyiqwuS6scjsl5_souK0ljbiwnTalwlWAI9KeWUd9z70henISY7_9zxZTuWr94_sjl-2gBv_35omp2kEJcOdXrZbTM5O-URLmsl_oADHYxNlpAfMpvX6uAnQ-MJ1DRdKHlSyDiNRZy_F-iRL9i-IQQAufWOrmvJGrGqKhyF0wDjAyQbNahJjSRqvEcgGwfAW2WFzwxPqtWXePtjsCAjyZWy_hC6FWcDOPuLE_XRFPmpRQCSu0beLtGz2IGrKkjl2rkGSw'
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://react-chat-test-d4d3b-default-rtdb.asia-southeast1.firebasedatabase.app'
});

admin.auth().verifyIdToken(token)
    .then((decodedToken) => {

        console.log(decodedToken);
    })
    .catch(err => {
        console.log(err);
    }) */