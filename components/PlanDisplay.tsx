
import React, { useState, useRef, useEffect } from 'react';
import { MaintenancePlan, LogEntry } from '../types.ts';

// Declaração para a biblioteca global carregada via CDN
declare var html2pdf: any;

interface PlanDisplayProps {
  plan: MaintenancePlan;
}

const STATUS_OPTIONS = [
  { value: 'Operacional', color: 'text-green-600', bg: 'bg-green-500', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )},
  { value: 'Em Manutenção', color: 'text-blue-600', bg: 'bg-blue-500', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  )},
  { value: 'Desligado', color: 'text-slate-600', bg: 'bg-slate-500', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v7a1 1 0 11-2 0V3a1 1 0 011-1zm4.243 3.172a1 1 0 011.414 0 8 8 0 11-11.314 0 1 1 0 111.414 1.414 6 6 0 108.486 0 1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )},
  { value: 'Requer Atenção', color: 'text-amber-600', bg: 'bg-amber-500', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  )},
];

const NORM_DESCRIPTIONS: Record<string, string> = {
  'NR-10': 'Segurança em Instalações e Serviços em Eletricidade',
  'NR-13': 'Caldeiras, Vasos de Pressão, Tubulações e Tanques Metálicos de Armazenamento',
  'NR-37': 'Segurança e Saúde em Plataformas de Petróleo',
  'NR-12': 'Segurança no Trabalho em Máquinas e Equipamentos',
  'ISA': 'International Society of Automation (Padrões Globais de Automação e Controle)',
  'IEC': 'International Electrotechnical Commission (Normas Internacionais de Eletricidade e Eletrônica)',
  'API': 'American Petroleum Institute (Padrões Técnicos para a Indústria de Petróleo e Gás Natural)',
  'ISO': 'International Organization for Standardization (Normas de Qualidade e Processos Industriais)',
  'NR-33': 'Segurança e Saúde nos Trabalhos em Espaços Confinados',
  'NR-35': 'Trabalho em Altura',
};

const RESOURCE_TOOLTIPS: Record<string, string> = {
  'Multímetro': 'Crucial para medir loops de corrente (4-20mA) e integridade de isolação de cabos em áreas onde a névoa salina pode causar fugas de corrente.',
  'Bomba': 'Equipamento de calibração portátil com conexões rápidas. Necessário para gerar pressão controlada em transmissores instalados em locais de difícil acesso.',
  'HART': 'Comunicador de protocolo digital. Imprescindível para diagnosticar falhas de eletrônica e ajustar ranges sem abrir o invólucro Ex.',
  'Calibrador': 'Dispositivo padrão rastreável (RBC). Garante que a precisão do instrumento esteja dentro dos limites operacionais críticos.',
  'Chave': 'Ferramental mecânico tratado contra corrosão galvânica acelerada no ambiente offshore.',
  'EPI': 'Equipamento de Proteção Individual mandatário, incluindo proteção contra fogo repentino e vapores corrosivos.',
  'Limpeza': 'Remoção de depósitos salinos de terminais e placas para evitar arcos elétricos e oxidação.',
  'Vedante': 'Garante que os invólucros IP66/67 mantenham a estanqueidade contra umidade oceânica.',
  'Lubrificante': 'Composto anti-engripante para prevenir o travamento de roscas em ambientes de alta salinidade.',
  'Trava-rosca': 'Resina anaeróbica que impede o desprendimento de parafusos devido à vibração mecânica constante.',
  'Megômetro': 'Teste de resistência de isolação para garantir a integridade dielétrica após intervenções.',
  'Walkie-talkie': 'Comunicação IS (Intrinsecamente Segura) vital para coordenação com a sala de controle.',
};

const PROCEDURE_INSIGHTS: Record<string, string> = {
  'Inspeção': 'Objetivo: Detectar danos físicos, corrosão ou infiltrações. Importância: Previne falhas catastróficas por perda de integridade estrutural e garante a estanqueidade Ex.',
  'Visual': 'Objetivo: Identificar anomalias externas óbvias. Importância: Primeira linha de defesa contra degradação acelerada pela salinidade e radiação UV.',
  'Calibração': 'Objetivo: Verificar e ajustar a precisão metrológica. Importância: Garante que os dados do processo sejam confiáveis para o controle e segurança operacional.',
  'Loop': 'Objetivo: Validar a continuidade e integridade do sinal entre campo e DCS. Importância: Assegura que a leitura visualizada pelo operador corresponde ao valor real de campo.',
  'Ajuste': 'Objetivo: Corrigir desvios de zero e span (drift). Importância: Mantém o instrumento operando dentro da classe de exatidão requerida pelo projeto.',
  'Limpeza': 'Objetivo: Remover depósitos de sal e óleos. Importância: Evita a oxidação de contatos elétricos e o travamento de partes móveis sujeitas à incrustação.',
  'Teste Funcional': 'Objetivo: Validar a operação de componentes ativos. Importância: Confirma que o instrumento responde conforme esperado diante de estímulos de processo.',
  'Intertravamento': 'Objetivo: Validar a lógica de segurança (Safety Logic). Importância: Vital para garantir o shutdown automático da unidade em situações de emergência.',
  'Estanqueidade': 'Objetivo: Verificar fugas em conexões pneumáticas/hidráulicas. Importância: Previne a contaminação do ambiente e a perda de energia/sinal de controle.',
  'Segurança': 'Objetivo: Mitigar riscos durante a execução da tarefa. Importância: Protege a integridade física do técnico e evita a desativação acidental de sistemas críticos.',
  'Aterramento': 'Objetivo: Verificar a continuidade da malha de terra. Importância: Dissipa descargas atmosféricas e ruídos eletromagnéticos que podem corromper sinais HART/Fieldbus.',
  'Válvula': 'Objetivo: Verificar o curso e a vedação da sede. Importância: Crucial para o controle de fluxo e isolamento de processo em condições de alta pressão.',
};

const CALIBRATION_TOOLTIPS: Record<string, string> = {
  'Range': 'Faixa de medição calibrada (LRV a URV). Define os limites operacionais do instrumento para este processo específico.',
  'Unidade': 'Unidade de engenharia da variável de processo (PV) monitorada.',
  'Exatidão': 'Desvio máximo permitido em relação ao padrão. Determina a confiabilidade da medição.',
  'Sinal Saída': 'Padrão de transmissão do sinal para o sistema de controle (ex: 4-20mA, Fieldbus).',
  'Tolerância': 'Margem de erro aceitável durante a calibração antes de requerer ajuste.'
};

