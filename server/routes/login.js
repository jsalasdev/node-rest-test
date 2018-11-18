const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const User = require('../models/user');

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        } else {
            if (!user) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Usuario o contraseña incorrecta'
                    }
                });
            } else {
                if (bcrypt.compareSync(body.password, user.password)) {
                    let token = jwt.sign({
                        user
                    }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                    res.json({
                        ok: true,
                        user,
                        token
                    });
                } else {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'Usuario o contraseña incorrecta'
                        }
                    });
                }
            }
        }
    });
});

module.exports = app;