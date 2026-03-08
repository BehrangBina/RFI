import { useState, useEffect } from 'react';
import { NewsArticle } from '../../types/News';

interface KeyPointForm {
  title: string;
  description: string;
  orderIndex: number;
}

interface SectionForm {
  sectionType: string;
  title: string;
  orderIndex: number;
  keyPoints: KeyPointForm[];
}

interface NewsFormData {
  title: string;
  summary: string;
  category: string;
  date: string;
  readTimeMinutes: number;
  videoUrl: string;
  imageUrl: string;
  sections: SectionForm[];
}

interface NewsAdminFormProps {
  news?: NewsArticle | null;
  onSubmit: (data: NewsFormData) => Promise<void>;
  onCancel: () => void;
}

const SECTION_TYPES = [
  { value: 'summary', label: 'Summary' },
  { value: 'key_points', label: 'Key Points' },
  { value: 'support_request', label: 'Support Request' },
  { value: 'background', label: 'Background' },
  { value: 'description', label: 'Description' },
  { value: 'outcomes', label: 'Outcomes' },
  { value: 'speech', label: 'Speech' },
  { value: 'call_to_action', label: 'Call to Action' },
  { value: 'how_to_help', label: 'How to Help' },
  { value: 'vision', label: 'Vision' },
  { value: 'statement', label: 'Statement' },
];

const CATEGORIES = [
  'Politics',
  'Human Rights',
  'International',
  'Community',
  'Press Release',
  'Statement',
  'Analysis',
];

