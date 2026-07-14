import React, { useState, useEffect } from 'react';
import { Blog } from '../types';
import * as Lucide from 'lucide-react';

interface BlogViewProps {
  blogs: Blog[];
  onSelectBlog: (slug: string | null) => void;
  selectedBlogSlug: string | null;
  onRefreshData: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({
  blogs,
  onSelectBlog,
  selectedBlogSlug,
  onRefreshData
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Single blog comment form states
  const [commentAuthor, setCommentAuthor] = useState<string>('');
  const [commentEmail, setCommentEmail] = useState<string>('');
  const [commentContent, setCommentContent] = useState<string>('');
  const [commentStatus, setCommentStatus] = useState<string>('');

  const selectedBlog = blogs.find(b => b.slug === selectedBlogSlug);

  // Trigger page views increment when an article is opened
  useEffect(() => {
    if (selectedBlog) {
      fetch(`/api/blogs/${selectedBlog.id}/view`, { method: 'POST' })
        .then(() => onRefreshData())
        .catch(err => console.error('Error reporting blog view count:', err));
    }
  }, [selectedBlogSlug]);

  const categories: string[] = ['All', ...Array.from(new Set(blogs.map(b => b.category as string))) as string[]];

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlog) return;
    if (!commentAuthor || !commentEmail || !commentContent) {
      setCommentStatus('Please fill in all comment inputs.');
      return;
    }

    setCommentStatus('Submitting comment...');
    try {
      const res = await fetch(`/api/blogs/${selectedBlog.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentAuthor,
          email: commentEmail,
          content: commentContent
        })
      });

      if (res.ok) {
        setCommentAuthor('');
        setCommentEmail('');
        setCommentContent('');
        setCommentStatus('Comment posted successfully!');
        onRefreshData();
        setTimeout(() => setCommentStatus(''), 4000);
      } else {
        const err = await res.json();
        setCommentStatus(`Error: ${err.error || 'Failed to post'}`);
      }
    } catch (err) {
      console.error(err);
      setCommentStatus('Failed to connect to full-stack API server.');
    }
  };

  if (selectedBlog) {
    return (
      <div id="single-blog-viewport" className="py-12 max-w-4xl mx-auto px-4">
        {/* Back navigation */}
        <button
          id="back-to-blogs-btn"
          onClick={() => {
            onSelectBlog(null);
            setCommentStatus('');
          }}
          className="flex items-center gap-2 text-brand-blue font-medium mb-8 hover:underline cursor-pointer group"
        >
          <Lucide.ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </button>

        {/* Blog Post Content */}
        <article className="space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-white bg-brand-blue uppercase px-2.5 py-1 rounded-md">
              {selectedBlog.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
              {selectedBlog.title}
            </h1>
            
            {/* Author details */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="font-semibold text-slate-800">{selectedBlog.author}</span>
              <span>•</span>
              <span>{selectedBlog.authorRole}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lucide.Calendar size={14} />
                {selectedBlog.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lucide.Eye size={14} />
                {selectedBlog.views || 0} Views
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lucide.Clock size={14} />
                {selectedBlog.readTime}
              </span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-video relative shadow">
            <img
              src={selectedBlog.featuredImage}
              alt={selectedBlog.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* HTML Render */}
          <div
            className="prose max-w-none text-slate-700 leading-relaxed space-y-4 pt-4"
            dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-100">
            {selectedBlog.tags.map(tag => (
              <span
                key={tag}
                className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-12 pt-12 border-t border-slate-100 space-y-8">
          <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Lucide.MessageCircle size={22} className="text-brand-blue" />
            Comments ({selectedBlog.comments ? selectedBlog.comments.length : 0})
          </h3>

          {/* Comments List */}
          <div className="space-y-4">
            {selectedBlog.comments && selectedBlog.comments.length > 0 ? (
              selectedBlog.comments.map(c => (
                <div key={c.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-sm">{c.author}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {c.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">No comments yet. Be the first to join the conversation!</p>
            )}
          </div>

          {/* Leave a Comment form */}
          <form id="blog-comment-form" onSubmit={handleCommentSubmit} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="text-base font-display font-bold text-slate-900">Leave a Reply</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Your Name *</label>
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue text-slate-700"
                  placeholder="e.g. Robert Chen"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue text-slate-700"
                  placeholder="e.g. robert@apex.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Your Comment *</label>
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue text-slate-700 resize-none"
                placeholder="Write your constructive thoughts..."
                required
              ></textarea>
            </div>

            {commentStatus && (
              <div className={`p-3 rounded-lg text-xs font-medium ${
                commentStatus.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-150' : 'bg-blue-50 text-brand-blue'
              }`}>
                {commentStatus}
              </div>
            )}

            <button
              id="submit-comment-btn"
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-opacity-95 shadow transition-all cursor-pointer"
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="blog-directory-viewport" className="py-12 max-w-7xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold text-brand-blue tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">
          Tech Insights
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight mt-3">
          Our Technology & Engineering Blog
        </h1>
        <p className="text-slate-600 mt-4 leading-relaxed">
          Stay informed with architectural tutorials, ERP automation advice, code standards, and generative AI discussions authored by our tech leaders.
        </p>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <div className="relative w-full md:w-80">
          <Lucide.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue text-slate-700"
            placeholder="Search keywords, titles, tags..."
          />
        </div>

        <div className="flex flex-wrap gap-2.5 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              id={`blog-cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs list */}
      {filteredBlogs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map(b => (
            <div
              key={b.id}
              id={`blog-card-${b.id}`}
              onClick={() => onSelectBlog(b.slug)}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={b.featuredImage}
                    alt={b.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-brand-blue text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                    {b.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span>{b.author}</span>
                    <span>•</span>
                    <span>{b.publishedAt}</span>
                  </div>
                  <h3 className="text-base font-display font-bold text-slate-900 line-clamp-2 hover:text-brand-blue transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                    {b.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Lucide.Clock size={14} />
                  {b.readTime}
                </span>
                <button
                  id={`read-article-${b.id}-btn`}
                  className="font-bold text-brand-blue flex items-center gap-0.5 group cursor-pointer"
                >
                  Read Article
                  <Lucide.ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Lucide.FileQuestion size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No articles match your criteria.</p>
        </div>
      )}
    </div>
  );
};
