import { useState, useCallback } from 'react'
import './LoginPage.css'

const SECRET = 'museumsvertical'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  const canSubmit = username.trim().length > 0

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (!canSubmit) return

      if (username.trim() === SECRET) {
        onLogin()
      } else {
        setError(true)
        setShaking(true)
        setTimeout(() => setShaking(false), 500)
      }
    },
    [username, canSubmit, onLogin],
  )

  return (
    <div className="login-page">
      <div className={`login-card${shaking ? ' login-card--shake' : ''}`}>
        <h1 className="login-card__title">Log in</h1>
        <p className="login-card__subtitle">
          Enter your username and password to access the portal.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Username field */}
          <div
            className={`login-input-group${error ? ' login-input-group--error' : ''}`}
          >
            <span className="login-input-group__icon">
              <i className="fa-regular fa-circle-user" />
            </span>
            <input
              className="login-input-group__input"
              type="text"
              placeholder="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (error) setError(false)
              }}
              autoFocus
            />
          </div>

          {/* Forgot password link */}
          <a
            className="login-form__forgot"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Forgot your password?
          </a>

          {/* Error message */}
          {error && (
            <p className="login-form__error">
              Incorrect credentials. Please try again.
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={`login-form__submit ${canSubmit ? 'login-form__submit--active' : 'login-form__submit--disabled'}`}
            disabled={!canSubmit}
          >
            Continue
          </button>
        </form>
      </div>

      <div className="login-footer">
        &copy;2026 Fever
        <br />
        v. 12.0.2
      </div>
    </div>
  )
}
