import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../common';

const EMPTY = { name:'', email:'', phone:'', company:'', source:'Website', status:'New', followUpDate:'' };

export default function LeadForm({ isOpen, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        name:         initial.name         || '',
        email:        initial.email        || '',
        phone:        initial.phone        || '',
        company:      initial.company      || '',
        source:       initial.source       || 'Website',
        status:       initial.status       || 'New',
        followUpDate: initial.followUpDate ? initial.followUpDate.slice(0,10) : '',
      });
    } else {
      setForm(EMPTY);
    }
    setErr({});
  }, [initial, isOpen]);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    return e;
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErr(errs); return; }
    setBusy(true);
    try { await onSubmit(form); onClose(); }
    catch (err) { console.error(err); }
    finally { setBusy(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? 'Edit Lead' : 'Add New Lead'} maxWidth={520}>
      <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div className="form-row">
          <Input label="Full Name *" value={form.name}  onChange={set('name')}
            error={err.name} placeholder="Priya Sharma" />
          <Input label="Email *"     value={form.email} onChange={set('email')}
            error={err.email} placeholder="priya@example.com" type="email" />
        </div>
        <div className="form-row">
          <Input label="Phone"   value={form.phone}   onChange={set('phone')}   placeholder="+91 98765 43210" />
          <Input label="Company" value={form.company} onChange={set('company')} placeholder="TechCorp Pvt Ltd" />
        </div>
        <div className="form-row">
          <Select label="Source" value={form.source} onChange={set('source')}>
            {['Website','Referral','Social Media','Email','Cold Call','Other'].map(s=><option key={s}>{s}</option>)}
          </Select>
          <Select label="Status" value={form.status} onChange={set('status')}>
            {['New','Contacted','Qualified','Converted','Lost'].map(s=><option key={s}>{s}</option>)}
          </Select>
        </div>
        <Input label="Follow-up Date" type="date" value={form.followUpDate} onChange={set('followUpDate')} />
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:4 }}>
          <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" type="submit" disabled={busy}>
            {busy ? 'Saving…' : initial ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </form>
      <style>{`
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media (max-width:480px) { .form-row { grid-template-columns:1fr; gap:12px; } }
      `}</style>
    </Modal>
  );
}