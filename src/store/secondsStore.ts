"use client";
import { create } from "zustand";

type Store = {
  seconds: number;
  _subsCount: number;
  _started: boolean;
};

export const useSecondsStore = create<Store>(() => ({
  seconds: new Date().getSeconds(),
  _subsCount: 0,
  _started: false,
}));

let timer: ReturnType<typeof setTimeout> | null = null;

function scheduleNextTick() {
  const now = Date.now();
  const delay = 1000 - (now % 1000);
  timer = setTimeout(() => {
    const now = new Date();
    useSecondsStore.setState({ seconds: now.getSeconds() });
    scheduleNextTick();
  }, delay);
}

function startTicker() {
  const { _started } = useSecondsStore.getState();
  if (_started) return;
  useSecondsStore.setState({ _started: true });
  scheduleNextTick();
}

function stopTicker() {
  if (timer) clearTimeout(timer);
  timer = null;
  useSecondsStore.setState({ _started: false });
}

export function attachSecondsTicker() {
  const { _subsCount } = useSecondsStore.getState();
  const next = _subsCount + 1;
  useSecondsStore.setState({ _subsCount: next });
  if (next === 1) startTicker();
}

export function detachSecondsTicker() {
  const { _subsCount } = useSecondsStore.getState();
  const next = Math.max(0, _subsCount - 1);
  useSecondsStore.setState({ _subsCount: next });
  if (next === 0) stopTicker();
}
