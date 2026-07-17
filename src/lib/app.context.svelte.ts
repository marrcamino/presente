const CONTEXT_KEY = Symbol("app-context");
import { getContext, setContext } from "svelte";

class AppContext {
  sidebarOpen = $state(false)
}

export function setAppContext() {
  return setContext(CONTEXT_KEY, new AppContext)
}

export function getAppContext() {
  return getContext(CONTEXT_KEY) as AppContext
}
