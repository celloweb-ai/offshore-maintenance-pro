
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const normalizedTag = tag.trim().toUpperCase();
    
    if (!instrument) {
      newErrors.instrument = 'Selecione o tipo de instrumento.';
    }
    
    if (!platform) {
      newErrors.platform = 'Selecione o tipo de plataforma.';
    }
    
    if (!tag.trim()) {
      newErrors.tag = 'O TAG do equipamento é obrigatório.';
    } else if (tag.trim().length < 3) {
      newErrors.tag = 'O TAG deve ter pelo menos 3 caracteres.';
    }

    // Verificação de duplicidade no histórico
    if (!newErrors.instrument && !newErrors.platform && !newErrors.tag) {
      const isDuplicate = history.some(plan => 
        plan.instrumentType === instrument && 
        plan.platformType === platform && 
        plan.tag.toUpperCase() === normalizedTag
      );

      if (isDuplicate) {
        newErrors.general = `Já existe um plano gerado para o instrumento ${instrument} com a TAG ${normalizedTag} nesta unidade. Verifique o histórico abaixo.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(instrument as InstrumentType, platform as PlatformType, tag.trim());
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 no-print">
      <h2 className="text-lg font-semibold mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        Gerar Novo Plano de Manutenção
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Campo Instrumento */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Instrumento</label>
          <select 
            value={instrument}
            onChange={(e) => {
              setInstrument(e.target.value);
              setErrors(prev => ({ ...prev, instrument: undefined, general: undefined }));
            }}
            className={`w-full bg-slate-50 border ${errors.instrument ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all`}
          >
            <option value="">Selecione o instrumento...</option>
            {Object.values(InstrumentType).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
          {errors.instrument && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.instrument}</p>}
        </div>

        {/* Campo Plataforma */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Instalação / Plataforma</label>
          <select 
            value={platform}
            onChange={(e) => {
              setPlatform(e.target.value);
              setErrors(prev => ({ ...prev, platform: undefined, general: undefined }));
            }}
            className={`w-full bg-slate-50 border ${errors.platform ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all`}
          >
            <option value="">Selecione a plataforma...</option>
            {Object.values(PlatformType).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
          {errors.platform && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.platform}</p>}
        </div>

        {/* Campo TAG */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">TAG do Equipamento</label>
          <input 
            type="text"
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
              setErrors(prev => ({ ...prev, tag: undefined, general: undefined }));
            }}
            placeholder="Ex: PT-1010A, XV-2020"
            className={`w-full bg-slate-50 border ${errors.tag ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all`}
          />
          {errors.tag && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.tag}</p>}
        </div>

        {errors.general && (
          <div className="md:col-span-3 bg-amber-50 border-l-4 border-amber-500 p-4 rounded animate-in fade-in duration-300">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-amber-800 font-medium">{errors.general}</p>
            </div>
          </div>
        )}

        <div className="md:col-span-3">
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all flex items-center justify-center space-x-2 ${
              isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processando dados técnicos...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>Gerar Plano de Manutenção Técnica</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PlanForm;
