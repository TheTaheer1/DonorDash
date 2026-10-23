import { useState } from 'react';
import { Icon } from '../components/Icon';
import { api, apiErrorMessage } from '../api';

export function PasswordResetPage() {
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async event => { event.preventDefault(); setError(''); if (!token) return setError('This reset link is missing its token.'); if (password !== confirm) return setError('Passwords do not match.'); setBusy(true); try { const result = await api.completePasswordReset({ token, password }); setMessage(result.message); } catch (requestError) { setError(apiErrorMessage(requestError)); } finally { setBusy(false); } };
  return <main className="auth-shell"><section className="auth-card"><div className="auth-brand"><span className="brand-mark"><Icon name="heart" size={21} /></span><span>Donor<span>Dash</span></span></div><div className="auth-copy"><span className="eyebrow">ACCOUNT SECURITY</span><h1>Choose a new password.</h1><p>Use at least 8 characters. This reset link is valid for 30 minutes and can only be used once.</p></div>{message ? <><div className="session-message" role="status">{message}</div><a className="primary auth-submit auth-link-button" href="/">Back to log in</a></> : <form className="auth-form" onSubmit={submit}><label>New password<div className="password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} required minLength="8" autoComplete="new-password" placeholder="At least 8 characters" /><button type="button" className="password-toggle" onClick={() => setShowPassword(current => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}><Icon name={showPassword ? 'eye-off' : 'eye'} size={17} /></button></div></label><label>Confirm password<input type={showPassword ? 'text' : 'password'} value={confirm} onChange={event => setConfirm(event.target.value)} required minLength="8" autoComplete="new-password" placeholder="Enter it again" /></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="primary auth-submit" disabled={busy}>{busy ? 'Please wait…' : 'Set new password'}</button></form>}</section><aside className="auth-art"><span className="live-pill"><i /> DONORDASH NETWORK</span><h2>Help someone get<br /><span>home safely.</span></h2><p>Find verified, eligible donors near your hospital in a few quick steps.</p><div className="auth-drop"><Icon name="heart" size={38} /></div></aside></main>;
}
