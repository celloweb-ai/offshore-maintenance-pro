<div align="center">

![Offshore Maintenance Pro](./images/github-header.png)

# 🛢️ Offshore Maintenance Pro

### Sistema Inteligente de Geração de Planos de Manutenção Offshore com IA

<p align="center">
  <em>Automatize a criação de documentação técnica para plataformas FPSO e fixas com inteligência artificial</em>
</p>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini_3-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

### 🌐 **[ACESSAR APLICAÇÃO AO VIVO](https://offshore-maintenance-pro.vercel.app/)** 🌐

</div>

---

## 💡 Sobre o Projeto

O **Offshore Maintenance Pro** é uma solução web avançada que revoluciona a criação de planos de manutenção preventiva para instrumentação industrial em ambientes offshore. Utilizando o poder da inteligência artificial **Google Gemini 3 Pro**, o sistema gera automaticamente documentação técnica detalhada, em total conformidade com:

- ✅ **Normas Regulamentadoras Brasileiras** (NR-10, NR-13, NR-37)
- ✅ **Padrões Internacionais** (ISA, IEC, API)
- ✅ **Melhores Práticas da Indústria Offshore**

<div align="center">

### ✨ **Principais Destaques** ✨

</div>

<table>
<tr>
<td width="50%">

#### 🤖 Inteligência Artificial
- Google Gemini 3 Pro integrado
- Geração de conteúdo técnico especializado
- Respostas em JSON estruturado

#### 📊 Dashboard Gerencial
- Métricas consolidadas em tempo real
- Histórico de planos gerados
- Visualização intuitiva de dados

</td>
<td width="50%">

#### 📋 Checklists Personalizados
- Procedimentos específicos por instrumento
- Conformidade com normas técnicas
- Exportação para PDF via impressão

#### ⚙️ Customização Total
- Configurações de equipe ajustáveis
- Papéis e responsabilidades flexíveis
- Armazenamento local persistente

</td>
</tr>
</table>

---

## 🚀 Funcionalidades Principais

### 🔧 Instrumentos Suportados

```
• Sensores de Nível          • Detectores de Gás (F&G)
• Transmissores de Pressão  • Analisadores Industriais
• Válvulas de Controle       • Transmissores de Temperatura
• Medidores de Vazão        • E muito mais...
```

### 🏭 Tipos de Plataforma

<div align="center">

| FPSO | Plataformas Fixas |
|:----:|:-----------------:|
| 🚢 Floating Production Storage and Offloading | ⛱️ Instalações Fixas de Produção |
| Otimizado para unidades flutuantes | Suporte completo para plataformas jacket |

</div>

### 📝 Conteúdo Técnico Gerado

Cada plano de manutenção inclui automaticamente:

<table>
<tr>
<td>

**🔍 Procedimentos de Teste**
- Step-by-step detalhado
- Referências normativas
- Critérios de aceitação

</td>
<td>

**🔧 Especificações Técnicas**
- Faixas de operação
- Parâmetros de calibração
- Sinais esperados (4-20mA, HART)

</td>
</tr>
<tr>
<td>

**⚠️ Normas de Segurança**
- Precauções críticas
- EPIs necessários
- Procedimentos de lockout

</td>
<td>

**👥 Equipe e Recursos**
- Pessoal qualificado
- Ferramentas específicas
- Materiais de consumo

</td>
</tr>
</table>

---

## 🏗️ Arquitetura Técnica

<div align="center">

### Stack de Tecnologias Modernas

</div>

<table align="center">
<tr>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React"/>
<br><strong>React 19.2</strong>
<br><sub>Frontend Framework</sub>
</td>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript"/>
<br><strong>TypeScript 5.8</strong>
<br><sub>Type Safety</sub>
</td>
<td align="center" width="25%">
<img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" width="48" height="48" alt="Gemini"/>
<br><strong>Gemini 3 Pro</strong>
<br><sub>AI Engine</sub>
</td>
<td align="center" width="25%">
<img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" width="48" height="48" alt="Vercel"/>
<br><strong>Vercel</strong>
<br><sub>Cloud Deploy</sub>
</td>
</tr>
</table>

### 📁 Estrutura do Projeto

```
Offshore_Maintenance_Pro/
├── 📂 components/
│   ├── Layout.tsx           # Layout principal da aplicação
│   ├── PlanForm.tsx         # Formulário de geração de planos
│   ├── PlanDisplay.tsx      # Visualização dos planos gerados
│   └── SettingsPanel.tsx    # Painel de configurações
├── 🔧 services/
│   └── geminiService.ts     # Integração com Google Gemini AI
├── 📝 types.ts              # Definições TypeScript
├── ⚙️ App.tsx               # Componente raiz
├── 🎨 index.css            # Estilos globais
└── 🚀 vite.config.ts       # Configuração do Vite
```

