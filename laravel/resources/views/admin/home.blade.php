@extends('layouts.admin')

@section('admin_title', 'Manage Home Page Content')

@section('content')

<div class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs max-w-2xl space-y-6">
    <div>
        <h3 class="font-display font-bold text-base text-slate-900">Configure Hero Content</h3>
        <span class="text-xs text-slate-500 block font-normal">Update the main presentation text and buttons on the home screen</span>
    </div>

    @if(session('success'))
        <div class="p-3 bg-green-100 border border-green-200 text-green-700 rounded-xl text-xs font-bold shadow-xs">
            {{ session('success') }}
        </div>
    @endif

    <form action="{{ route('admin.home.update') }}" method="POST" class="space-y-4 text-xs font-semibold text-slate-700">
        @csrf
        
        <div>
            <label for="title" class="block mb-1 text-slate-500">Main Hero Title</label>
            <input type="text" name="title" id="title" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" value="{{ old('title', $hero->title) }}" required>
        </div>

        <div>
            <label for="subtitle" class="block mb-1 text-slate-500">Hero Subtitle / Slogan</label>
            <textarea name="subtitle" id="subtitle" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue resize-none font-normal" required>{{ old('subtitle', $hero->subtitle) }}</textarea>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
            <div>
                <label for="cta_text" class="block mb-1 text-slate-500">CTA Button Text</label>
                <input type="text" name="cta_text" id="cta_text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" value="{{ old('cta_text', $hero->cta_text) }}" required>
            </div>
            <div>
                <label for="cta_link" class="block mb-1 text-slate-500">CTA Target Link</label>
                <input type="text" name="cta_link" id="cta_link" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue font-mono" value="{{ old('cta_link', $hero->cta_link) }}" required>
            </div>
        </div>

        <button type="submit" class="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <i data-lucide="save" class="w-4 h-4"></i>
            Save Home Page Content
        </button>
    </form>
</div>

@endsection
