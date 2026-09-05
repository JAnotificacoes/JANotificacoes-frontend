/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // prod (Vercel): proxy same-origin da API para cookie first-party.
  // O browser chama /api/* no próprio domínio e o Next repassa ao Render —
  // assim o cookie de sessão mora no domínio do frontend e o middleware
  // (proxy.ts) e os fetchs o enxergam. Sem isso, o cookie third-party
  // (onrender.com <- vercel.app) quebra o login.
  // build-time via API_UPSTREAM_URL (ex: https://janotifica-api.onrender.com).
  async rewrites() {
    const upstream = (process.env.API_UPSTREAM_URL || "http://localhost:8000").replace(/\/+$/, "");
    return [{ source: "/api/:path*", destination: `${upstream}/:path*` }];
  },
};

export default nextConfig;
