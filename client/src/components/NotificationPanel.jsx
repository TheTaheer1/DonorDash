import { Icon } from './Icon';

const relativeTime = value => {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export function NotificationPanel({ notifications, onRead, onReadAll }) {
  return <div className="notification-panel" role="dialog" aria-label="Notifications">
    <div className="notification-head"><div><strong>Notifications</strong><small>{notifications.filter(item => !item.readAt).length} unread</small></div><button onClick={onReadAll} disabled={!notifications.some(item => !item.readAt)}>Mark all read</button></div>
    <div className="notification-list">{notifications.length ? notifications.map(item => <button className={`notification-item ${item.readAt ? '' : 'unread'}`} key={item._id} onClick={() => onRead(item._id)}><span className="notification-icon"><Icon name={item.type === 'MATCH' ? 'users' : item.type === 'FULFILLED' ? 'check' : 'bell'} size={15} /></span><span><strong>{item.title}</strong><small>{item.message}</small><em>{relativeTime(item.createdAt)}</em></span></button>) : <div className="notification-empty"><Icon name="bell" size={20} /><strong>You’re all caught up</strong><span>New updates will appear here.</span></div>}</div>
  </div>;
}
