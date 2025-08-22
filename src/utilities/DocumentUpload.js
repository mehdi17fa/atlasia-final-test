import React, { useState, useCallback, useEffect } from 'react';
import SectionTitle from '../components/shared/SectionTitle';
const REQUIRED_DOCUMENTS = [
  {
    id: 'kbis',
    name: 'KBIS (moins de 3 mois)',
    description: 'Extrait KBIS de votre auto-entreprise daté de moins de 3 mois',
    required: true,
  },
  {
    id: 'identity',
    name: 'Pièce d\'identité',
    description: 'Carte nationale d\'identité, passeport ou permis de conduire',
    required: true,
  },
  {
    id: 'address',
    name: 'Justificatif de domicile',
    description: 'Facture (électricité, gaz, téléphone) ou attestation de domicile récente',
    required: true,
  },
  {
    id: 'insurance',
    name: 'Attestation d\'assurance',
    description: 'Attestation d\'assurance responsabilité civile professionnelle',
    required: true,
  },
];

const ACCEPTED_FORMATS = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function DocumentUpload() {
  const [documents, setDocuments] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ✅ Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(documents).forEach((doc) => {
        if (doc?.previewUrl) URL.revokeObjectURL(doc.previewUrl);
      });
    };
  }, [documents]);

  const validateFile = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_FORMATS.includes(extension)) {
      return `Format non supporté. Formats acceptés: ${ACCEPTED_FORMATS.join(', ').toUpperCase()}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Fichier trop volumineux. Taille maximum: 10MB';
    }
    return null;
  };

  const simulateUpload = (file, documentId) => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadProgress((prev) => ({ ...prev, [documentId]: 100 }));
          Math.random() > 0.9 ? reject(new Error('Erreur réseau. Veuillez réessayer.')) : resolve();
        } else {
          setUploadProgress((prev) => ({ ...prev, [documentId]: Math.floor(progress) }));
        }
      }, 200);
    });
  };

  const handleFileSelect = useCallback(async (files, documentId) => {
    const file = files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, [documentId]: error }));
      return;
    }

    setErrors((prev) => ({ ...prev, [documentId]: null }));
    setUploadProgress((prev) => ({ ...prev, [documentId]: 0 }));

    try {
      await simulateUpload(file, documentId);
      const previewUrl = URL.createObjectURL(file);
      setDocuments((prev) => ({
        ...prev,
        [documentId]: {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl,
          uploaded: true,
        },
      }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [documentId]: error.message }));
      setUploadProgress((prev) => ({ ...prev, [documentId]: 0 }));
    }
  }, []);

  const handleDrop = useCallback((e, documentId) => {
    e.preventDefault();
    setDragOver(null);
    handleFileSelect(e.dataTransfer.files, documentId);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e, documentId) => {
    e.preventDefault();
    setDragOver(documentId);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(null);
  }, []);

  const removeDocument = (documentId) => {
    setDocuments((prev) => {
      const newDocs = { ...prev };
      if (newDocs[documentId]?.previewUrl) {
        URL.revokeObjectURL(newDocs[documentId].previewUrl);
      }
      delete newDocs[documentId];
      return newDocs;
    });
    setErrors((prev) => ({ ...prev, [documentId]: null }));
    setUploadProgress((prev) => ({ ...prev, [documentId]: 0 }));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="w-8 h-8 bg-atlasia-sage rounded flex items-center justify-center">
          <span className="text-atlasia-dark font-bold text-lg">IMG</span>
        </div>
      );
    }
    if (file.type === 'application/pdf') {
      return (
        <div className="w-8 h-8 bg-atlasia-sage rounded flex items-center justify-center">
          <span className="text-atlasia-dark font-bold text-lg">PDF</span>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-atlasia-sage rounded flex items-center justify-center">
        <span className="text-atlasia-dark font-bold text-lg">DOC</span>
      </div>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canSubmit = REQUIRED_DOCUMENTS.every((doc) => documents[doc.id]?.uploaded);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleBack = () => {
    window.history.back();
  };

  const openPreview = (document) => setPreviewDocument(document);
  const closePreview = () => setPreviewDocument(null);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-atlasia-sage rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-atlasia-dark text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Documents envoyés !</h2>
          <p className="text-gray-600 mb-6">Vos documents ont été envoyés avec succès. Notre équipe les examinera dans les 24-48h.</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-atlasia-dark text-white py-3 px-4 rounded-xl font-medium hover:bg-atlasia-sage transition-colors"
          >
            Continuer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto relative">
        <button
          onClick={handleBack}
          className="absolute top-0 left-0 p-2 bg-atlasia-dark text-white rounded-full hover:bg-atlasia-sage transition-colors"
          title="Retour"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-xl">✕</span>
          </div>
        </button>
        <div className="text-center mb-8">
          <SectionTitle title="Vérification de votre compte" />
          <p className="text-gray-600 max-w-2xl mx-auto">Pour activer votre compte auto-entrepreneur, veuillez télécharger les documents suivants. Tous les documents sont obligatoires.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Documents requis ({Object.keys(documents).filter((key) => documents[key]?.uploaded).length}/{REQUIRED_DOCUMENTS.length})
          </h2>
          <div className="space-y-3">
            {REQUIRED_DOCUMENTS.map((doc) => {
              const isCompleted = documents[doc.id]?.uploaded;
              return (
                <div key={doc.id} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-atlasia-sage text-atlasia-dark' : 'bg-gray-100 text-gray-400'}`}>
                    {isCompleted ? (
                      <span className="text-sm">✓</span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isCompleted ? 'text-atlasia-dark' : 'text-gray-700'}`}>{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          {REQUIRED_DOCUMENTS.map((doc) => {
            const document = documents[doc.id];
            const progress = uploadProgress[doc.id];
            const error = errors[doc.id];
            const isDragOver = dragOver === doc.id;

            return (
              <div key={doc.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>
                  {document?.uploaded && (
                    <div className="w-6 h-6 bg-atlasia-sage rounded-full flex items-center justify-center text-atlasia-dark">
                      <span className="text-sm">✓</span>
                    </div>
                  )}
                </div>

                {!document ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragOver ? 'border-atlasia-dark bg-atlasia-sage/20' : 'border-gray-300 hover:border-gray-400'}`}
                    onDrop={(e) => handleDrop(e, doc.id)}
                    onDragOver={(e) => handleDragOver(e, doc.id)}
                    onDragLeave={handleDragLeave}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <span className="text-2xl">↑</span>
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">Glissez-déposez votre fichier ici</p>
                    <p className="text-sm text-gray-500 mb-4">ou cliquez pour sélectionner</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleFileSelect(e.target.files, doc.id)}
                      className="hidden"
                      id={`file-${doc.id}`}
                    />
                    <label
                      htmlFor={`file-${doc.id}`}
                      className="inline-flex items-center px-4 py-2 bg-atlasia-dark text-white rounded-lg hover:bg-atlasia-sage cursor-pointer transition-colors"
                    >
                      Sélectionner un fichier
                    </label>
                    <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG, DOC - Max 10MB</p>
                  </div>
                ) : (
                  <div className="border rounded-xl p-4">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(document)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{document.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(document.size)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openPreview(document)}
                          className="p-2 text-atlasia-dark hover:text-atlasia-sage transition-colors"
                          title="Prévisualiser"
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <span className="text-lg">👁</span>
                          </div>
                        </button>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="p-2 text-atlasia-dark hover:text-atlasia-sage transition-colors"
                          title="Supprimer"
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <span className="text-lg">✕</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    {progress > 0 && progress < 100 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Téléchargement...</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-atlasia-dark h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      <span className="text-sm">!</span>
                    </div>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              canSubmit && !isSubmitting
                ? 'bg-atlasia-dark text-white hover:bg-atlasia-sage shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer les documents'}
          </button>
          {!canSubmit && (
            <p className="text-sm text-gray-500 mt-2">
              Veuillez télécharger tous les documents requis avant de continuer
            </p>
          )}
        </div>
      </div>

      {previewDocument && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-4xl max-h-full w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{previewDocument.name}</h3>
              <button
                onClick={closePreview}
                className="p-2 bg-atlasia-dark text-white rounded-full hover:bg-atlasia-sage transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-xl">✕</span>
                </div>
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-auto">
              {previewDocument.type.startsWith('image/') ? (
                <img
                  src={previewDocument.previewUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="text-center py-12">
                  {getFileIcon(previewDocument)}
                  <p className="text-gray-600 mt-4">Aperçu non disponible pour ce type de fichier</p>
                  <p className="text-sm text-gray-500">
                    {previewDocument.name} - {formatFileSize(previewDocument.size)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



