import React, { useState, useRef, useCallback } from 'react';
import { storyService, type StoryContentWithStatus } from '../services/storyService';
import { Save, Eye, EyeOff, X, Plus, Edit3, Trash2, Loader2 } from 'lucide-react';

interface StoryEditorProps {
  onContentChange?: () => void;
  className?: string;
}

const StoryEditor: React.FC<StoryEditorProps> = ({ onContentChange, className = '' }) => {
  const [stories, setStories] = useState<StoryContentWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Form state
  const [editForm, setEditForm] = useState({
    title: '',
    content: ''
  });

  // Load stories on component mount
  React.useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setIsLoading(true);
      const storyData = await storyService.getAllStoryContent();
      setStories(storyData);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditForm({ title: '', content: '' });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleEdit = (story: StoryContentWithStatus) => {
    setEditForm({
      title: story.title,
      content: story.content
    });
    setEditingId(story.id);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setEditForm({ title: '', content: '' });
  };

  const handleSave = async () => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      setSavingId(editingId || 'new');

      if (isCreating) {
        // Create new story
        const newStory = await storyService.createStoryContent({
          title: editForm.title.trim(),
          content: editForm.content.trim(),
          order_index: stories.length,
          created_by: 'admin' // In production, get from auth
        });
        setStories(prev => [...prev, newStory]);
      } else if (editingId) {
        // Update existing story
        const updatedStory = await storyService.updateStoryContent(editingId, {
          title: editForm.title.trim(),
          content: editForm.content.trim()
        });
        setStories(prev => prev.map(s => s.id === editingId ? updatedStory : s));
      }

      handleCancel();
      onContentChange?.();
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Failed to save story. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  const handleTogglePublish = async (storyId: string, currentlyPublished: boolean) => {
    try {
      const updatedStory = currentlyPublished
        ? await storyService.unpublishStoryContent(storyId)
        : await storyService.publishStoryContent(storyId);

      setStories(prev => prev.map(s => s.id === storyId ? updatedStory : s));
      onContentChange?.();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status. Please try again.');
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    try {
      await storyService.deleteStoryContent(storyId);
      setStories(prev => prev.filter(s => s.id !== storyId));
      onContentChange?.();
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story. Please try again.');
    }
  };

  const formatContent = (content: string) => {
    // Simple text formatting - convert line breaks to paragraphs
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            {lineIndex < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-wedding-gold mx-auto mb-4" />
          <p className="text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif text-lg text-gray-900">Story Content</h3>
          <p className="text-sm text-gray-600">Manage your love story sections</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-wedding-gold text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#b08d4a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Story
        </button>
      </div>

      {/* Story List */}
      <div className="space-y-4">
        {stories.map((story) => (
          <div key={story.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Story Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{story.title}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    story.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {story.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    Updated {new Date(story.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePublish(story.id, story.status === 'published')}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    story.status === 'published'
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                  title={story.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {story.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(story)}
                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(story.id)}
                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Story Preview */}
            <div className="p-4 bg-gray-50">
              <div className="text-sm text-gray-700 max-h-32 overflow-hidden">
                {formatContent(story.content)}
              </div>
            </div>
          </div>
        ))}

        {stories.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No stories created yet. Click "Add Story" to get started!</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {(editingId || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-serif text-lg text-gray-900">
                {isCreating ? 'Create New Story' : 'Edit Story'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-wedding-gold"
                  placeholder="e.g., How We Met"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Content *
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-wedding-gold resize-vertical"
                  placeholder="Share your love story here... Use double line breaks for paragraphs."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Use double line breaks to create paragraphs. This will be formatted nicely on your website.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={savingId !== null}
                className="px-4 py-2 bg-wedding-gold text-white rounded-lg hover:bg-[#b08d4a] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {savingId !== null ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isCreating ? 'Create Story' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryEditor;