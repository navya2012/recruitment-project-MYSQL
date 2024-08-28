
const jwt = require("jsonwebtoken")

const createToken = ({id, role, email}) => {
    return jwt.sign({id, role, email}, process.env.JWT_TOKEN ,{
        expiresIn:"7d"
    })
}

module.exports = createToken