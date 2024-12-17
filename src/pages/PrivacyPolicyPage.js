import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', lineHeight: '1.6' }}>
      <h1 style={{ color: '#333' }}>Política de Privacidade</h1>
      <p>
        Sua privacidade é importante para nós. Esta política explica como coletamos, usamos e protegemos suas informações quando você utiliza nosso serviço.
      </p>
      <h2 style={{ color: '#555' }}>Informações que Coletamos</h2>
      <p>
        Podemos coletar informações pessoais, como seu nome, endereço de e-mail e outras informações relevantes, para fornecer um melhor serviço. Também coletamos dados não pessoais, como informações sobre o dispositivo, localização e interações com o site ou aplicativo.
      </p>
      <h2 style={{ color: '#555' }}>Como Usamos Suas Informações</h2>
      <p>
        Usamos as informações coletadas para:
      </p>
      <ul>
        <li>Fornecer e melhorar nossos serviços;</li>
        <li>Personalizar sua experiência;</li>
        <li>Cumprir obrigações legais e regulatórias.</li>
      </ul>
      <h2 style={{ color: '#555' }}>Compartilhamento de Informações</h2>
      <p>
        Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer o serviço ou quando exigido por lei.
      </p>
      <h2 style={{ color: '#555' }}>Segurança</h2>
      <p>
        Tomamos medidas razoáveis para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
      </p>
      <h2 style={{ color: '#555' }}>Política de Privacidade Pública</h2>
      <p>
        Para mais detalhes, consulte nossa política de privacidade completa clicando no link abaixo:
      </p>
      <a 
        href="https://nakazawa.vercel.app/politica-de-privacidade" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ color: '#007BFF', textDecoration: 'none' }}
      >
        Leia nossa Política de Privacidade
      </a>
      <h2 style={{ color: '#555' }}>Contate-nos</h2>
      <p>
        Se você tiver dúvidas sobre esta política, entre em contato conosco pelo e-mail:
        <a 
          href="mailto:contato@seusite.com" 
          style={{ color: '#007BFF', textDecoration: 'none' }}
        >
          contato@seusite.com
        </a>.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
