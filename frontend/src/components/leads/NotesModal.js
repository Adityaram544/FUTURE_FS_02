import React, { useState } from 'react';
import { Modal, Button, Textarea } from '../common';

export default function NotesModal({ isOpen, onClose, lead, onAddNote }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try { await onAddNote(lead._id, text); setText(''); }
    finally { setBusy(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Notes — ${lead?.name || ''}`} maxWidth={480}>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {/* Existing notes */}
        <div style={{ maxHeight:260, overflowY:'auto', display:'flex', flexDirection:'column', gap:8 }}>
          {(!lead?.notes || lead.notes.length === 0) && (
            <div style={{ textAlign:'center', padding:'24px 0', color:'var(--text-3)', fontSize:13 }}>No notes yet</div>
          )}
          {(lead?.notes || []).map((n, i) => (
            <div key={i} style={{
              padding:'10px 13px', background:'var(--bg-elevated)',
              borderRadius:9, border:'1px solid var(--border)',
            }}>
              <p style={{ fontSize:13, color:'var(--text-1)', lineHeight:1.5, marginBottom:4 }}>{n.text}</p>
              <p style={{ fontSize:10, color:'var(--text-3)' }}>
                {new Date(n.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
              </p>
            </div>
          ))}
        </div>

        {/* Add note */}
        <div style={{ borderTop:'1px solid var(--border)', paddingTop:14 }}>
          <Textarea
            label="Add a note"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write your note here…"
            style={{ minHeight:70 }}
          />
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:10 }}>
            <Button variant="primary" onClick={submit} disabled={busy || !text.trim()}>
              {busy ? 'Adding…' : 'Add Note'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
