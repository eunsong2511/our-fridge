import { useState } from 'react'
import { Refrigerator } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button, Field, inputCls } from './ui'

export function AuthScreen({ onLocal }: { onLocal: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!supabase) return
    setBusy(true); setMsg(null)
    const { error, data } = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password: pw })
      : await supabase.auth.signUp({ email, password: pw })
    setBusy(false)
    if (error) return setMsg(error.message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 맞지 않아요.' : error.message)
    if (mode === 'signup' && !data.session) setMsg('가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해주세요.')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-8 text-center animate-rise">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-leaf to-leaf-deep text-white shadow-[0_16px_32px_-12px_rgba(31,122,68,.6)]"><Refrigerator size={38} /></div>
        <h1 className="text-[26px] font-extrabold tracking-tight">우리집냉장고</h1>
        <p className="mt-1 text-sm text-ink-2">유통기한 관리 · 요리 추천 · 장보기</p>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-card bg-paper p-5 shadow-card animate-rise" style={{ animationDelay: '80ms' }}>
        <div className="flex rounded-2xl bg-cream-2 p-1 text-sm">
          {(['login', 'signup'] as const).map((m) => (
            <button type="button" key={m} onClick={() => { setMode(m); setMsg(null) }} className={`flex-1 rounded-xl py-2 font-bold transition-all ${mode === m ? 'bg-paper text-ink shadow-sm' : 'text-ink-3'}`}>{m === 'login' ? '로그인' : '회원가입'}</button>
          ))}
        </div>
        <Field label="이메일"><input className={inputCls} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
        <Field label="비밀번호" hint={mode === 'signup' ? '6자 이상' : undefined}><input className={inputCls} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} required /></Field>
        {msg && <p className="rounded-2xl bg-cream px-3.5 py-2.5 text-sm text-ink-2">{msg}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{mode === 'login' ? '로그인' : '가입하기'}</Button>
      </form>
      <button onClick={onLocal} className="mt-5 text-center text-sm font-semibold text-ink-3 underline-offset-4 hover:underline">로그인 없이 이 기기에서만 사용하기</button>
    </div>
  )
}
