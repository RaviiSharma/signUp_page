const jwt = require('jsonwebtoken');

const authentication = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']

        if (!token) {
            return res.status(401).send({ status: false, message: "neccessary header token is missing" })
        }
        
        jwt.verify(token, "Project-1", (err, Decoded)=> {
            if(err){ return res.status(403).send("failed authentication")}
          
            // console.log(Decoded)
           req.user=Decoded

        })
        next()
         
    }catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports.authentication = authentication



