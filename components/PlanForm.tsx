
import React, { useState } from 'react';
import { InstrumentType, PlatformType, MaintenancePlan } from '../types';

interface PlanFormProps {
  onSubmit: (instrument: InstrumentType, platform: PlatformType, tag: string) => void;
  isLoading: boolean;
  history: MaintenancePlan[];
}

interface FormErrors {
  instrument?: string;
  platform?: string;
  tag?: string;
  general?: string;
}

const PlanForm: React.FC<PlanFormProps> = ({ onSubmit, isLoading, history }) => {
  const [instrument, setInstrument] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');
  const [tag, setTag] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isShaking, setIsShaking] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const normalizedTag = tag.trim().toUpperCase();
    let hasEmptyFields = false;
    
    // Validação de Instrumento
    if (!instrument) {
      newErrors.instrument = 'O tipo de instrumento é obrigatório.';
      hasEmptyFields = true;
    }
    
    // Validação de Plataforma
    if (!platform) {
      newErrors.platform = 'A unidade de instalação é obrigatória.';
      hasEmptyFields = true;
    }
    
    // Validação de TAG
    if (!tag.trim()) {
      newErrors.tag = 'O TAG do equipamento é obrigatório para identificação.';
      hasEmptyFields = true;
    } else if (tag.trim().length < 3) {
      newErrors.tag = 'O TAG deve ter pelo menos 3 caracteres técnicos.';
    }

    // Mensagem de erro geral para campos vazios
    if (hasEmptyFields) {
      newErrors.general = 'Verificação de dados pendente: Por favor, preencha todos os campos obrigatórios destacados em vermelho.';
    }

    // Verificação de duplicidade no histórico (apenas se os campos básicos estiverem preenchidos)
    if (!hasEmptyFields && !newErrors.tag) {
      const isDuplicate = history.some(plan => 
        plan.instrumentType === instrument && 
        plan.platformType === platform && 
        plan.tag.toUpperCase() === normalizedTag
      );

      if (isDuplicate) {
        newErrors.general = `Conflito de Registro: Já existe um plano gerado para ${instrument} com a TAG ${normalizedTag} nesta unidade.`;
      }
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(instrument as InstrumentType, platform as PlatformType, tag.trim());
    }
  };

  const getSelectClass = (error?: string) => `
    w-full bg-slate-50 border text-slate-900 text-sm rounded-lg block p-2.5 transition-all outline-none
    ${error 
      ? 'border-red-500 ring-2 ring-red-100 bg-red-50 focus:border-red-600 focus:ring-red-200' 
      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}
    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const getInputClass = (error?: string) => `
    w-full bg-slate-50 border text-slate-900 text-sm rounded-lg block p-2.5 transition-all outline-none
    ${error 
      ? 'border-red-500 ring-2 ring-red-100 bg-red-50 focus:border-red-600 focus:ring-red-200' 
      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}
    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <section className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 no-print transition-transform ${isShaking ? 'animate-shake' : ''}`}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
      
      <h2 className="text-lg font-bold mb-6 flex items-center text-slate-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        Configuração de Nova Intervenção Preventiva
      </h2>

      {errors.general && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-in fade-in slide-in-from-top-2 duration-300" role="alert">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800 font-bold uppercase tracking-tight">{errors.general}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Campo Instrumento */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Tipo de Instrumento</label>
          <select 
            value={instrument}
            disabled={isLoading}
            aria-invalid={!!errors.instrument}
            onChange={(e) => {
              setInstrument(e.target.value);
              if (errors.instrument) setErrors(prev => ({ ...prev, instrument: undefined, general: undefined }));
            }}
            className={getSelectClass(errors.instrument)}
          >
            <option value="">Selecione o instrumento...</option>
            {Object.values(InstrumentType).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
          {errors.instrument && (
            <p className="text-[10px] text-red-600 font-black uppercase tracking-tighter mt-1 flex items-center">
              <span className="mr-1">●</span> {errors.instrument}
            </p>
          )}
        </div>

        {/* Campo Plataforma */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Instalação / Unidade</label>
          <select 
            value={platform}
            disabled={isLoading}
            aria-invalid={!!errors.platform}
            onChange={(e) => {
              setPlatform(e.target.value);
              if (errors.platform) setErrors(prev => ({ ...prev, platform: undefined, general: undefined }));
            }}
            className={getSelectClass(errors.platform)}
          >
            <option value="">Selecione a plataforma...</option>
            {Object.values(PlatformType).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
          {errors.platform && (
            <p className="text-[10px] text-red-600 font-black uppercase tracking-tighter mt-1 flex items-center">
              <span className="mr-1">●</span> {errors.platform}
            </p>
          )}
        </div>

        {/* Campo TAG */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Identificação TAG</label>
          <input 
            type="text"
            value={tag}
            disabled={isLoading}
            aria-invalid={!!errors.tag}
            onChange={(e) => {
              setTag(e.target.value);
              if (errors.tag) setErrors(prev => ({ ...prev, tag: undefined, general: undefined }));
            }}
            placeholder="Ex: PT-1010A"
            className={getInputClass(errors.tag)}
          />
          {errors.tag && (
            <p className="text-[10px] text-red-600 font-black uppercase tracking-tighter mt-1 flex items-center">
              <span className="mr-1">●</span> {errors.tag}
            </p>
          )}
        </div>

        <div className="md:col-span-3 pt-2">
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-black text-white uppercase tracking-widest transition-all flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl active:scale-[0.98] ${
              isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processando Inteligência...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>Gerar Plano de Manutenção</span>
              </>
            )}
          </button>
          
          {!isLoading && (
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
              Campos baseados em normas ISA/IEC e NR-37
            </p>
          )}
        </div>
      </form>
    </section>
  );
};

export default PlanForm;
