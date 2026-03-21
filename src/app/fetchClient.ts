// Side-effect module: wraps global fetch to inject Authorization header from localStorage
const originalFetch = globalThis.fetch.bind(globalThis);

function getAccessToken(): string | null {
  try {
    return localStorage.getItem("dsd_admin_accessToken");
  } catch (e) {
    return null;
  }
}

globalThis.fetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  const token = getAccessToken();

  if (!token) {
    return originalFetch(input, init);
  }

  // If input is a Request, clone it and set the header
  if (input instanceof Request) {
    const newHeaders = new Headers(input.headers ?? undefined);
    newHeaders.set("Authorization", `Bearer ${token}`);
    const newReq = new Request(input, { headers: newHeaders });
    return originalFetch(newReq);
  }

  // Otherwise, build new init with merged headers
  const mergedHeaders = new Headers(init?.headers ?? undefined);
  mergedHeaders.set("Authorization", `Bearer ${token}`);
  const newInit: RequestInit = { ...(init ?? {}), headers: mergedHeaders };
  return originalFetch(input, newInit);
};

export {};