---

## 🛠️ Instalação e Configuração

### 📌 Pré-requisitos

- Node.js 18+ 🟢
- npm ou yarn 📦
- Chave API do Google AI Studio 🔑

### 💣 Quick Start

```bash
# 1️⃣ Clone o repositório
git clone https://github.com/celloweb-ai/Offshore_Maintenance_Pro.git

# 2️⃣ Entre no diretório
cd Offshore_Maintenance_Pro

# 3️⃣ Instale as dependências
npm install

# 4️⃣ Configure a API Key
cp .env.local.example .env.local
# Edite .env.local e adicione sua chave:
# VITE_GEMINI_API_KEY=sua_chave_api_aqui

# 5️⃣ Inicie o servidor de desenvolvimento
npm run dev
```

### 🔑 Obter API Key do Google

1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada
5. Cole no arquivo `.env.local`

---

## 📚 Como Usar

### Passo a Passo

<table>
<tr>
<td width="33%" align="center">

**1️⃣ Selecione**

<img src="https://img.icons8.com/fluency/96/000000/select.png" width="64"/>

Escolha o tipo de instrumento e plataforma

</td>
<td width="33%" align="center">

**2️⃣ Gere**

<img src="https://img.icons8.com/fluency/96/000000/artificial-intelligence.png" width="64"/>

Clique em "Gerar Plano" e aguarde a IA processar

</td>
<td width="33%" align="center">

**3️⃣ Exporte**

<img src="https://img.icons8.com/fluency/96/000000/pdf.png" width="64"/>

Visualize e exporte para PDF

</td>
</tr>
</table>

### 📹 Screenshots

<details>
<summary><strong>👁️ Clique para ver exemplos de uso</strong></summary>

<br>

> **Formulário de Geração**
> - Interface intuitiva
> - Validação em tempo real
> - Sugestões automáticas

> **Plano Gerado**
> - Formatação profissional
> - Todos os detalhes técnicos
> - Pronto para impressão

> **Dashboard**
> - Métricas visuais
> - Histórico completo
> - Busca e filtros

</details>

---

## 🔒 Segurança e Privacidade

<div align="center">

| Recurso | Status | Descrição |
|---------|--------|------------|
| 🔐 **Variáveis de Ambiente** | ✅ Protegidas | Chaves API armazenadas em `.env.local` |
| 🚫 **Git Ignore** | ✅ Configurado | Credenciais nunca commitadas |
| 💾 **Armazenamento Local** | ✅ Browser-only | Dados sensíveis apenas no navegador |
| 🌐 **HTTPS** | ✅ Forçado | Comunicação criptografada via Vercel |

</div>

---

## 🔬 Scripts Disponíveis

```bash
npm run dev      # 🟢 Servidor de desenvolvimento (hot reload)
npm run build    # 📦 Build otimizado para produção
npm run preview  # 👀 Preview local do build de produção
```

---

## 🗺️ Roadmap

<table>
<tr>
<td>

### 🚧 Em Desenvolvimento
- [ ] Integração com APIs ERP/CMMS
- [ ] Exportação direta para PDF
- [ ] Sistema de notificações

</td>
<td>

### 🔮 Futuro Próximo
- [ ] Suporte multilíngue (EN/ES)
- [ ] Templates customizáveis
- [ ] Banco de dados externo

</td>
</tr>
</table>

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 👨‍💻 Autor

<div align="center">

**Marcus Vasconcellos (celloweb-ai)**

[![GitHub](https://img.shields.io/badge/GitHub-celloweb--ai-181717?style=for-the-badge&logo=github)](https://github.com/celloweb-ai)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/marcus-vasconcellos)

*Engenheiro de Automação Industrial | Especialista em Sistemas Offshore*

</div>

---

## 📜 Licença

<div align="center">

Este projeto é **privado**. Todos os direitos reservados © 2026

</div>

---

<div align="center">

### ⭐ Se este projeto foi útil, considere dar uma estrela!

**Desenvolvido com ❤️ para a indústria offshore brasileira**

🌊 **FPSO** • ⛱️ **Plataformas Fixas** • 🛢️ **O&G Industry** • 🇧🇷 **Made in Brazil**

---

[![Vercel](https://img.shields.io/badge/Hosted_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://offshore-maintenance-pro.vercel.app/)

</div>
