# 📱 QR Craft: Professional Interactive QR Generator

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📝 Descrição do Projeto
O **QR Craft** é uma plataforma de criação e gestão de QR Codes de alta performance, projetada para unir estética artística com funcionalidade técnica. Diferente de geradores genéricos, o sistema permite personalização completa de cores, formas, sombras e a integração dinâmica de logotipos e templates inteligentes.

Desenvolvido para oferecer fluxos de trabalho ágeis, o dashboard suporta a criação de **QR Codes Estáticos** e **Dinâmicos** (com rastreamento de links), permitindo que usuários gerenciem suas campanhas de marketing ou conexões pessoais com facilidade e segurança.

---

## 🎨 Funcionalidades Principais
* **Personalização Avançada:** Ajuste o estilo dos pontos, quadrados dos cantos e cores com suporte a gradientes lineares e radiais.
* **Templates Inteligentes:** Pré-configurações instantâneas para **WhatsApp** (com mensagem pré-configurada) e **WiFi** (conexão automática) com logos inseridos.
* **Modo de Edição Dedicado:** Edite QR Codes salvos sem duplicar registros, com interface simplificada para links dinâmicos.
* **Infraestrutura Cloud:** Sincronização em tempo real via Firebase para salvar e gerenciar sua biblioteca de códigos.
* **Design Sketch & Watercolor:** UI inspirada em esboços manuais e aquarelas para uma experiência de usuário única e artística.

## 🚀 Tecnologias Utilizadas
* **Frontend:** React 18 + TypeScript + Vite
* **Estilização:** Tailwind CSS + Shadcn UI
* **Backend & Auth:** Firebase (Google Authentication & Firestore)
* **Gerador de QR:** qr-code-styling (Motor de rendering preciso via Canvas)
* **Animações:** Framer Motion (Transições fluidas de interface)
* **Ícones:** Lucide React

## 📊 Estrutura e Resultados
O projeto garante que cada código gerado seja legível e visualmente atraente:
* **Escalabilidade:** Capaz de lidar com milhares de links dinâmicos via Firebase.
* **Performance:** Atualizações de preview debounced para evitar travamentos durante a edição.
* **UX Intuitiva:** Processo simplificado em 3 passos: Escolha o Template -> Personalize o Estilo -> Salve ou Baixe.

## 🔧 Como Executar
1. Clone o repositório.
2. Configure as credenciais do Firebase no arquivo `firebase-applet-config.json`.
3. Instale as dependências: `npm install`.
4. Execute o servidor de desenvolvimento: `npm run dev`.

---
[Voltar ao início](https://github.com/Alexandro-Junior/portfolio-alexandro-de-araujo-junior/tree/main)
