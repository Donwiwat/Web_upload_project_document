module.exports = (req, res) => {
let email = ""
let password = ""
let surname = ""
let lastname = ""
let studentid = ""
let data = req.flash('data')[0]


if (typeof data != "undefined") {
    email = data.email
    password = data.password
    surname = data.surname
    lastname = data.lastname
    studentid = data.studentid
}


    res.render('register', {
        errors: req.flash('validationErrors'),
        email: email,
        password: password,
        surname: surname,
        lastname: lastname,
        studentid: studentid
    })
}