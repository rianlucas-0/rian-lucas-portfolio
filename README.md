# Portfólio · Rian Lucas
Site estático (HTML/CSS/JS) + função serverless em `api/contact.js` (Resend). Sem build, roda no plano gratuito da Vercel.

## Publicar
1. Suba esta pasta para um repositório no GitHub e importe na Vercel (Framework: Other).
2. Em Settings → Environment Variables, crie:
   - `RESEND_API_KEY`: chave criada em resend.com/api-keys
   - `CONTACT_TO`: e-mail que recebe as mensagens (padrão: rianlucas.moon@gmail.com)
   - `CONTACT_FROM` (opcional): remetente de um domínio verificado no Resend. Sem isso usa `onboarding@resend.dev`, que só entrega para o e-mail da sua própria conta Resend.
3. Faça o deploy.

## Projetos
Em `index.html`, copie um bloco `<article class="card proj">` e troque título, descrição, tags e link.
# rian-lucas-portfolio
