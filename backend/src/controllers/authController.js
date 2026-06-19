const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token required',
      })
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    const googleId = payload.sub
    const email = payload.email
    const name = payload.name
    const picture = payload.picture

    let [users] = await db.query('SELECT * FROM users WHERE email = ?', [email])

    let user

    if (users.length === 0) {
      const [result] = await db.query(
        `INSERT INTO users (name, email, google_id, profile_image, role, auth_provider)
         VALUES (?, ?, ?, ?, 'customer', 'google')`,
        [name, email, googleId, picture]
      )

      user = {
        id: result.insertId,
        name,
        email,
        google_id: googleId,
        profile_image: picture,
        role: 'customer',
      }
    } else {
      user = users[0]

      if (!user.google_id) {
        await db.query(
          'UPDATE users SET google_id = ?, profile_image = ?, auth_provider = ? WHERE id = ?',
          [googleId, picture, 'google', user.id]
        )
      }
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Google login successful',
      token: jwtToken,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Google login failed',
      error: error.message,
    })
  }
}