export const NewsAdminForm: React.FC<NewsAdminFormProps> = ({ news, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    summary: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    readTimeMinutes: 5,
    videoUrl: '',
    imageUrl: '',
    sections: [],
  });

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        summary: news.summary,
        category: news.category || '',
        date: news.date.split('T')[0],
        readTimeMinutes: news.readTimeMinutes || 5,
        videoUrl: news.videoUrl || '',
        imageUrl: news.imageUrl || '',
        sections: news.sections.map(s => ({
          sectionType: s.sectionType,
          title: s.title || '',
          orderIndex: s.orderIndex,
          keyPoints: s.keyPoints.map(kp => ({
            title: kp.title || '',
            description: kp.description,
            orderIndex: kp.orderIndex,
          })),
        })),
      });
    }
  }, [news]);

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          sectionType: 'key_points',
          title: '',
          orderIndex: formData.sections.length + 1,
          keyPoints: [],
        },
      ],
    });
  };

  const removeSection = (index: number) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    // Reorder
    newSections.forEach((section, i) => {
      section.orderIndex = i + 1;
    });
    setFormData({ ...formData, sections: newSections });
  };

  const updateSection = (index: number, field: keyof SectionForm, value: any) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  const addKeyPoint = (sectionIndex: number) => {
    const newSections = [...formData.sections];
    const section = newSections[sectionIndex];
    section.keyPoints.push({
      title: '',
      description: '',
      orderIndex: section.keyPoints.length + 1,
    });
    setFormData({ ...formData, sections: newSections });
  };

  const removeKeyPoint = (sectionIndex: number, keyPointIndex: number) => {
    const newSections = [...formData.sections];
    const section = newSections[sectionIndex];
    section.keyPoints = section.keyPoints.filter((_, i) => i !== keyPointIndex);
    // Reorder
    section.keyPoints.forEach((kp, i) => {
      kp.orderIndex = i + 1;
    });
    setFormData({ ...formData, sections: newSections });
  };

  const updateKeyPoint = (
    sectionIndex: number,
    keyPointIndex: number,
    field: keyof KeyPointForm,
    value: any
  ) => {
    const newSections = [...formData.sections];
    const keyPoint = newSections[sectionIndex].keyPoints[keyPointIndex];
    newSections[sectionIndex].keyPoints[keyPointIndex] = { ...keyPoint, [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...formData.sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    // Update order indices
    newSections.forEach((section, i) => {
      section.orderIndex = i + 1;
    });
    setFormData({ ...formData, sections: newSections });
  };

  const moveSectionDown = (index: number) => {
    if (index === formData.sections.length - 1) return;
    const newSections = [...formData.sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    // Update order indices
    newSections.forEach((section, i) => {
      section.orderIndex = i + 1;
    });
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only allow submission from step 3
    if (currentStep < 3) {
      return;
    }
    
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a title');
      setCurrentStep(1);
      return;
    }
    if (!formData.summary.trim()) {
      alert('Please enter a summary');
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting news:', error);
      alert('Failed to submit news article');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFinalSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    // Trigger form submission from the submit button
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  const totalSteps = 3;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {news ? 'Edit News Article' : 'Create News Article'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          disabled={loading}
        >
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              <div
                className={`flex-1 text-sm ml-2 mr-4 ${
                  currentStep >= step ? 'text-blue-600 font-semibold' : 'text-gray-400'
                }`}
              >
                {step === 1 && 'Basic Info'}
                {step === 2 && 'Media'}
                {step === 3 && 'Sections'}
              </div>
              {step < totalSteps && (
                <div
                  className={`h-1 flex-1 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter news title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter article summary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Read Time (minutes)
              </label>
              <input
                type="number"
                value={formData.readTimeMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, readTimeMinutes: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>
        )}

        {/* Step 2: Media */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (YouTube embed)
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.youtube.com/embed/..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Use the embed URL format (e.g., youtube.com/embed/VIDEO_ID)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Preview */}
            {(formData.videoUrl || formData.imageUrl) && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Preview:</h4>
                {formData.videoUrl && (
                  <div className="relative pb-[56.25%] h-0 overflow-hidden rounded">
                    <iframe
                      src={formData.videoUrl}
                      className="absolute top-0 left-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {!formData.videoUrl && formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).alt = 'Failed to load image';
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Sections */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Article Sections</h3>
              <button
                type="button"
                onClick={addSection}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <i className="fas fa-plus mr-2"></i>Add Section
              </button>
            </div>

            {formData.sections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-layer-group text-4xl mb-2 opacity-50"></i>
                <p>No sections added yet. Click "Add Section" to begin.</p>
              </div>
            )}

            {formData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-gray-700">
                    Section {sectionIndex + 1}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveSectionUp(sectionIndex)}
                      disabled={sectionIndex === 0}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Move up"
                    >
                      <i className="fas fa-arrow-up"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSectionDown(sectionIndex)}
                      disabled={sectionIndex === formData.sections.length - 1}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Move down"
                    >
                      <i className="fas fa-arrow-down"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove section"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Type
                    </label>
                    <select
                      value={section.sectionType}
                      onChange={(e) =>
                        updateSection(sectionIndex, 'sectionType', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {SECTION_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter section title"
                    />
                  </div>

                  {/* Key Points */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Key Points
                      </label>
                      <button
                        type="button"
                        onClick={() => addKeyPoint(sectionIndex)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        <i className="fas fa-plus mr-1"></i>Add Point
                      </button>
                    </div>

                    {section.keyPoints.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No key points yet</p>
                    )}

                    {section.keyPoints.map((keyPoint, keyPointIndex) => (
                      <div
                        key={keyPointIndex}
                        className="bg-white border border-gray-200 rounded p-3 mb-2"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Point {keyPointIndex + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeKeyPoint(sectionIndex, keyPointIndex)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        <input
                          type="text"
                          value={keyPoint.title}
                          onChange={(e) =>
                            updateKeyPoint(sectionIndex, keyPointIndex, 'title', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                          placeholder="Point title"
                        />
                        <textarea
                          value={keyPoint.description}
                          onChange={(e) =>
                            updateKeyPoint(
                              sectionIndex,
                              keyPointIndex,
                              'description',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          rows={2}
                          placeholder="Point description"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-arrow-left mr-2"></i>Previous
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next<i className="fas fa-arrow-right ml-2"></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    {news ? 'Update Article' : 'Publish Article'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
