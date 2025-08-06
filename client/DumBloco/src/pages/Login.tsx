import React, { useState } from 'react';
import logo from '../assets/Logo.svg';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro('');

    try {
      const resposta = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        onLoginSuccess();
      } else {
        setErro(dados.mensagem || 'Erro ao fazer login.');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro na conexão com o servidor.');
    }
  };

  return (
    <div className='pagina-Login'>
      <div className="conteudo-Login">
        <form onSubmit={handleSubmit}>
          <div className='conteudoPai-Login'>
            <h1>Login</h1>

            <div className="input-Login">
              <label htmlFor="email"></label>
              <input
                type="email"
                id="email"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                placeholder="seuemail@exemplo.com"
              />
            </div>

            <div className="input-Login">
              <label htmlFor="password"></label>
              <input
                type="password"
                id="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="senha"
              />
            </div>

            {erro && (
              <div className="erro-login" style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
                {erro}
              </div>
            )}

            <button type="submit" className="botao-Login">Entrar</button>

            <div className='imagem-Login'>
              <img src={logo || "/placeholder.svg"} alt="Logo do Dum Bloco." />
            </div>

            <div className='indicaSindico-Login'>
              <p>
                Ainda não tem uma conta? <br />
                <a className='linkSindico-Login' href="google.com">Contate seu síndico!</a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;