const FIELD_TOOLTIPS: Record<string, string> = {
  'fieldObservations': 'Registre aqui qualquer anomalia física detectada em campo (ex: vibração excessiva, corrosão severa no suporte, infiltração no invólucro) que possa afetar a integridade futura.',
  'rootCause': 'Identifique a causa primária de qualquer falha detectada (ex: umidade em terminais devido à falha de vedação, drift eletrônico por fim de vida útil, saturação por processo). Fundamental para indicadores MTBF.',
  'generalObservations': 'Informações logísticas ou técnicas complementares, como necessidade de troca de cabeamento em próxima parada ou sugestão de melhoria no isolamento térmico.',
  'engConclusion': 'Atestado final da engenharia sobre a aptidão do instrumento para retorno à operação segura, considerando os resultados dos testes e a criticidade do processo.',
  'techReviewer': 'Identificação do profissional especializado que revisou os parâmetros técnicos e garantiu a conformidade com as normas ISA e NRs.',
  'techReviewComments': 'Parecer detalhado da revisão técnica, validando se os ranges e procedimentos aplicados estão corretos para a aplicação atual do ativo.',
  'supName': 'Nome completo do supervisor ou autoridade técnica que valida a execução da tarefa e libera a área para operação.',
  'supCarimbo': 'Registro funcional ou carimbo técnico que atesta a competência legal do aprovador para validar intervenções em sistemas industriais.',
  'supDate': 'Data oficial de encerramento e liberação da ordem de manutenção. Marca o início do novo ciclo de periodicidade preventiva.'
};

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
  const [fieldObservations, setFieldObservations] = useState('');
  
  // Estados para Revisão Técnica
  const [technicalReviewer, setTechnicalReviewer] = useState('');
  const [technicalReview, setTechnicalReview] = useState(''); // Comentários da revisão
  const [technicalReviewDate, setTechnicalReviewDate] = useState('');
  const [reviewSavedAt, setReviewSavedAt] = useState<string | null>(null);
  const [isReviewEditing, setIsReviewEditing] = useState(true);

  const [engConclusion, setEngConclusion] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [generalObservations, setGeneralObservations] = useState('');
  const [equipmentStatus, setEquipmentStatus] = useState('Operacional');
  const [securityApproved, setSecurityApproved] = useState('');
  const [installationLocation, setInstallationLocation] = useState('');
  const [internalTag, setInternalTag] = useState('');
  const [isCritical, setIsCritical] = useState(false);
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const [attemptedPrint, setAttemptedPrint] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // Estado para download
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [isLogOpen, setIsLogOpen] = useState(false); // Accordion state
  
  const contentRef = useRef<HTMLDivElement>(null); // Ref para o container principal

  const prevValuesRef = useRef({
    fieldObservations: '',
    technicalReview: '',
    technicalReviewer: '',
    technicalReviewDate: '',
    engConclusion: '',
    rootCause: '',
    generalObservations: '',
    equipmentStatus: 'Operacional',
    securityApproved: '',
    installationLocation: '',
    internalTag: '',
    isCritical: false
  });

  const [executante, setExecutante] = useState({ nome: '', matricula: '', data: '', hora: '' });
  const [supervisor, setSupervisor] = useState({ nome: '', data: '', carimbo: '' });

  const execNomeRef = useRef<HTMLInputElement>(null);
  const execMatRef = useRef<HTMLInputElement>(null);
  const execDataRef = useRef<HTMLInputElement>(null);
  const execHoraRef = useRef<HTMLInputElement>(null);
  const supNomeRef = useRef<HTMLInputElement>(null);
  const supCarimboRef = useRef<HTMLInputElement>(null);
  const supDataRef = useRef<HTMLInputElement>(null);
  const engConclusionRef = useRef<HTMLTextAreaElement>(null);
  const securityApprovedRef = useRef<HTMLSelectElement>(null);

  // Helper para obter a data atual no formato YYYY-MM-DD local
  const getCurrentDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getNormTooltip = (norm: string): string => {
    const upperNorm = norm.toUpperCase().trim();
    if (NORM_DESCRIPTIONS[upperNorm]) return NORM_DESCRIPTIONS[upperNorm];
    for (const key in NORM_DESCRIPTIONS) {
      if (upperNorm.startsWith(key)) return NORM_DESCRIPTIONS[key];
    }
    return 'Norma técnica de referência industrial.';
  };

  const getMaterialTooltip = (material: string): string => {
    const lowerMaterial = material.toLowerCase();
    for (const key in RESOURCE_TOOLTIPS) {
      if (lowerMaterial.includes(key.toLowerCase())) return RESOURCE_TOOLTIPS[key];
    }
    return 'Recurso técnico necessário para a execução segura em ambiente offshore.';
  };

  const getProcedureInsight = (action: string, reference?: string): string => {
    const lowerAction = action.toLowerCase();
    let insight = '';
    for (const key in PROCEDURE_INSIGHTS) {
      if (lowerAction.includes(key.toLowerCase())) {
        insight = PROCEDURE_INSIGHTS[key];
        break;
      }
    }
    if (!insight) {
      insight = 'Objetivo: Validar a conformidade técnica do componente. Importância: Parte integrante do ciclo de manutenção para garantir a confiabilidade operacional de longo prazo.';
    }

    if (reference) {
      const norms = reference.split(',').map(n => n.trim());
      const normDescriptions = norms
        .map(n => {
          const desc = getNormTooltip(n);
          return desc !== 'Norma técnica de referência industrial.' ? `${n}: ${desc}` : null;
        })
        .filter(Boolean);

      if (normDescriptions.length > 0) {
        insight += `\n\nConformidade Normativa:\n- ${normDescriptions.join('\n- ')}`;
      }
    }

    return insight;
  };

  /**
   * Componente NormTag Interativo
   */
  const NormTag: React.FC<{ norm: string }> = ({ norm }) => {
    const upperNorm = norm.toUpperCase().trim();
    const description = getNormTooltip(norm);
    
    let colorStyle = "bg-slate-100 text-slate-600 border-slate-200";
    let icon = null;

    if (upperNorm.startsWith('NR')) {
      colorStyle = "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zM10 5a1 1 0 011 1v3a1 1 0 11-2 0V6a1 1 0 011-1zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      );
    } else if (upperNorm.startsWith('ISA') || upperNorm.startsWith('IEC')) {
      colorStyle = "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      );
    } else if (upperNorm.startsWith('API') || upperNorm.startsWith('ISO')) {
      colorStyle = "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      );
    }

    return (
      <div className="relative group inline-flex items-center">
        <span className={`inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter cursor-help transition-all duration-200 hover:scale-105 hover:shadow-sm no-print ${colorStyle}`}>
          {icon}
          {norm}
        </span>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-900/95 backdrop-blur-sm text-white text-[10px] rounded-lg shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none transition-all duration-300 z-50 no-print">
          <div className="flex items-center border-b border-white/10 pb-1.5 mb-1.5">
             <span className="bg-white/20 p-1 rounded mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
             </span>
             <p className="font-bold text-white uppercase tracking-widest">Referência Normativa</p>
          </div>
          <p className="leading-normal font-medium text-slate-100">
            <span className="font-bold text-yellow-400">{norm}</span>: {description}
          </p>
          <div className="mt-2 text-[8px] text-slate-400 italic flex justify-end">
            Documentação Técnica Oficial
          </div>
        </div>
        <span className="hidden print:inline text-[9px] font-bold text-slate-600 mr-2">{norm}</span>
      </div>
    );
  };

  const TechTooltip: React.FC<{ title: string; content: string; children: React.ReactNode; position?: 'top' | 'bottom'; align?: 'center' | 'left' | 'right' }> = ({ title, content, children, position = 'top', align = 'center' }) => {
    const posClass = position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
    const translateClass = position === 'top' ? 'translate-y-2 group-hover:translate-y-0' : '-translate-y-2 group-hover:translate-y-0';

    let alignClass = 'left-1/2 -translate-x-1/2';
    if (align === 'right') alignClass = 'right-0';
    if (align === 'left') alignClass = 'left-0';

    return (
      <div className="relative group">
        {children}
        <div className={`absolute ${alignClass} ${posClass} w-72 p-3 bg-slate-800/95 backdrop-blur-md text-white text-[10px] rounded-lg shadow-2xl opacity-0 ${translateClass} pointer-events-none transition-all duration-300 z-50 no-print`}>
          <p className="font-black border-b border-white/10 pb-1.5 mb-1.5 flex items-center text-blue-300 uppercase tracking-widest">{title}</p>
          <p className="leading-relaxed font-medium text-slate-200 whitespace-pre-line">{content}</p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const logKey = `maintenance_log_${plan.id}`;
    const savedLog = localStorage.getItem(logKey);
    setLogEntries(savedLog ? JSON.parse(savedLog) : []);

    const stateKey = `maintenance_state_${plan.id}`;
    const savedState = localStorage.getItem(stateKey);
    if (savedState) {
      const state = JSON.parse(savedState);
      setFieldObservations(state.fieldObservations || '');
      
      setTechnicalReviewer(state.technicalReviewer || '');
      setTechnicalReview(state.technicalReview || '');
      setTechnicalReviewDate(state.technicalReviewDate || '');
      setReviewSavedAt(state.reviewSavedAt || null);
      if (state.reviewSavedAt) setIsReviewEditing(false);

      setEngConclusion(state.engConclusion || '');
      setRootCause(state.rootCause || '');
      setGeneralObservations(state.generalObservations || '');
      setEquipmentStatus(state.equipmentStatus || 'Operacional');
      setSecurityApproved(state.securityApproved || '');
      setInstallationLocation(state.installationLocation || '');
      setInternalTag(state.internalTag || '');
      setIsCritical(state.isCritical || false);
      
      prevValuesRef.current = {
        fieldObservations: state.fieldObservations || '',
        technicalReviewer: state.technicalReviewer || '',
        technicalReview: state.technicalReview || '',
        technicalReviewDate: state.technicalReviewDate || '',
        engConclusion: state.engConclusion || '',
        rootCause: state.rootCause || '',
        generalObservations: state.generalObservations || '',
        equipmentStatus: state.equipmentStatus || 'Operacional',
        securityApproved: state.securityApproved || '',
        installationLocation: state.installationLocation || '',
        internalTag: state.internalTag || '',
        isCritical: state.isCritical || false
      };
    }
  }, [plan.id]);

  const saveAndLogChanges = () => {
    const currentValues = { 
      fieldObservations, 
      technicalReviewer,
      technicalReview, 
      technicalReviewDate, 
      reviewSavedAt, 
      engConclusion, 
      rootCause, 
      generalObservations, 
      equipmentStatus, 
      securityApproved, 
      installationLocation,
      internalTag, 
      isCritical 
    };
    
    const newEntries: LogEntry[] = [];
    const timestamp = new Date().toLocaleString('pt-BR');
    const user = executante.nome || supervisor.nome || technicalReviewer || 'Usuário do Sistema';

    const fieldsToTrack = [
      { id: 'fieldObservations', label: 'Observações de Campo', value: fieldObservations },
      { id: 'technicalReviewer', label: 'Revisor Técnico', value: technicalReviewer },
      { id: 'technicalReview', label: 'Comentários da Revisão', value: technicalReview },
      { id: 'technicalReviewDate', label: 'Data da Revisão', value: technicalReviewDate },
      { id: 'engConclusion', label: 'Parecer Detalhado Engenharia', value: engConclusion },
      { id: 'rootCause', label: 'Causa Raiz / Diagnóstico', value: rootCause },
      { id: 'generalObservations', label: 'Observações Gerais', value: generalObservations },
      { id: 'equipmentStatus', label: 'Status do Equipamento', value: equipmentStatus },
      { id: 'securityApproved', label: 'Verificação de Segurança', value: securityApproved },
      { id: 'installationLocation', label: 'Local de Instalação', value: installationLocation },
      { id: 'internalTag', label: 'TAG Interna (Cliente)', value: internalTag },
      { id: 'isCritical', label: 'Equipamento Crítico', value: isCritical }
    ];

    fieldsToTrack.forEach(field => {
      const oldValue = (prevValuesRef.current as any)[field.id];
      if (oldValue !== field.value) {
        const formatValue = (v: any) => {
          if (v === true) return 'Sim';
          if (v === false) return 'Não';
          return v ? String(v) : '(Vazio)';
        };

        newEntries.push({ 
          id: crypto.randomUUID(), 
          timestamp, 
          user, 
          fieldName: field.label, 
          oldValue: formatValue(oldValue), 
          newValue: formatValue(field.value) 
        });
      }
    });

    if (newEntries.length > 0) {
      const updatedLog = [...newEntries, ...logEntries];
      setLogEntries(updatedLog);
      localStorage.setItem(`maintenance_log_${plan.id}`, JSON.stringify(updatedLog));
    }

    prevValuesRef.current = { ...currentValues };
    localStorage.setItem(`maintenance_state_${plan.id}`, JSON.stringify(currentValues));
    return true;
  };

  const handleSaveReview = () => {
    if (!technicalReviewer || !technicalReview || !technicalReviewDate) {
      alert("Por favor, preencha todos os campos da revisão.");
      return;
    }
    const timestamp = new Date().toLocaleString('pt-BR');
    setReviewSavedAt(timestamp);
    setIsReviewEditing(false);
    
    // Força o salvamento imediato do estado
    setTimeout(() => saveAndLogChanges(), 100);
  };

  const validateForExport = () => {
    const validations = [
      { field: securityApproved, ref: securityApprovedRef, label: 'Verificação de Segurança Aprovada', condition: (val: string) => val === 'Sim' },
      { field: executante.nome, ref: execNomeRef, label: 'Nome do Executante' },
      { field: executante.matricula, ref: execMatRef, label: 'Matrícula do Executante' },
      { field: executante.data, ref: execDataRef, label: 'Data da Execução' },
      { field: executante.hora, ref: execHoraRef, label: 'Hora da Execução' },
      { field: supervisor.nome, ref: supNomeRef, label: 'Nome do Supervisor' },
      { field: supervisor.carimbo, ref: supCarimboRef, label: 'Carimbo do Supervisor' },
      { field: supervisor.data, ref: supDataRef, label: 'Data da Supervisão' },
      { field: engConclusion, ref: engConclusionRef, label: 'Parecer Detalhado (Engenharia)' },
    ];

    const firstInvalid = validations.find(v => {
      if (v.condition) return !v.condition(v.field);
      return !v.field || !v.field.trim();
    });

    if (firstInvalid) {
      let msg = `Pendente: O campo "${firstInvalid.label}" é obrigatório para emissão.`;
      
      // Mensagem específica para o bloqueio de segurança
      if (firstInvalid.ref === securityApprovedRef) {
          msg = "BLOQUEIO CRÍTICO: A Verificação de Segurança deve estar marcada como 'Sim' para permitir a emissão deste documento.";
      }

      setValidationError(msg);
      firstInvalid.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => firstInvalid.ref.current?.focus(), 500);
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handlePrint = () => {
    saveAndLogChanges();
    setAttemptedPrint(true);
    if(validateForExport()) {
      setAttemptedPrint(false);
      window.print();
    }
  };

  const handleDownloadPDF = () => {
    saveAndLogChanges();
    setAttemptedPrint(true);

    if (validateForExport() && contentRef.current) {
        setIsDownloading(true);
        const element = contentRef.current;
        const opt = {
          margin: [5, 5, 5, 5],
          filename: `Plano_Manutencao_${plan.tag.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Pequeno timeout para permitir que a UI atualize (ex: esconder validações)
        setTimeout(() => {
          if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save().then(() => {
                setIsDownloading(false);
                setAttemptedPrint(false);
            }).catch((err: any) => {
                console.error("Erro ao gerar PDF:", err);
                setIsDownloading(false);
                alert("Erro ao gerar PDF. Tente usar a opção 'Imprimir' e salve como PDF.");
            });
          } else {
             alert("Biblioteca PDF não carregada. Use a opção 'Imprimir'.");
             setIsDownloading(false);
          }
        }, 100);
    }
  };

  const getFieldClass = (value: string, isSelect = false) => {
    const baseClass = "flex-grow border-b focus:border-blue-500 outline-none px-2 py-1 bg-transparent text-slate-800 transition-colors";
    const isEmpty = !value || !value.trim();
    let isError = attemptedPrint && isEmpty;
    
    // Verificação estrita para o select de segurança
    if (isSelect && attemptedPrint && value !== 'Sim') {
        isError = true;
    }

    const errorClass = isError ? "border-red-500 bg-red-50/50 ring-2 ring-red-200 placeholder-red-300" : "border-slate-300";
    return `${baseClass} ${errorClass}`;
  };

  const renderNormTagsList = (refString: string) => {
    if (!refString) return null;
    const norms = refString.split(',').map(n => n.trim());
    return (
      <div className="flex flex-wrap gap-2">
        {norms.map((norm, idx) => <NormTag key={idx} norm={norm} />)}
      </div>
    );
  };

  const currentStatusConfig = STATUS_OPTIONS.find(s => s.value === equipmentStatus) || STATUS_OPTIONS[0];

  return (
    <div ref={contentRef} className={`rounded-xl shadow-md border mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all ${isCritical ? 'border-red-600 ring-4 ring-red-100 bg-red-50 shadow-lg shadow-red-100/50' : 'bg-white border-slate-200'}`}>
      {/* Header */}
      <div className={`rounded-t-xl p-6 flex justify-between items-start text-white print-avoid-break transition-colors ${isCritical ? 'bg-red-700' : 'bg-slate-900'}`}>
        <div className="flex items-center">
          {isCritical && (
            <div className="bg-white/20 p-2 rounded-lg mr-4 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          )}
          <div>
            <h2 className={`font-bold flex items-center flex-wrap transition-all duration-300 ${isCritical ? 'text-3xl tracking-tight' : 'text-2xl'}`}>
              <span className={`text-slate-900 text-xs px-2 py-1 rounded mr-3 uppercase font-black tracking-widest no-print ${isCritical ? 'bg-yellow-400' : 'bg-yellow-500'}`}>Documento Técnico</span>
              <span className="mr-2">Plano de Manutenção:</span>
              <TechTooltip 
                title="Identificação (TAG)" 
                content="Código alfanumérico único (Tag Number) que identifica a posição funcional do equipamento no P&ID e no CMMS. Essencial para a rastreabilidade da intervenção." 
                position="bottom"
              >
                <span className="cursor-help border-b-2 border-dotted border-white/30 hover:border-white hover:text-yellow-400 transition-all">{plan.tag}</span>
              </TechTooltip>
            </h2>
            <div className="flex items-center text-slate-300 mt-1 font-medium text-sm">
              <TechTooltip title="Tipo de Instrumento" content="Define a função do dispositivo e os padrões de calibração aplicáveis (ex: Transmissor, Válvula)." position="bottom">
                <span className="cursor-help hover:text-white border-b border-dashed border-slate-600 hover:border-slate-400 transition-colors">{plan.instrumentType}</span>
              </TechTooltip>
              <span className="mx-2 opacity-50">—</span>
              <TechTooltip title="Unidade Offshore" content="Contexto da instalação (FPSO/Fixa). Define requisitos específicos de segurança (NR-37) e impactos ambientais (vibração/movimentação)." position="bottom">
                 <span className="cursor-help hover:text-white border-b border-dashed border-slate-600 hover:border-slate-400 transition-colors">{plan.platformType}</span>
              </TechTooltip>
            </div>
          </div>
        </div>
        <div className="flex space-x-3 no-print" data-html2canvas-ignore="true">
          <TechTooltip title="Salvar Notas" content="Salva localmente as observações, revisões e status para que você possa continuar mais tarde sem perder dados." position="bottom">
            <button onClick={() => { if(saveAndLogChanges()) alert('Notas salvas.'); }} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors border border-blue-500 flex items-center space-x-2 shadow-sm">
              <span className="text-sm font-bold">Salvar Notas</span>
            </button>
          </TechTooltip>
          
          <TechTooltip title="Baixar PDF" content="Gera e baixa um arquivo PDF contendo todo o plano de manutenção, incluindo assinaturas e observações." position="bottom">
            <button 
              onClick={handleDownloadPDF} 
              disabled={isDownloading}
              className={`bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors border border-green-500 flex items-center space-x-2 shadow-sm ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isDownloading ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                 </svg>
              )}
              <span className="text-sm font-bold">{isDownloading ? 'Gerando...' : 'Baixar PDF'}</span>
            </button>
          </TechTooltip>

          <TechTooltip title="Imprimir" content="Abre a janela de impressão do navegador. Ideal para impressoras físicas ou salvar como PDF nativo do sistema." position="bottom" align="right">
            <button onClick={handlePrint} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/20 flex items-center space-x-2 group">
              <span className="text-sm font-bold">Imprimir</span>
            </button>
          </TechTooltip>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {validationError && (
          <div className="bg-red-50 border-l-8 border-red-600 p-4 rounded-r-xl no-print flex items-center shadow-lg animate-pulse mb-6" data-html2canvas-ignore="true">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-800 font-black uppercase tracking-wide">{validationError}</p>
          </div>
        )}

        {/* Info Básica */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print-avoid-break">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Periodicidade</span>
            <span className="text-lg font-bold text-blue-700">{plan.intervalMonths} Meses</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Data Geração</span>
            <span className="text-lg font-bold text-slate-800">{new Date(plan.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Status do Equipamento</span>
            <div className="flex items-center no-print" data-html2canvas-ignore="true">
              <select value={equipmentStatus} onChange={(e) => setEquipmentStatus(e.target.value)} className={`text-lg font-bold ${currentStatusConfig.color} bg-transparent outline-none cursor-pointer appearance-none`}>
                {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="text-slate-900 font-medium">{opt.value}</option>)}
              </select>
            </div>
            <div className="hidden print-only font-bold text-slate-800" style={{ display: isDownloading ? 'block' : 'none' }}>{equipmentStatus}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between group">
            <div className="flex-grow">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Equipamento Crítico</span>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isCritical ? 'text-red-600' : 'text-slate-400'}`}>
                {isCritical ? 'Alta Criticidade' : 'Critério Normal'}
              </span>
            </div>
            <input 
              type="checkbox" 
              checked={isCritical} 
              onChange={(e) => {
                const newValue = e.target.checked;
                setIsCritical(newValue);
                const currentValues = JSON.parse(localStorage.getItem(`maintenance_state_${plan.id}`) || '{}');
                localStorage.setItem(`maintenance_state_${plan.id}`, JSON.stringify({ ...currentValues, isCritical: newValue }));
              }} 
              className="w-6 h-6 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer no-print transition-transform hover:scale-110"
              data-html2canvas-ignore="true"
            />
            <div className="hidden print-only font-bold text-slate-800" style={{ display: isDownloading ? 'block' : 'none' }}>{isCritical ? 'SIM' : 'NÃO'}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase block mr-2">Local de Instalação</span>
              <TechTooltip 
                title="Logística e Segurança" 
                content="Identifique o Deck, Módulo e Setor específico. Essencial para emissão de PT (Permissão de Trabalho), planejamento de rotas de fuga e transporte de equipamentos."
                position="bottom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400 cursor-help hover:text-blue-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </TechTooltip>
            </div>
            <input type="text" value={installationLocation} onChange={(e) => setInstallationLocation(e.target.value)} placeholder="Ex: Deck 3, Setor B..." className="w-full bg-transparent border-b border-slate-200 outline-none text-sm font-bold py-1 no-print"/>
            <div className="hidden print-only font-bold text-slate-800" style={{ display: isDownloading ? 'block' : 'none' }}>{installationLocation || '(Não informado)'}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
             <div className="flex items-center mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase block mr-2">TAG Interna / SAP</span>
              <TechTooltip 
                title="Controle Interno" 
                content="Código de identificação utilizado no ERP (SAP/Maximo) para apontamento de horas e requisição de materiais."
                position="bottom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400 cursor-help hover:text-blue-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </TechTooltip>
            </div>
            <input type="text" value={internalTag} onChange={(e) => setInternalTag(e.target.value)} placeholder="Opcional..." className="w-full bg-transparent border-b border-slate-200 outline-none text-sm font-bold py-1 no-print"/>
            <div className="hidden print-only font-bold text-slate-800" style={{ display: isDownloading ? 'block' : 'none' }}>{internalTag || '-'}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 lg:col-span-2">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Referência Técnica</span>
            <span className="text-lg font-bold text-slate-800">ISA / NR-37 / IEC 61511</span>
          </div>
        </div>

        {/* Parâmetros de Calibração */}
        {plan.technicalSpecifications && (
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg print-avoid-break">
            <h3 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-4">Parâmetros de Calibração</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <div>
                <TechTooltip title="Definição Metrológica" content={CALIBRATION_TOOLTIPS['Range']}>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 cursor-help border-b border-slate-700 border-dashed inline-block hover:text-slate-200 transition-colors">Range</p>
                </TechTooltip>
                <p className="text-lg font-mono font-bold">{plan.technicalSpecifications.rangeMin} — {plan.technicalSpecifications.rangeMax}</p>
              </div>
              <div>
                <TechTooltip title="Definição Metrológica" content={CALIBRATION_TOOLTIPS['Unidade']}>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 cursor-help border-b border-slate-700 border-dashed inline-block hover:text-slate-200 transition-colors">Unidade</p>
                </TechTooltip>
                <p className="text-lg font-mono font-bold">{plan.technicalSpecifications.unit}</p>
              </div>
              <div>
                <TechTooltip title="Definição Metrológica" content={CALIBRATION_TOOLTIPS['Exatidão']}>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 cursor-help border-b border-slate-700 border-dashed inline-block hover:text-slate-200 transition-colors">Exatidão</p>
                </TechTooltip>
                <p className="text-lg font-mono font-bold text-blue-400">{plan.technicalSpecifications.accuracy}</p>
              </div>
              <div>
                <TechTooltip title="Definição Metrológica" content={CALIBRATION_TOOLTIPS['Sinal Saída']}>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 cursor-help border-b border-slate-700 border-dashed inline-block hover:text-slate-200 transition-colors">Sinal Saída</p>
                </TechTooltip>
                <p className="text-lg font-mono font-bold text-green-400">{plan.technicalSpecifications.expectedSignal}</p>
              </div>
              <div>
                <TechTooltip title="Definição Metrológica" content={CALIBRATION_TOOLTIPS['Tolerância']}>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 cursor-help border-b border-slate-700 border-dashed inline-block hover:text-slate-200 transition-colors">Tolerância</p>
                </TechTooltip>
                <p className="text-lg font-mono font-bold">± 0.5% F.E.</p>
              </div>
            </div>
          </div>
        )}

        {/* Equipe Requerida */}
        <div className="print-avoid-break">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Equipe Técnica Requerida</h3>
          <div className="flex flex-wrap gap-2">
            {plan.personnel.map((person, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{person}</span>
            ))}
          </div>
        </div>

        {/* Procedimentos Técnicos e Checklist */}
        <div className="print-avoid-break">
          <h3 className="text-md font-bold text-slate-900 border-b-2 border-blue-600 pb-2 mb-4 uppercase tracking-wider">Procedimentos Técnicos e Checklist</h3>
          <div className="border border-slate-200 rounded-xl shadow-sm bg-white overflow-visible">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase w-10">#</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase">Ação / Teste</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase">Referência Normativa</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase no-print" data-html2canvas-ignore="true">OK?</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {plan.testProcedures.map((proc, index) => (
                  <tr key={proc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 text-[10px] font-bold text-slate-400">{index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-start space-x-2">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2">
                            <p className="text-[11px] font-bold text-slate-900 leading-tight">{proc.action}</p>
                            <TechTooltip 
                              title="Justificativa Técnica" 
                              content={getProcedureInsight(proc.action, proc.reference)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500 cursor-help no-print" viewBox="0 0 20 20" fill="currentColor" data-html2canvas-ignore="true">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </TechTooltip>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">{proc.details}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex flex-wrap gap-1.5">
                          {renderNormTagsList(proc.reference)}
                       </div>
                    </td>
                    <td className="px-4 py-4 no-print" data-html2canvas-ignore="true"><input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Segurança */}
        {plan.safetyPrecautions && plan.safetyPrecautions.length > 0 && (
          <div 
            className="bg-amber-50 border-l-8 border-amber-500 rounded-r-xl p-6 shadow-md mt-8 print-avoid-break"
            style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
              </div>
              <h3 className="text-lg font-black text-amber-900 uppercase tracking-wider">Precauções de Segurança Críticas</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.safetyPrecautions.map((precaution, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs text-amber-900 bg-white p-3 rounded-lg border border-amber-100 shadow-sm">
                  <span className="flex-shrink-0 w-5 h-5 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                  <p className="leading-snug font-semibold">{precaution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Materiais e Ferramentas */}
        <div className="print-avoid-break mt-8">
          <h3 className="text-md font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-4 uppercase tracking-wider">Materiais e Ferramentas</h3>
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <ul className="space-y-3 list-none">
              {plan.materials.map((material, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <span className="mt-1 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                  <div className="flex-grow">
                    <TechTooltip title="Uso Operacional" content={getMaterialTooltip(material)}>
                      <span className="font-bold cursor-help hover:text-blue-600 transition-colors">{material}</span>
                    </TechTooltip>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Análise de Falhas e Diagnóstico Técnico */}
        <div className="mt-12 print-avoid-break">
           <h3 className="text-md font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-6 uppercase tracking-wider flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.334-.398-1.817a1 1 0 00-1.487-.876 6.752 6.752 0 00-3.326 5.71c0 3.793 3.067 6.86 6.86 6.86 3.793 0 6.86-3.067 6.86-6.86a6.752 6.752 0 00-3.326-5.71 1 1 0 00-1.487.876c0 .483.07 1.137.398 1.817.36.742.75 1.15 1.134 1.29a31.383 31.383 0 01-.613-3.58c-.226-.966-.506-1.93-.84-2.734a12.192 12.192 0 00-.57-1.116c-.208-.322-.477-.65-.822-.88z" clipRule="evenodd" />
              </svg>
              Análise de Falhas e Diagnóstico Técnico
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                 <div className="flex items-center mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Causa Raiz / Diagnóstico</span>
                    <TechTooltip title="Análise de Falha" content={FIELD_TOOLTIPS['rootCause']}>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400 cursor-help" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </TechTooltip>
                 </div>
                 <TechTooltip title="Análise de Falha" content={FIELD_TOOLTIPS['rootCause']} position="bottom">
                    <textarea value={rootCause} onChange={(e) => setRootCause(e.target.value)} placeholder="Descreva a análise técnica da falha..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm no-print min-h-[100px]" data-html2canvas-ignore="true" />
                 </TechTooltip>
                 <div className="hidden print-only border border-slate-300 rounded p-2 min-h-[60px] font-mono text-sm" style={{ display: isDownloading ? 'block' : 'none' }}>{rootCause || 'Nenhuma falha reportada.'}</div>
              </div>
              <div className="flex flex-col">
                 <div className="flex items-center mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Observações Gerais</span>
                    <TechTooltip title="Notas Complementares" content={FIELD_TOOLTIPS['generalObservations']}>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400 cursor-help" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </TechTooltip>
                 </div>
                 <TechTooltip title="Notas Complementares" content={FIELD_TOOLTIPS['generalObservations']} position="bottom">
                    <textarea value={generalObservations} onChange={(e) => setGeneralObservations(e.target.value)} placeholder="Notas técnicas adicionais..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm no-print min-h-[100px]" data-html2canvas-ignore="true" />
                 </TechTooltip>
                 <div className="hidden print-only border border-slate-300 rounded p-2 min-h-[60px] font-mono text-sm" style={{ display: isDownloading ? 'block' : 'none' }}>{generalObservations || 'Sem observações adicionais.'}</div>
              </div>
           </div>
        </div>
        
        {/* Revisão Técnica Especializada */}
        <div className="mt-12 print-avoid-break bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
            <h3 className="text-md font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Revisão Técnica Especializada
            </h3>
            {reviewSavedAt && !isReviewEditing && (
              <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full border border-green-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Registrado em: {reviewSavedAt}
              </span>
            )}
          </div>

          {isReviewEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome do Revisor Técnico</label>
                    <TechTooltip title="Revisão Técnica" content={FIELD_TOOLTIPS['techReviewer']}>
                       <input 
                         type="text" 
                         value={technicalReviewer} 
                         onChange={(e) => setTechnicalReviewer(e.target.value)} 
                         placeholder="Engenheiro / Técnico Responsável"
                         className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                         data-html2canvas-ignore="true"
                       />
                    </TechTooltip>
                    <p className="hidden print-only font-bold text-slate-800 border-b border-slate-200 pb-1" style={{ display: isDownloading ? 'block' : 'none' }}>{technicalReviewer || '__________________________'}</p>
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Data da Revisão</label>
                    <input 
                      type="date" 
                      value={technicalReviewDate} 
                      onChange={(e) => setTechnicalReviewDate(e.target.value)} 
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      data-html2canvas-ignore="true"
                    />
                    <p className="hidden print-only font-mono text-slate-800 border-b border-slate-200 pb-1" style={{ display: isDownloading ? 'block' : 'none' }}>{technicalReviewDate ? new Date(technicalReviewDate).toLocaleDateString('pt-BR') : '___/___/_____'}</p>
                 </div>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Parecer / Comentários Técnicos</label>
                  <TechTooltip title="Parecer da Revisão" content={FIELD_TOOLTIPS['techReviewComments']} position="bottom">
                    <textarea 
                      value={technicalReview} 
                      onChange={(e) => setTechnicalReview(e.target.value)} 
                      placeholder="Observações sobre normas, condições operacionais ou ajustes necessários..."
                      className="w-full h-32 bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      data-html2canvas-ignore="true"
                    />
                  </TechTooltip>
                  <div className="hidden print-only h-32 bg-transparent rounded-lg p-0 text-sm text-slate-700 border border-slate-300 font-medium" style={{ display: isDownloading ? 'block' : 'none' }}>{technicalReview || '(Espaço reservado para parecer técnico)'}</div>
               </div>
            </div>
          ) : (
            <div className="bg-white border-l-4 border-green-500 rounded-r-lg shadow-sm p-5 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
               <div className="md:col-span-1 space-y-4 border-r border-slate-100 pr-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Revisor Responsável</span>
                    <p className="text-sm font-bold text-slate-900">{technicalReviewer}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Data da Aprovação</span>
                    <p className="text-sm font-mono text-slate-700">{technicalReviewDate ? new Date(technicalReviewDate).toLocaleDateString('pt-BR') : '-'}</p>
                  </div>
               </div>
               <div className="md:col-span-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Parecer Técnico</span>
                  <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 italic border border-slate-100">
                    "{technicalReview || 'Nenhuma observação registrada.'}"
                  </div>
               </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end no-print" data-html2canvas-ignore="true">
            {isReviewEditing ? (
              <button 
                onClick={handleSaveReview}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586l-1.293-1.293z" />
                </svg>
                Salvar Revisão
              </button>
            ) : (
              <button 
                onClick={() => setIsReviewEditing(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Editar Revisão
              </button>
            )}
          </div>
        </div>

        {/* Validação e Assinaturas */}
        <div className="mt-12 print-break-before">
          <h3 className="text-md font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-6 uppercase tracking-wider">Validação da Manutenção</h3>
          
          <div className="space-y-8 print-avoid-break" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 no-print" data-html2canvas-ignore="true">
              <label className="flex items-center space-x-4 cursor-pointer">
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Verificação de Segurança Aprovada?</span>
                <select ref={securityApprovedRef} value={securityApproved} onChange={(e) => setSecurityApproved(e.target.value)} className={getFieldClass(securityApproved, true)}>
                  <option value="">Selecione...</option>
                  <option value="Sim">Sim - Protocolos cumpridos</option>
                  <option value="Não">Não - Existem pendências</option>
                </select>
              </label>
            </div>

            <div className="hidden print-only font-bold text-green-700 text-xs mb-4 uppercase" style={{ display: isDownloading ? 'block' : 'none' }}>[ X ] VERIFICAÇÃO DE SEGURANÇA APROVADA E VALIDADA EM CAMPO</div>

            <div className="space-y-4">
              <div className="flex flex-col text-[10px]">
                <span className="font-bold text-slate-500 uppercase mb-2">Observações Detalhadas de Campo:</span>
                <TechTooltip title="Notas de Campo" content={FIELD_TOOLTIPS['fieldObservations']} position="bottom">
                  <textarea value={fieldObservations} onChange={(e) => setFieldObservations(e.target.value)} placeholder="Notas de campo..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm no-print" data-html2canvas-ignore="true" />
                </TechTooltip>
                <div className="hidden print-only border border-slate-300 rounded p-2 min-h-[40px] font-mono text-sm" style={{ display: isDownloading ? 'block' : 'none' }}>{fieldObservations || 'Nenhuma observação registrada.'}</div>
              </div>

              <div className="flex flex-col text-[10px]">
                <span className="font-bold text-slate-500 uppercase mb-2">Parecer Técnico Final (Engenharia):</span>
                <TechTooltip title="Parecer de Engenharia" content={FIELD_TOOLTIPS['engConclusion']} position="bottom">
                  <textarea ref={engConclusionRef} value={engConclusion} onChange={(e) => setEngConclusion(e.target.value)} className={`${getFieldClass(engConclusion)} min-h-[60px] no-print`} data-html2canvas-ignore="true" />
                </TechTooltip>
                <div className="hidden print-only border border-slate-300 rounded p-2 min-h-[60px] font-mono text-sm" style={{ display: isDownloading ? 'block' : 'none' }}>{engConclusion || 'Aguardando parecer final.'}</div>
              </div>
            </div>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mt-12 print-avoid-break" 
            style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
          >
            <div className="border-t border-slate-900 pt-2">
              <div className="flex items-center mb-4">
                 <TechTooltip
                    title="Responsabilidade Técnica"
                    content="O executante atesta que todos os passos foram realizados conforme descrito e que os valores registrados são verídicos. A matrícula é obrigatória para rastreabilidade."
                    position="top"
                 >
                    <p className="font-black text-[11px] uppercase cursor-help border-b border-dashed border-slate-400 inline-block">Assinatura Executante</p>
                 </TechTooltip>
              </div>
              <div className="flex flex-col mt-4 space-y-2">
                <input ref={execNomeRef} type="text" placeholder="NOME COMPLETO" value={executante.nome} onChange={(e) => setExecutante({ ...executante, nome: e.target.value })} className={getFieldClass(executante.nome)} />
                <div className="flex space-x-2">
                    <input ref={execMatRef} type="text" placeholder="MATRÍCULA" value={executante.matricula} onChange={(e) => setExecutante({ ...executante, matricula: e.target.value })} className={getFieldClass(executante.matricula)} />
                    <input 
                      ref={execDataRef} 
                      type="date" 
                      value={executante.data} 
                      onFocus={() => { if(!executante.data) setExecutante({ ...executante, data: getCurrentDate() }) }}
                      onChange={(e) => setExecutante({ ...executante, data: e.target.value })} 
                      className={getFieldClass(executante.data)} 
                    />
                </div>
              </div>
            </div>
            <div className="border-t border-slate-900 pt-2">
              <div className="flex items-center mb-4">
                 <TechTooltip
                    title="Validação e Liberação"
                    content="O supervisor confirma que o trabalho foi realizado com segurança, que a área está limpa e o equipamento pode retornar à operação normal. Carimbo funcional exigido."
                    position="top"
                 >
                    <p className="font-black text-[11px] uppercase cursor-help border-b border-dashed border-slate-400 inline-block">Validação Supervisor</p>
                 </TechTooltip>
              </div>
              <div className="flex flex-col mt-4 space-y-2">
                <TechTooltip title="Nome do Supervisor" content={FIELD_TOOLTIPS['supName']} position="top">
                  <input ref={supNomeRef} type="text" placeholder="NOME COMPLETO" value={supervisor.nome} onChange={(e) => setSupervisor({ ...supervisor, nome: e.target.value })} className={getFieldClass(supervisor.nome)} />
                </TechTooltip>
                <div className="flex space-x-2">
                    <TechTooltip title="Carimbo Funcional" content={FIELD_TOOLTIPS['supCarimbo']} position="top" align="left">
                      <input ref={supCarimboRef} type="text" placeholder="Nº CARIMBO" value={supervisor.carimbo} onChange={(e) => setSupervisor({ ...supervisor, carimbo: e.target.value })} className={getFieldClass(supervisor.carimbo)} />
                    </TechTooltip>
                    <TechTooltip title="Data de Liberação" content={FIELD_TOOLTIPS['supDate']} position="top" align="right">
                      <input 
                        ref={supDataRef} 
                        type="date" 
                        value={supervisor.data} 
                        onFocus={() => { if(!supervisor.data) setSupervisor({ ...supervisor, data: getCurrentDate() }) }}
                        onChange={(e) => setSupervisor({ ...supervisor, data: e.target.value })} 
                        className={getFieldClass(supervisor.data)} 
                        aria-label="Data da Supervisão" 
                      />
                    </TechTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* LOG DE RASTREABILIDADE (Audit Trail) */}
        <div className="mt-16 no-print border-t border-slate-200 pt-8" data-html2canvas-ignore="true">
           <div 
              className="bg-slate-100 rounded-xl border border-slate-200 overflow-hidden cursor-pointer transition-all hover:border-slate-300"
              onClick={() => setIsLogOpen(!isLogOpen)}
           >
              <div className="p-4 flex items-center justify-between">
                 <div className="flex items-center">
                    <div className="bg-slate-800 p-1.5 rounded mr-3">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                       </svg>
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Log de Rastreabilidade Técnica (Audit Trail)</h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase">{logEntries.length} registros de alterações manuais</p>
                    </div>
                 </div>
                 <div className={`transform transition-transform duration-300 ${isLogOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                 </div>
              </div>
              
              {isLogOpen && (
                 <div className="bg-white border-t border-slate-200 animate-in slide-in-from-top-2 duration-300 overflow-x-auto">
                    {logEntries.length > 0 ? (
                       <table className="min-w-full divide-y divide-slate-100 text-left">
                          <thead className="bg-slate-50">
                             <tr>
                                <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase">Data/Hora</th>
                                <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase">Usuário</th>
                                <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase">Campo</th>
                                <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase">De</th>
                                <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase">Para</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {logEntries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-4 py-2 text-[10px] font-mono text-slate-500 whitespace-nowrap">{entry.timestamp}</td>
                                   <td className="px-4 py-2 text-[10px] font-bold text-slate-700">{entry.user}</td>
                                   <td className="px-4 py-2 text-[10px] font-black text-blue-600 uppercase tracking-tighter">{entry.fieldName}</td>
                                   <td className="px-4 py-2 text-[10px] text-slate-400 italic truncate max-w-[150px]">{entry.oldValue}</td>
                                   <td className="px-4 py-2 text-[10px] text-slate-800 font-medium truncate max-w-[150px]">{entry.newValue}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    ) : (
                       <div className="p-8 text-center">
                          <p className="text-xs text-slate-400 italic">Nenhuma alteração registrada após a criação do documento.</p>
                       </div>
                    )}
                 </div>
              )}
           </div>
           <p className="text-[9px] text-slate-400 mt-2 italic px-2">
              * O histórico acima registra apenas alterações feitas manualmente nos campos de texto e status. Dados gerados pela IA não constam no log.
           </p>
        </div>
      </div>
    </div>
  );
};

export default PlanDisplay;
