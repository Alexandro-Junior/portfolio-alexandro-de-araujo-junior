# 🎨 QR Craft: Custom QR Code Generator

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

---

## 📝 Descrição do Projeto

O **QR Craft** é uma reconstrução funcional e fiel do webapp [qr-code-styling.com](https://qr-code-styling.com/), desenvolvida como parte de uma atividade prática de **Engenharia Reversa Assistida por IA** na disciplina de Laboratório de Engenharia de Software.

O projeto permite a **geração de QR Codes altamente customizáveis**, oferecendo controle completo sobre forma dos módulos, estilo dos olhos (corners), cores, gradientes, imagens centrais e formato de exportação — tudo em tempo real, sem necessidade de backend.

Este aplicativo foi inteiramente reconstruído a partir da **observação da interface externa** da referência, com auxílio do **Google Gemini** configurado como desenvolvedor Full-Stack via Google AI Studio, sem acesso ao código-fonte original.

---

## 🚀 Tecnologias Utilizadas

* **Frontend:** React 18 + JavaScript + Vite
* **Estilização:** CSS3 com variáveis customizadas e layout responsivo
* **Geração de QR Code:** Biblioteca [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling) (NPM)
* **Exportação:** Canvas API — suporte a PNG, SVG e JPEG
* **IA Assistente:** Google Gemini (Google AI Studio) como motor de geração de código
* **Engenharia Reversa:** Análise funcional e visual da interface sem acesso ao código-fonte

---

## 🧠 Metodologia: Desenvolvimento Assistido por IA

Este projeto foi desenvolvido seguindo três etapas metodológicas:

### 1. 🔍 Análise
Exploração sistemática do webapp de referência [qr-code-styling.com](https://qr-code-styling.com/), mapeando:
- Todos os componentes visuais (painéis, inputs, seletores, preview)
- Regras de lógica de negócio (atualização em tempo real, validações)
- Comportamentos de exportação e interações do usuário

### 2. ⚙️ Configuração do Modelo
No **Google AI Studio**, foram definidas System Instructions especificando:
- Papel: Desenvolvedor Full-Stack (React + CSS + JS)
- Estrutura de arquivos esperada: `index.html`, `App.jsx`, `styles.css`, `components/`
- Comportamento detalhado de cada interação da interface
- Parâmetros de fidelidade visual e funcional à referência

### 3. 🏗️ Construção e Validação
- Geração iterativa do código completo dentro do Google AI Studio
- Execução e comparação funcional com o webapp original
- Refinamento das instruções até atingir paridade de nome, estética e comportamento

---

## 📊 Funcionalidades Reconstruídas

| Funcionalidade | Status |
|---|---|
| Input de URL/texto para geração do QR | ✅ Implementado |
| Seletor de forma dos módulos (quadrado, arredondado, dots, classy) | ✅ Implementado |
| Seletor de estilo dos olhos (square, extra-rounded, dot) | ✅ Implementado |
| Escolha de cor sólida ou gradiente | ✅ Implementado |
| Upload de imagem central (logo) | ✅ Implementado |
| Controle de margem (margin) | ✅ Implementado |
| Preview em tempo real | ✅ Implementado |
| Exportação em PNG, SVG e JPEG | ✅ Implementado |
| Interface responsiva com painel lateral | ✅ Implementado |

---

## 📁 Estrutura de Arquivos

```
qr-craft/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── QRPreview.jsx        # Componente de preview em tempo real
│   │   ├── OptionsPanel.jsx     # Painel lateral de customização
│   │   ├── ColorPicker.jsx      # Seletor de cor sólida e gradiente
│   │   ├── ShapeSelector.jsx    # Seletor de forma dos módulos e olhos
│   │   └── ExportButton.jsx     # Botão de exportação multi-formato
│   ├── App.jsx                  # Componente raiz e gerenciamento de estado
│   ├── main.jsx                 # Entry point React
│   └── styles.css               # Estilos globais e variáveis CSS
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔧 Como Executar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/qr-craft.git
   cd qr-craft
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:5173
   ```

5. **Build para produção:**
   ```bash
   npm run build
   ```

---

## 🤔 Reflexão Ética

Este projeto foi desenvolvido no contexto acadêmico da disciplina de **Laboratório de Engenharia Reversa**, com fins exclusivos de aprendizado e desenvolvimento de competências técnicas. A reconstrução respeita os limites éticos do uso educacional, aplicando o princípio da **transformação significativa**: o resultado final visa demonstrar competências de análise e síntese, não reproduzir o produto original com fins comerciais.

A atividade reforça que a Engenharia Reversa Assistida por IA é uma **ferramenta de aprendizado legítima** quando utilizada com responsabilidade, transparência e propósito formativo.

---

## 👨‍💻 Sobre o Desenvolvimento

Este projeto é parte da **Atividade 2 (AT2)** da disciplina de Laboratório de Engenharia de Software. O objetivo central foi exercitar:

- **Pensamento computacional** aplicado à análise de interfaces
- **Comunicação técnica** com ferramentas de IA generativa (prompt engineering)
- **Arquitetura de componentes** em aplicações React modernas
- **Avaliação crítica** entre resultado gerado e referência original

---

[🔙 Voltar ao portfólio](https://github.com/profdiegocarvalho/portfolio-arthur-correia-carvalho)
