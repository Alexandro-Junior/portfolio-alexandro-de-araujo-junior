# 👁️ VisionGuard: Classificação de Público por Visão Computacional

![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Teachable Machine](https://img.shields.io/badge/Teachable_Machine-4285F4?style=for-the-badge&logo=google&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MobileNet](https://img.shields.io/badge/MobileNet-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)

![Status](https://img.shields.io/badge/Status-Produção-brightgreen?style=flat-square)
![Versão TM](https://img.shields.io/badge/Teachable_Machine-v2.4.14-blue?style=flat-square)
![Versão TFJS](https://img.shields.io/badge/TensorFlow.js-v1.7.4-orange?style=flat-square)
![Classes](https://img.shields.io/badge/Classes-2-purple?style=flat-square)
![Resolução](https://img.shields.io/badge/Resolução-224×224px-lightgrey?style=flat-square)
![Licença](https://img.shields.io/badge/Licença-MIT-green?style=flat-square)

---

## 📝 Descrição do Projeto

O **VisionGuard** é um modelo de classificação de imagens treinado para **identificação automática de faixa etária de público** — distinguindo entre adultos e crianças — em tempo real e diretamente no navegador. Desenvolvido com o framework **Google Teachable Machine** e exportado no formato **TensorFlow.js**, o modelo opera integralmente no lado do cliente, sem necessidade de infraestrutura de backend ou transmissão de dados para servidores externos.

A arquitetura combina a robustez de **redes neurais convolucionais (CNNs)** com a leveza do TensorFlow.js via aceleração **WebGL**, possibilitando inferência de baixa latência mesmo em dispositivos com recursos computacionais limitados. O pipeline completo — da captura de imagem à predição classificatória — funciona de forma autônoma no dispositivo do usuário, garantindo **privacidade de dados** e **responsividade** em cenários de uso críticos.

---

## 🎯 Classes do Modelo

O modelo foi treinado para discriminar entre os seguintes grupos:

| Rótulo | Público-Alvo | Descrição |
|---|---|---|
| `adultos` | 👤 Adultos | Identificação de indivíduos adultos na cena capturada |
| `crianças` | 👦 Crianças | Identificação de indivíduos em faixa etária infantil |

---

## 🚀 Tecnologias Utilizadas

- **Motor de Inferência:** TensorFlow.js v1.7.4 (execução no navegador via WebGL)
- **Framework de Treinamento:** Google Teachable Machine v2.4.14
- **Pacote de Imagem:** `@teachablemachine/image` v0.8.4-alpha2
- **Arquitetura Base:** MobileNet (transfer learning otimizado para dispositivos leves)
- **Formato do Modelo:** TFJS Graph Model (`model.json` + `weights.bin`)
- **Resolução de Entrada:** 224 × 224 pixels (padrão MobileNet)

---

## 📁 Estrutura de Arquivos do Modelo

```
visionguard-model/
├── model.json        # Grafo computacional e configuração da arquitetura neural
├── weights.bin       # Pesos sinápticos treinados (binário otimizado)
└── metadata.json     # Metadados: classes, versões do framework e timestamp
```

| Arquivo | Descrição |
|---|---|
| `model.json` | Define a topologia da rede neural e referencia os shards de pesos |
| `weights.bin` | Arquivo binário contendo todos os pesos e vieses do modelo treinado |
| `metadata.json` | Contém os rótulos das classes, versões do framework e configurações de entrada |

---

## 🔧 Como Utilizar

### Integração via CDN (HTML puro)

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.7.4/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js"></script>
```

### Carregamento e Inferência

```javascript
const MODEL_URL = "./visionguard-model/";

async function init() {
  const modelURL = MODEL_URL + "model.json";
  const metaURL  = MODEL_URL + "metadata.json";

  // Carrega o modelo treinado
  const model = await tmImage.load(modelURL, metaURL);

  // Realiza predição em um elemento de imagem ou vídeo
  const predictions = await model.predict(imageElement);

  // Exibe os resultados com probabilidade por classe
  predictions.forEach(p => {
    console.log(`${p.className}: ${(p.probability * 100).toFixed(2)}%`);
  });
}
```

### Instalação via npm

```bash
npm install @teachablemachine/image
```

```javascript
import * as tmImage from "@teachablemachine/image";

const model = await tmImage.load("./model.json", "./metadata.json");
const predictions = await model.predict(webcamElement);
```

---

## 📊 Especificações Técnicas

| Parâmetro | Valor |
|---|---|
| Nome do Modelo | My image model |
| Número de Classes | 2 |
| Classes | `adultos`, `crianças` |
| Resolução de Entrada | 224 × 224 px |
| Framework Base | TensorFlow.js |
| Versão TF.js | 1.7.4 |
| Versão Teachable Machine | 2.4.14 |
| Pacote | `@teachablemachine/image` v0.8.4-alpha2 |
| Data de Exportação | 15 de maio de 2026 |
| Execução | Lado do cliente (sem servidor) |

---

## 💡 Casos de Uso

- **Controle de Acesso:** Sistemas que restringem ou adaptam conteúdo com base na faixa etária detectada
- **Varejo & Experiência do Usuário:** Personalização de interfaces e recomendações de produtos por público
- **Ambientes Educacionais:** Monitoramento de presença e identificação de grupos em plataformas de ensino
- **Segurança & Conformidade:** Auxílio em auditorias de ambientes restritos a adultos ou exclusivos para crianças
- **Pesquisa em Visão Computacional:** Base para pipelines de análise demográfica visual

---

## ⚠️ Considerações Éticas

Este modelo foi desenvolvido com fins educacionais e de pesquisa. O uso em ambientes de produção deve observar rigorosamente as diretrizes de privacidade vigentes (**LGPD** e **GDPR**), especialmente por envolver potencial identificação de menores de idade. **Nenhum dado visual é transmitido ou armazenado** — toda inferência ocorre localmente no dispositivo do usuário, garantindo privacidade por design (*privacy by design*).

> ⚠️ **Atenção:** A utilização de sistemas de reconhecimento visual para classificação de crianças requer avaliação jurídica e ética específica conforme a legislação local aplicável.

---

## 📄 Licença

Distribuído sob licença **MIT**. Consulte o arquivo `LICENSE` para mais informações.

---

[Voltar ao início](https://github.com/Alexandro-Junior/portfolio-alexandro-de-araujo-junior/tree/main)
