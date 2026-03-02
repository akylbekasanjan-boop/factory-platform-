'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Calendar,
  DollarSign,
  Users,
  Package,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  File,
  Search,
  Clock,
  X,
  Plus,
  Printer
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'financial' | 'production' | 'hr' | 'sales' | 'tax' | 'inventory';
  size: number;
  date: string;
  uploadedBy: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  factoryId?: string;
  period?: string;
}

const STORAGE_KEY = 'reports_data';

export default function ReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newReport, setNewReport] = useState<Partial<Report>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setReports(JSON.parse(stored));
    }
  }, []);

  const saveReports = (data: Report[]) => {
    setReports(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const reportTypes = [
    { id: 'all', label: 'Все типы', icon: File },
    { id: 'financial', label: 'Финансовые', icon: DollarSign },
    { id: 'production', label: 'Производство', icon: Package },
    { id: 'hr', label: 'Кадровые', icon: Users },
    { id: 'sales', label: 'Продажи', icon: FileSpreadsheet },
    { id: 'tax', label: 'Налоговые', icon: FileText },
    { id: 'inventory', label: 'Склад', icon: Package },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newReports: Report[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: detectType(file.name),
      size: file.size,
      date: new Date().toLocaleDateString('ru-RU'),
      uploadedBy: 'Пользователь',
      description: '',
      status: 'pending' as const,
    }));
    saveReports([...reports, ...newReports]);
  };

  const detectType = (filename: string): Report['type'] => {
    const name = filename.toLowerCase();
    if (name.includes('фин') || name.includes('fin') || name.includes('бух')) return 'financial';
    if (name.includes('произв') || name.includes('prod')) return 'production';
    if (name.includes('кадр') || name.includes('hr') || name.includes('сотрудн')) return 'hr';
    if (name.includes('продаж') || name.includes('sale')) return 'sales';
    if (name.includes('налог') || name.includes('tax')) return 'tax';
    if (name.includes('склад') || name.includes('stock')) return 'inventory';
    return 'financial';
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const deleteReport = (id: string) => {
    if (confirm('Удалить этот отчёт?')) {
      saveReports(reports.filter(r => r.id !== id));
    }
  };

  const updateStatus = (id: string, status: Report['status']) => {
    saveReports(reports.map(r => r.id === id ? { ...r, status } : r));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'production': return <Package className="w-5 h-5 text-blue-600" />;
      case 'hr': return <Users className="w-5 h-5 text-purple-600" />;
      case 'sales': return <FileSpreadsheet className="w-5 h-5 text-orange-600" />;
      case 'tax': return <FileText className="w-5 h-5 text-red-600" />;
      case 'inventory': return <Package className="w-5 h-5 text-cyan-600" />;
      default: return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const found = reportTypes.find(t => t.id === type);
    return found ? found.label : type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Одобрен';
      case 'rejected': return 'Отклонён';
      case 'pending': return 'На проверке';
      default: return status;
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesType = selectedType === 'all' || r.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    approved: reports.filter(r => r.status === 'approved').length,
    financial: reports.filter(r => r.type === 'financial').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📁 Отчёты и документы</h2>
          <p className="text-gray-600 mt-1">Загрузка и управление документами для бухгалтерии</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" />
          Загрузить отчёт
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <File className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Всего</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">На проверке</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Одобрено</p>
              <p className="text-xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Финансовых</p>
              <p className="text-xl font-bold text-gray-900">{stats.financial}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Upload Zone */}
      <div 
        className={`bg-white rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
          accept=".xlsx,.xls,.pdf,.doc,.docx,.jpg,.png,.csv"
        />
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Upload className="w-7 h-7 text-blue-600" />
          </div>
          <p className="text-gray-700 font-medium mb-1">Перетащите файлы сюда</p>
          <p className="text-sm text-gray-500 mb-3">или</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Выбрать файлы
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Excel, PDF, Word, CSV, изображения (до 10 МБ)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="all">Все статусы</option>
              <option value="pending">На проверке</option>
              <option value="approved">Одобрено</option>
              <option value="rejected">Отклонено</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Нет отчётов</h3>
            <p className="text-gray-500">Загрузите первый документ для начала работы</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{report.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusLabel(report.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {report.date}
                      </span>
                      <span>{formatFileSize(report.size)}</span>
                      <span>{getTypeLabel(report.type)}</span>
                      <span>Загрузил: {report.uploadedBy}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(report.id, 'approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Одобрить"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => updateStatus(report.id, 'rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Отклонить"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Просмотр"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Скачать"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteReport(report.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">💡 Для бухгалтерии</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Загружайте банковские выписки, счета и акты в формате Excel или PDF</li>
              <li>• Используйте категории для сортировки документов</li>
              <li>• Статус "На проверке" поможет отслеживать обработку документов</li>
              <li>• Добавляйте описания для быстрого поиска нужных отчётов</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">📤 Загрузить отчёт</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-900" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">Нажмите для выбора файла</p>
                <p className="text-sm text-gray-500 mt-1">Excel, PDF, Word, CSV</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип отчёта
                </label>
                <select
                  value={newReport.type || 'financial'}
                  onChange={(e) => setNewReport({ ...newReport, type: e.target.value as Report['type'] })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  {reportTypes.filter(t => t.id !== 'all').map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={newReport.description || ''}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  placeholder="Краткое описание документа..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Период
                </label>
                <input
                  type="text"
                  value={newReport.period || ''}
                  onChange={(e) => setNewReport({ ...newReport, period: e.target.value })}
                  placeholder="Например: Январь 2024"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900"
              >
                Отмена
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Загрузить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">📄 Детали отчёта</h3>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-900" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                {getTypeIcon(selectedReport.type)}
                <div>
                  <p className="font-medium text-gray-900">{selectedReport.name}</p>
                  <p className="text-sm text-gray-500">{getTypeLabel(selectedReport.type)}</p>
                </div>
                <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReport.status)}`}>
                  {getStatusLabel(selectedReport.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Размер</p>
                  <p className="font-medium text-gray-900">{formatFileSize(selectedReport.size)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Дата загрузки</p>
                  <p className="font-medium text-gray-900">{selectedReport.date}</p>
                </div>
                <div>
                  <p className="text-gray-500">Загрузил</p>
                  <p className="font-medium text-gray-900">{selectedReport.uploadedBy}</p>
                </div>
                <div>
                  <p className="text-gray-500">Период</p>
                  <p className="font-medium text-gray-900">{selectedReport.period || 'Не указан'}</p>
                </div>
              </div>

              {selectedReport.description && (
                <div>
                  <p className="text-gray-500 text-sm">Описание</p>
                  <p className="text-gray-900">{selectedReport.description}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setSelectedReport(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900"
              >
                Закрыть
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 text-gray-900">
                <Printer className="w-4 h-4" />
                Печать
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Скачать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}