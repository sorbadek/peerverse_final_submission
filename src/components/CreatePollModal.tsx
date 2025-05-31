
import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { useSocial } from './SocialContext';

const CreatePollModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { addPoll } = useSocial();

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.filter(opt => opt.trim()).map((text, index) => ({
      id: (index + 1).toString(),
      text: text.trim(),
      votes: 0
    }));

    if (question.trim() && validOptions.length >= 2) {
      addPoll({
        author: 'Current User',
        question: question.trim(),
        options: validOptions
      });
      
      setQuestion('');
      setOptions(['', '']);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <Plus size={16} />
        <span>Create Poll</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Create Poll</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What would you like to ask?"
                  className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Options *
                </label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
                        required
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                  >
                    <Plus size={14} />
                    <span>Add option</span>
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!question.trim() || options.filter(opt => opt.trim()).length < 2}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePollModal;
