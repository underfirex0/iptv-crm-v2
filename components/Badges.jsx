export function ScoreBadge({ score }) {
  const map = {
    hot:  { cls: 'badge badge-hot',  dot: '#ff3d5a', label: 'Hot'  },
    warm: { cls: 'badge badge-warm', dot: '#ffab00', label: 'Warm' },
    cold: { cls: 'badge badge-cold', dot: '#4dabf7', label: 'Cold' },
  }
  const { cls, dot, label } = map[score] || map.cold
  return (
    <span className={cls}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot, display: 'inline-block', flexShrink: 0 }} />
      {label}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    new:        { cls: 'badge badge-new',        label: 'New'        },
    contacted:  { cls: 'badge badge-contacted',  label: 'Contacted'  },
    qualified:  { cls: 'badge badge-qualified',  label: 'Qualified'  },
    subscribed: { cls: 'badge badge-subscribed', label: 'Subscribed' },
    lost:       { cls: 'badge badge-lost',       label: 'Lost'       },
  }
  const { cls, label } = map[status] || map.new
  return <span className={cls}>{label}</span>
}
