import { useState } from 'react'
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
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-emerald-600 text-3xl">🧊</div>
        <h1 className="text-2xl font-bold">우리집냉장고</h1>
        <p className="mt-1 text-sm text-slate-500">유통기한 관리 · 요리 추천 · 장보기</p>
      </div>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex rounded-xl bg-slate-100 p-1 text-sm">
          {(['login', 'signup'] as const).map((m) => (
            <button type="button" key={m} onClick={() => { setMode(m); setMsg(null) }} className={`flex-1 rounded-lg py-1.5 font-medium ${mode === m ? 'bg-white shadow-sm' : 'text-slate-500'}`}>{m === 'login' ? '로그인' : '회원가입'}</button>
          ))}
        </div>
        <Field label="이메일"><input className={inputCls} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
        <Field label="비밀번호" hint={mode === 'signup' ? '6자 이상' : undefined}><input className={inputCls} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} required /></Field>
        {msg && <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{msg}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{mode === 'login' ? '로그인' : '가입하기'}</Button>
      </form>
      <button onClick={onLocal} className="mt-4 text-center text-sm text-slate-400 underline-offset-2 hover:underline">로그인 없이 이 기기에서만 사용하기</button>
    </div>
  )
}
