'use client';

import { useState, useRef } from 'react';
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
  BookOpen,
  PlayCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  date: string;
  category: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function ReportsView() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', label: 'Все отчёты' },
    { id: 'financial', label: '💰 Финансовые' },
    { id: 'production', label: '🏭 Производственные' },
    { id: 'hr', label: '👥 Кадровые' },
    { id: 'sales', label: '📊 Продажи' },
  ];

  const faqItems: FAQItem[] = [
    {
      question: 'Как загрузить отчёт?',
      answer: 'Нажмите на область загрузки или перетащите файл в неё. Поддерживаются форматы Excel, PDF, Word и изображения. После загрузки файл появится в списке.'
    },
    {
      question: 'Какие форматы файлов поддерживаются?',
      answer: 'Вы можете загружать файлы в форматах: .xlsx, .xls (Excel), .pdf, .doc, .docx (Word), .jpg, .png (изображения). Максимальный размер файла - 10 МБ.'
    },
    {
      question: 'Как посмотреть финансы?',
      answer: 'Перейдите в раздел "Финансы" в боковом меню. Там вы увидите выручку, расходы, прибыль и рентабельность. Данные обновляются в реальном времени.'
    },
    {
      question: 'Как добавить новый заказ?',
      answer: 'Перейдите в раздел "Производство". Нажмите кнопку "Добавить заказ" в правом верхнем углу. Заполните форму с данными заказа и назначьте фабрику.'
    },
    {
      question: 'Как посмотреть список сотрудников?',
      answer: 'Нажмите "Сотрудники" в боковом меню. Здесь вы найдёте информацию о всех работниках, их зарплатах, эффективности и посещаемости.'
    },
    {
      question: 'Что делать если забыли пароль?',
      answer: 'Обратитесь к администратору системы для сброса пароля. В демо-версии используйте логин: admin, пароль: admin123'
    },
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
    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.name.split('.').pop() || 'unknown',
      size: file.size,
      date: new Date().toLocaleDateString('ru-RU'),
      category: selectedCategory === 'all' ? 'financial' : selectedCategory,
    }));
    setUploadedFiles((prev) => [...newFiles, ...prev]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const deleteFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Байт';
    const k = 1024;
    const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'xlsx':
      case 'xls':
        return <FileText className="w-8 h-8 text-green-600" />;
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case 'jpg':
      case 'png':
        return <FileText className="w-8 h-8 text-purple-600" />;
      default:
        return <FileText className="w-8 h-8 text-gray-600" />;
    }
  };

  const filteredFiles = selectedCategory === 'all' 
    ? uploadedFiles 
    : uploadedFiles.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">📁 Загрузка отчётов</h2>
        <p className="text-gray-600 mt-1">
          Загружайте и управляйте отчётами для бухгалтерии и аналитики
        </p>
      </div>

      {/* Upload Area */}
      <div 
        className={`bg-white rounded-xl border-2 border-dashed p-8 text-center transition-all ${
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
          accept=".xlsx,.xls,.pdf,.doc,.docx,.jpg,.png"
        />
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Перетащите файлы сюда
          </h3>
          <p className="text-gray-500 mb-4">
            или нажмите для выбора файлов
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Выбрать файлы
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Поддерживаются: Excel, PDF, Word, JPG, PNG (до 10 МБ)
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Uploaded Files List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Загруженные файлы ({filteredFiles.length})
          </h3>
        </div>
        
        {filteredFiles.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Файлы пока не загружены</p>
            <p className="text-sm text-gray-400">Загрузите отчёты выше</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFiles.map((file) => (
              <div key={file.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{file.name}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {file.date}
                    </span>
                    <span>{formatFileSize(file.size)}</span>
                    <span className="capitalize">{file.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteFile(file.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Финансовых</p>
            <p className="text-xl font-bold text-gray-900">
              {uploadedFiles.filter(f => f.category === 'financial').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Производственных</p>
            <p className="text-xl font-bold text-gray-900">
              {uploadedFiles.filter(f => f.category === 'production').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Кадровых</p>
            <p className="text-xl font-bold text-gray-900">
              {uploadedFiles.filter(f => f.category === 'hr').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Всего файлов</p>
            <p className="text-xl font-bold text-gray-900">{uploadedFiles.length}</p>
          </div>
        </div>
      </div>

      {/* Training Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">📚 Обучение и помощь</h2>
            <p className="text-blue-100">Изучите возможности платформы</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <a href="#" className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors flex items-center gap-3">
            <PlayCircle className="w-8 h-8" />
            <div>
              <p className="font-semibold">Видео-уроки</p>
              <p className="text-sm text-blue-100">Начните здесь</p>
            </div>
          </a>
          <a href="#" className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <p className="font-semibold">Руководство</p>
              <p className="text-sm text-blue-100">Подробная документация</p>
            </div>
          </a>
          <a href="#" className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors flex items-center gap-3">
            <HelpCircle className="w-8 h-8" />
            <div>
              <p className="font-semibold">Поддержка</p>
              <p className="text-sm text-blue-100">Связаться с нами</p>
            </div>
          </a>
        </div>

        {/* FAQ */}
        <div className="bg-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">❓ Частые вопросы</h3>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium">{item.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4 text-blue-100">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">💡 Советы для начала работы</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Используйте демо-данные (логин: admin, пароль: admin123) для знакомства с системой</li>
              <li>• Загружайте отчёты в разделе "Отчёты" для бухгалтерии</li>
              <li>• Следите за финансами в разделе "Финансы" - там показана выручка, расходы и прибыль</li>
              <li>• Добавляйте заказы в разделе "Производство"</li>
              <li>• Просматривайте статистику сотрудников в разделе "Сотрудники"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}