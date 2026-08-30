import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js'

export const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_6t1sHbu1x",
  client_id: "efrm0n0rfb3iqd31fnaig185l",
  redirect_uri: "https://d84l1y8p4kdic.cloudfront.net",
  response_type: "code",
  scope: "phone openid email",
};

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'eu-north-1_6t1sHbu1x',
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || cognitoAuthConfig.client_id,
}

export const userPool = new CognitoUserPool(poolData)

// ─── Login ──────────────────────────────────────────────────────────────────
export function cognitoLogin(email, password) {
  return new Promise((resolve, reject) => {
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    })

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    })

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => resolve({ cognitoUser, result }),
      onFailure: (err) => reject(err),
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        resolve({
          newPasswordRequired: true,
          cognitoUser,
          userAttributes,
          requiredAttributes,
        })
      },
    })
  })
}

// ─── Complete New Password Challenge ─────────────────────────────────────────
export function cognitoCompleteNewPassword(
  cognitoUser,
  newPassword,
  userAttributes = {},
  requiredAttributes = []
) {
  return new Promise((resolve, reject) => {
    const attrs = {}

    // Include only attributes explicitly required by Cognito challenge
    if (Array.isArray(requiredAttributes) && requiredAttributes.length > 0) {
      requiredAttributes.forEach((attrKey) => {
        const cleanKey = attrKey.replace(/^userAttributes\./, '')
        if (userAttributes[cleanKey] !== undefined) {
          attrs[cleanKey] = userAttributes[cleanKey]
        }
      })
    }

    cognitoUser.completeNewPasswordChallenge(newPassword, attrs, {
      onSuccess: (result) => resolve({ cognitoUser, result }),
      onFailure: (err) => reject(err),
    })
  })
}

// ─── Register ───────────────────────────────────────────────────────────────
export function cognitoRegister(email, password, name) {
  return new Promise((resolve, reject) => {
    const attributeList = [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'name',
        Value: name,
      },
    ]

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

// ─── Confirm Registration ────────────────────────────────────────────────────
export function cognitoConfirmRegistration(email, code) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    })

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

// ─── Resend Confirmation Code ────────────────────────────────────────────────
export function cognitoResendCode(email) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    })

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

// ─── Forgot Password (send code) ────────────────────────────────────────────
export function cognitoForgotPassword(email) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    })

    cognitoUser.forgotPassword({
      onSuccess: (data) => resolve(data),
      onFailure: (err) => reject(err),
    })
  })
}

// ─── Confirm New Password ────────────────────────────────────────────────────
export function cognitoConfirmPassword(email, code, newPassword) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    })

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    })
  })
}

// ─── Get Current User Session ────────────────────────────────────────────────
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser()
    if (!cognitoUser) return resolve(null)

    cognitoUser.getSession((err, session) => {
      if (err || !session.isValid()) return resolve(null)

      cognitoUser.getUserAttributes((attrErr, attributes) => {
        if (attrErr) return resolve({ email: cognitoUser.getUsername() })
        const attrs = {}
        attributes.forEach(({ Name, Value }) => {
          attrs[Name] = Value
        })
        resolve({
          email: attrs.email || cognitoUser.getUsername(),
          name: attrs.name || '',
          sub: attrs.sub || '',
          cognitoUser,
        })
      })
    })
  })
}

// ─── Logout ─────────────────────────────────────────────────────────────────
export function cognitoLogout() {
  const cognitoUser = userPool.getCurrentUser()
  if (cognitoUser) cognitoUser.signOut()
}
