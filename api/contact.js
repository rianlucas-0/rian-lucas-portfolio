const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).json({error:'Método não permitido'});
  const{name,email,message,company}=req.body||{};
  if(company)return res.status(200).json({ok:true}); // honeypot anti-spam
  if(!name||!email||!message)return res.status(400).json({error:'Preencha todos os campos'});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:'E-mail inválido'});
  if(!process.env.RESEND_API_KEY)return res.status(500).json({error:'Servidor sem chave do Resend configurada'});
  try{
    const r=await fetch('https://api.resend.com/emails',{method:'POST',
      headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        from:process.env.CONTACT_FROM||'Portfólio <onboarding@resend.dev>',
        to:[process.env.CONTACT_TO||'rianlucas.moon@gmail.com'],
        reply_to:email,
        subject:`Novo contato do portfólio: ${String(name).slice(0,80)}`,
        html:`<p><b>Nome:</b> ${esc(name)}</p><p><b>E-mail:</b> ${esc(email)}</p><p>${esc(message).replace(/\n/g,'<br>')}</p>`
      })});
    if(!r.ok)throw new Error(await r.text());
    return res.status(200).json({ok:true});
  }catch(e){console.error(e);return res.status(500).json({error:'Não foi possível enviar agora'})}
};
