# Bleach Pixel PvP — servidor multiplayer

Servidor Node.js + WebSocket para salas 1v1.

## Arquivos

- `server.js` — servidor HTTP/WebSocket.
- `package.json` — dependência `ws` e comando de inicialização.
- `render.yaml` — configuração para o Render.

## Subir no Render

1. Crie um repositório no GitHub e envie **estes arquivos** para a raiz do repositório.
2. No Render, escolha **New → Web Service** e conecte o repositório.
3. Se o Render pedir os comandos, use:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. O servidor usa automaticamente a variável `PORT` fornecida pelo Render.
5. Depois do deploy, abra a URL `https://SEU-SERVICO.onrender.com/`.
   Ela deve retornar um JSON indicando que o servidor está ativo.

## WebSocket no APK

A URL pública do WebSocket será:

`wss://SEU-SERVICO.onrender.com`

O APK precisa usar essa URL para criar/entrar em salas online.

## Observação sobre o plano Free

Serviços gratuitos do Render podem entrar em suspensão após um período sem tráfego. Isso pode causar um pequeno atraso quando o servidor é acordado novamente.
