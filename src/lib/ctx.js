import { createContext, useContext } from 'react'
export const Ctx = createContext(null)
export const useSite = () => useContext(Ctx)
export const photo = k => `${import.meta.env.BASE_URL}photos/${k}.webp`
export const store = {
  get(k) { try { return localStorage.getItem(k) } catch (e) { return null } },
  set(k, v) { try { localStorage.setItem(k, v) } catch (e) {} },
}
export const reduceMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
