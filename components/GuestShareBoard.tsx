import React, { useState } from 'react';
import { GuestPost } from '../types';
import { MOCK_GUEST_POSTS } from '../constants';
import { MessageSquare, Plus, UserCircle2 } from 'lucide-react';

const GuestShareBoard: React.FC = () => {
  const [posts, setPosts] = useState<GuestPost[]>(MOCK_GUEST_POSTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newPost, setNewPost] = useState({ name: '', message: '', contact: '', type: 'Looking for Group' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const post: GuestPost = {
      id: `new-${Date.now()}`,
      name: newPost.name,
      message: newPost.message,
      contact: newPost.contact,
      type: newPost.type as any,
      date: 'Just now'
    };
    setPosts([post, ...posts]);
    setIsFormOpen(false);
    setNewPost({ name: '', message: '', contact: '', type: 'Looking for Group' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-wedding-ocean/5 p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="font-serif text-xl text-wedding-text font-bold flex items-center gap-2">
            <UserCircle2 className="w-5 h-5 text-wedding-gold" />
            Guest Share Board
          </h3>
          <p className="text-xs text-gray-500 mt-1">Real-time: Find roommates or share a villa</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-wedding-text text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Post Request
        </button>
      </div>

      {isFormOpen && (
        <div className="p-6 bg-gray-50 border-b border-gray-100 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-3">
             <div className="grid grid-cols-2 gap-4">
               <input 
                 required 
                 placeholder="Your Name" 
                 className="p-2 border rounded text-sm"
                 value={newPost.name}
                 onChange={e => setNewPost({...newPost, name: e.target.value})}
               />
               <select 
                 className="p-2 border rounded text-sm"
                 value={newPost.type}
                 onChange={e => setNewPost({...newPost, type: e.target.value})}
               >
                 <option>Looking for Group</option>
                 <option>Have a Villa</option>
               </select>
             </div>
             <textarea 
               required 
               placeholder="Message (e.g., 'Looking for 2 people to split a 3-bedroom villa...')" 
               className="w-full p-2 border rounded text-sm h-20"
               value={newPost.message}
               onChange={e => setNewPost({...newPost, message: e.target.value})}
             />
             <div className="flex gap-2">
                <input 
                  required 
                  placeholder="Contact Email/Phone" 
                  className="flex-1 p-2 border rounded text-sm"
                  value={newPost.contact}
                  onChange={e => setNewPost({...newPost, contact: e.target.value})}
                />
                <button type="submit" className="bg-green-600 text-white px-6 rounded text-xs font-bold">Post</button>
             </div>
          </form>
        </div>
      )}

      <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
        {posts.map(post => (
          <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
             <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                   <span className="font-bold text-sm text-gray-900">{post.name}</span>
                   <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${post.type === 'Have a Villa' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                     {post.type}
                   </span>
                </div>
                <span className="text-[10px] text-gray-400">{post.date}</span>
             </div>
             <p className="text-sm text-gray-600 mb-2">{post.message}</p>
             <div className="flex items-center gap-1 text-xs text-wedding-gold font-medium">
                <MessageSquare className="w-3 h-3" />
                <span>Contact: {post.contact}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestShareBoard;