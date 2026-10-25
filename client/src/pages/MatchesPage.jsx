import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, apiErrorMessage } from '../api';
import { Icon } from '../components/Icon';
import { PageTitle } from '../components/PageTitle';
import './matches.css';

const active = match => ['OPEN', 'PARTIALLY_FILLED'].includes(match.requestStatus) && new Date(match.deadline) > new Date();

export function MatchesPage({ matches, onRespond, onStatus }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const respond = async (match, answer) => {
    setError(''); setBusy(match.id);
    try { await onRespond(match.id, answer); }
    catch (requestError) { setError(apiErrorMessage(requestError)); }
    finally { setBusy(''); }
  };
  const visible = useMemo(() => matches.filter(match => match.status !== 'DECLINED'), [matches]);
  return <><PageTitle eyebrow="DONOR NETWORK" title="Matched requests" copy="Review compatible requests and decide when you can help." action={<button className="primary" onClick={() => navigate('/')}>← Back to dashboard</button>} />{error && <div className="form-error request-page-error">{error}</div>}<div className="request-list matches-list">{visible.length ? visible.map(match => <div className="request-card" key={match.responseId}><div className="request-card-top"><div className="request-heading"><div className="group-badge large">{match.bloodGroup}</div><div><span className={`badge ${match.status === 'ACCEPTED' || match.status === 'ARRIVED' || match.status === 'DONATED' || match.status === 'VERIFIED' ? 'fulfilled' : active(match) ? 'open' : 'cancelled'}`}>{match.status === 'NOTIFIED' && active(match) ? 'Action needed' : match.status.toLowerCase()}</span><h3>{match.hospital}</h3><p>{match.city}, {match.state} · Needed by {new Date(match.deadline).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</p></div></div></div><div className="card-divider" /><div className="match-summary"><span>{match.unitsConfirmed} of {match.unitsNeeded} units verified</span><span>Request status: {match.requestStatus.toLowerCase()}</span></div>{['ACCEPTED', 'ARRIVED', 'DONATED', 'VERIFIED'].includes(match.status) && match.requester ? <div className="contact-reveal"><strong>Requester contact</strong><span>{match.requester.name}</span><a href={`tel:${match.requester.phone}`}>{match.requester.phone}</a><small>Contact them to coordinate at the hospital. Donation is counted only after hospital/requester verification.</small></div> : null}{match.status === 'NOTIFIED' && active(match) ? <div className="response-actions donor-actions"><button className="accept" disabled={busy === match.id} onClick={() => respond(match, 'accept')}>I can donate</button><button className="decline" disabled={busy === match.id} onClick={() => respond(match, 'decline')}>Cannot help</button></div> : match.status === 'ACCEPTED' ? <div className="response-actions donor-actions"><button className="accept" onClick={() => onStatus(match.id, 'ARRIVED')}>I arrived</button></div> : match.status === 'ARRIVED' ? <div className="response-actions donor-actions"><button className="accept" onClick={() => onStatus(match.id, 'DONATED')}>Donation completed</button></div> : match.status === 'DONATED' ? <div className="expired-note"><Icon name="bell" size={16} /> Waiting for hospital/requester verification.</div> : null}</div>) : <div className="empty-state"><strong>No matched requests</strong><span>Compatible requests will appear here when your donor profile is available.</span></div>}</div></>;
}
