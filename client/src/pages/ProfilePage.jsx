import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { PageTitle } from '../components/PageTitle';
import { groups, age } from '../features/requests/constants';

const formatDate = date => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);

export function ProfilePage({ profile, accountType = 'BOTH', onSave, onLogout, onDeleteAccount }) {
  const [draft, setDraft] = useState({ healthEligible: false, ...profile });
  useEffect(() => { setDraft({ healthEligible: false, ...profile }); }, [profile]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);
  const eligibility = useMemo(() => {
    if (!draft.last) return { date: null, days: 0 };
    const gap = draft.gender === 'Female' ? 120 : 90;
    const date = new Date(`${draft.last}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + gap);
    return { date, days: Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86400000)) };
  }, [draft.last, draft.gender]);
  const update = event => setDraft(current => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const save = event => { event.preventDefault(); onSave(draft); };
  const eligibleNow = !eligibility.date || eligibility.days === 0;
  const isRequesterOnly = accountType === 'REQUESTER';

  return <>
    <PageTitle eyebrow="YOUR PROFILE" title={isRequesterOnly ? "Requester profile" : "Donor profile"} copy={isRequesterOnly ? "Keep your contact and request details current." : "Keep your details current so the right request can find you."} />
    <form className="profile-layout" onSubmit={save}>
      <div className="profile-panel">
        <div className="profile-intro"><div className="profile-avatar">{draft.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</div><div><h3>{draft.name}</h3><p>{draft.email}</p></div><span className="verified"><Icon name="check" size={14} /> Verified</span></div>
        <div className="card-divider" />
        <div className="form-section">
          <h3>Personal details</h3>
          <div className="field-row"><label>Full name<input name="name" value={draft.name} onChange={update} /></label><label>Email address<input name="email" value={draft.email} onChange={update} /></label></div>
          <div className={isRequesterOnly ? 'field-row requester-single-field' : 'field-row'}><label>Phone number<input name="phone" value={draft.phone} onChange={update} /></label>{!isRequesterOnly && <label>Date of birth<input type="date" name="dob" value={draft.dob} onChange={update} /></label>}</div>
        </div>
        <div className="form-section">
          <h3>{isRequesterOnly ? 'Request details' : 'Donation details'}</h3>
          <div className="field-row"><label>Blood group<select name="group" value={draft.group} onChange={update}>{groups.map(group => <option key={group}>{group}</option>)}</select></label><label>Gender<select name="gender" value={draft.gender} onChange={update}><option>Female</option><option>Male</option><option>Other</option></select></label></div>
          <div className="field-row"><label>City<input name="city" value={draft.city} onChange={update} required /></label><label>State<input name="state" value={draft.state || ''} onChange={update} required placeholder="Maharashtra" /></label></div>
          {!isRequesterOnly && <><div className="field-row"><label>Last donation date<input type="date" name="last" value={draft.last} onChange={update} /><small className="donation-eligibility-note">{eligibility.date ? (eligibleNow ? 'You are eligible to donate again.' : `Eligible again on ${formatDate(eligibility.date)} · ${eligibility.days} day${eligibility.days === 1 ? '' : 's'} remaining.`) : 'Added automatically after a verified donation.'}</small></label></div><label className="toggle-row"><span><strong>Available to donate</strong><small>Allow DonorDash to notify you for compatible requests</small></span><input type="checkbox" name="available" checked={draft.available} onChange={update} /><i /></label><label className="health-confirm"><input type="checkbox" name="healthEligible" checked={draft.healthEligible} onChange={update} /><span><strong>Health eligibility confirmed</strong><small>I confirm I currently have no known condition or medication that prevents blood donation. A medical professional must make the final decision.</small></span></label></>}
        </div>
        <div className="privacy-section"><h3>Privacy</h3><p>{isRequesterOnly ? 'Your contact details are used to coordinate your blood requests and are shared only through the request workflow.' : 'Your phone number stays private until you accept a request. Health eligibility is used only for donor matching and is not shown publicly.'}</p></div>
      </div>
      <aside className="profile-side">
        {!isRequesterOnly && <div className="eligibility-card"><div className="eligible-icon"><Icon name="heart" size={21} /></div><span className={`badge ${draft.healthEligible && eligibleNow ? 'open' : 'partially_filled'}`}>{draft.healthEligible && eligibleNow ? 'ELIGIBLE TO MATCH' : eligibility.date && !eligibleNow ? 'DONATION GAP ACTIVE' : 'SCREENING NEEDED'}</span><h3>{draft.healthEligible && eligibleNow ? "You're ready to help." : eligibility.date && !eligibleNow ? 'Please wait before donating again.' : 'Complete health screening.'}</h3><p>{draft.healthEligible && eligibleNow ? 'Your profile can be considered for compatible requests.' : eligibility.date && !eligibleNow ? `You can be matched again in ${eligibility.days} day${eligibility.days === 1 ? '' : 's'}.` : 'Confirm your health eligibility before DonorDash can match you with a request.'}</p><div className="eligibility-line"><span>Age</span><strong>{age(draft.dob)} years</strong></div>{eligibility.date && <div className="eligibility-line"><span>Donation gap</span><strong>{eligibleNow ? 'Complete' : `${eligibility.days} days left`}</strong></div>}</div>}
        {dirty && <p className="unsaved-note"><Icon name="bell" size={14} /> Unsaved changes — click below to save.</p>}
        <button className="primary full save-profile-button" type="submit">{dirty ? 'Save changes *' : 'Save changes'}</button><button className="logout-button" type="button" onClick={onLogout}>Log out</button>
        <div className="danger-zone"><strong>Delete account</strong><p>This permanently deletes your profile, requests, responses, and notifications.</p><button className="delete-account-button" type="button" onClick={onDeleteAccount}>Delete my account</button></div>
      </aside>
    </form>
  </>;
}
