# JANotifica — Frontend

Painel da coordenação para o sistema de notificação de faltas escolares via WhatsApp.
Interface para escanear planilhas, revisar faltas, disparar notificações e acompanhar o histórico.

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" width="100" height="100" alt="Next.js"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="100" height="100" alt="React"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="100" height="100" alt="Tailwind CSS"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="100" height="100" alt="JavaScript"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" width="100" height="100" alt="Docker"/>
</div>

---

## Stack

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 15 | Framework (App Router) |
| React | 19 | UI |
| Tailwind CSS | — | Estilização |
| CSS Modules | — | Estilos específicos |
| Docker | — | Containerização |

## Páginas

| Rota | Descrição |
|------|-----------|
| `/dashboard` | Faltas do dia, botão de scan, notificação manual |
| `/history` | Histórico com filtros por turma, data e status |
| `/settings` | Status das integrações, template de mensagem, QR Code WhatsApp |
| `/about` | Informações do sistema |

## Setup

### Desenvolvimento

```bash
git clone https://github.com/JANotificacoes/JANotificacoes-frontend.git
cd JANotificacoes-frontend

cp .env.example .env.local
# Editar NEXT_PUBLIC_API_URL se necessário

npm install
npm run dev
```

Acessar em `http://localhost:3000`.

### Docker Compose (recomendado)

O frontend faz parte de um stack de 3 containers. O `docker-compose.yml` completo está neste repositório — consulte o arquivo na raiz para subir evolution + backend + frontend:

```bash
docker compose up -d
```

## Variáveis de Ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL do backend |

## Integração

O frontend consome a API REST do [JANotifica Backend](https://github.com/JANotificacoes/JANotificacoes-backend) em `http://localhost:8000`.
Todas as chamadas são feitas via `fetch` com `NEXT_PUBLIC_API_URL`.

---

## Projetos Relacionados

- [JANotifica Backend](https://github.com/JANotificacoes/JANotificacoes-backend) — API do sistema
