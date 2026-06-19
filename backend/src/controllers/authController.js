const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

const client = new OAuth2Client()

exports.googleLogin = async (req, res) => {
  try {
    const { idToken, role } = req.body

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google token required',
      })
    }

    // frontend se aaya role validate karo, warna default customer
    const allowedRoles = ['customer', 'seller']
    const userRole = allowedRoles.includes(role) ? role : 'customer'

    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_ANDROID_CLIENT_ID, // native build ka token
        process.env.GOOGLE_CLIENT_ID,          // web client (fallback)
      ],
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
         VALUES (?, ?, ?, ?, ?, 'google')`,
        [name, email, googleId, picture, userRole]
      )

      user = {
        id: result.insertId,
        name,
        email,
        google_id: googleId,
        profile_image: picture,
        role: userRole,
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