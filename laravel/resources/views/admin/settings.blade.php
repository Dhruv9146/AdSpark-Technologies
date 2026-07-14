@extends('layouts.admin')

@section('admin_title', 'Website Parameters & Password')

@section('content')

@if(session('success'))
    <div class="p-3 bg-green-100 border border-green-200 text-green-700 rounded-xl text-xs font-bold shadow-xs">
        {{ session('success') }}
    </div>
@endif

@if($errors->any())
    <div class="p-3 bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
        <ul class="list-disc pl-4 space-y-0.5">
            @foreach($errors->all() as $err)
                <li>{{ $err }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="grid md:grid-cols-2 gap-8 items-start">
    
    <!-- LEFT: WEBSITE SETTINGS & LOGO -->
    <div class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div>
            <h3 class="font-display font-bold text-base text-slate-900">Configure Web Parameters</h3>
            <span class="text-xs text-slate-500 block font-normal">Define dynamic company names, logo branding, and SEO metatags</span>
        </div>

        <form action="{{ route('admin.settings.update') }}" method="POST" class="space-y-4 text-xs font-semibold text-slate-700">
            @csrf
            
            <div class="grid sm:grid-cols-2 gap-4">
                <div>
                    <label for="company_name" class="block mb-1 text-slate-500">Corporate Legal Name</label>
                    <input type="text" name="company_name" id="company_name" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none" value="{{ old('company_name', $settings['company_name'] ?? '') }}" required>
                </div>
                <div>
                    <label for="logo_text" class="block mb-1 text-slate-500">Logo Header Text</label>
                    <input type="text" name="logo_text" id="logo_text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none" value="{{ old('logo_text', $settings['logo_text'] ?? '') }}" required>
                </div>
            </div>

            <div>
                <label for="meta_title" class="block mb-1 text-slate-500">Document SEO Meta Title</label>
                <input type="text" name="meta_title" id="meta_title" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none" value="{{ old('meta_title', $settings['meta_title'] ?? '') }}" required>
            </div>

            <div>
                <label for="meta_keywords" class="block mb-1 text-slate-500">SEO Meta Keywords (comma-separated)</label>
                <input type="text" name="meta_keywords" id="meta_keywords" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none" value="{{ old('meta_keywords', $settings['meta_keywords'] ?? '') }}" required>
            </div>

            <div>
                <label for="meta_description" class="block mb-1 text-slate-500">SEO Meta Description</label>
                <textarea name="meta_description" id="meta_description" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none resize-none font-normal" required>{{ old('meta_description', $settings['meta_description'] ?? '') }}</textarea>
            </div>

            <button type="submit" class="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <i data-lucide="save" class="w-4 h-4"></i>
                Save Parameters Dynamically
            </button>
        </form>
    </div>

    <!-- RIGHT: CHANGE PASSWORD -->
    <div class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div>
            <h3 class="font-display font-bold text-base text-slate-900">Change Admin Password</h3>
            <span class="text-xs text-slate-500 block font-normal">Securely rotate access credentials to the CMS</span>
        </div>

        <form action="{{ route('admin.password.update') }}" method="POST" class="space-y-4 text-xs font-semibold text-slate-700">
            @csrf
            
            <div>
                <label for="current_password" class="block mb-1 text-slate-500">Current Administrator Password</label>
                <input type="password" name="current_password" id="current_password" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none" required>
            </div>

            <div>
                <label for="new_password" class="block mb-1 text-slate-500">New Password</label>
                <input type="password" name="new_password" id="new_password" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none" placeholder="Min. 8 characters" required>
            </div>

            <div>
                <label for="new_password_confirmation" class="block mb-1 text-slate-500">Confirm New Password</label>
                <input type="password" name="new_password_confirmation" id="new_password_confirmation" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none" required>
            </div>

            <button type="submit" class="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-850 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <i data-lucide="key-round" class="w-4 h-4"></i>
                Rotate Credentials Key
            </button>
        </form>
    </div>

</div>

@endsection
