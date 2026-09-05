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
  // Headers de segurança básicos (sem CSP restritiva: o Next precisa de
  // inline scripts; CSP quebraria o build sem nonces).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
