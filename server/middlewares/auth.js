const jwt = require('jsonwebtoken');

let verify = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                error: 'Token no válido'
            });
        }

        req.user = decoded.user;
        next();
    });
};

let verifyAdminRole = (req, res, next) => {

    let user = req.user;

    if (user.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            error: 'Operación no válida'
        });
    } else {
        next();
    }
};

module.exports = {
    verify,
    verifyAdminRole
}