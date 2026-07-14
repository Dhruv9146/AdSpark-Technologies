@extends('layouts.admin')

@section('admin_title', 'Contact Info & Social Links')

@section('content')

@if(session('success'))
    <div class="p-3 bg-green-100 border border-green-200 text-green-700 rounded-xl text-xs font-bold shadow-xs">
        {{ session('success') }}
    </div>
@endif

<div class="grid md:grid-cols-2 gap-8 items-start">
    
    <!-- LEFT: CONTACT COORDINATES -->
    <div class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div>
            <h3 class="font-display font-bold text-base text-slate-900">Corporate Coordinates</h3>
            <span class="text-xs text-slate-500 block font-normal">Dynamic contact parameters served across header/footer blocks</span>
        </div>

        <form action="{{ route('admin.contact.update') }}" method="POST" class="space-y-4 text-xs font-semibold text-slate-700">
            @csrf
            
            <div>
                <label for="contact_email" class="block mb-1 text-slate-500">Corporate Email</label>
                <input type="email" name="contact_email" id="contact_email" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" value="{{ old('contact_email', $settings['contact_email'] ?? '') }}" required>
            </div>

            <div>
                <label for="contact_phone" class="block mb-1 text-slate-500">Hotline Phone</label>
                <input type="text" name="contact_phone" id="contact_phone" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" value="{{ old('contact_phone', $settings['contact_phone'] ?? '') }}" required>
            </div>

            <div>
                <label for="address" class="block mb-1 text-slate-500">Corporate Office Address</label>
                <input type="text" name="address" id="address" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" value="{{ old('address', $settings['address'] ?? '') }}" required>
            </div>

            <button type="submit" class="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <i data-lucide="save" class="w-4 h-4"></i>
                Save Contact Coordinates
            </button>
        </form>
    </div>

    <!-- RIGHT: SOCIAL LINKS CRUD -->
    <div class="space-y-6">
        <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div>
                <h3 class="font-display font-bold text-base text-slate-900">Manage Social Links</h3>
                <span class="text-xs text-slate-500 block font-normal">Active social platform redirects in footers</span>
            </div>

            <div class="space-y-2">
                @forelse($socials as $soc)
                    <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-xl">
                        <div class="flex items-center gap-2.5 text-xs">
                            <span class="p-2 bg-blue-50 text-brand-blue rounded-lg">
                                <i data-lucide="{{ strtolower($soc->icon) }}" class="w-4 h-4"></i>
                            </span>
                            <div>
                                <span class="font-bold text-slate-900 block">{{ $soc->platform }}</span>
                                <span class="text-slate-400 font-mono text-[10px] block mt-0.5 max-w-[180px] truncate">{{ $soc->url }}</span>
                            </div>
                        </div>

                        <form action="{{ route('admin.social.delete', $soc->id) }}" method="POST" onsubmit="return confirm('Confirm removal of this social connection?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="p-1.5 bg-slate-100 hover:bg-red-600 text-slate-600 hover:text-white rounded-lg transition-all" title="Delete link">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </form>
                    </div>
                @empty
                    <p class="text-slate-400 italic text-xs">No social links configured.</p>
                @endforelse
            </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h4 class="font-display font-bold text-sm text-slate-900">Add Social Platform Connection</h4>
            
            <form action="{{ route('admin.social.create') }}" method="POST" class="space-y-3 text-xs font-semibold text-slate-700">
                @csrf
                
                <div>
                    <label for="platform" class="block mb-1 text-slate-500">Platform Name</label>
                    <input type="text" name="platform" id="platform" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" placeholder="e.g. LinkedIn" required>
                </div>

                <div>
                    <label for="url" class="block mb-1 text-slate-500">Redirect URL</label>
                    <input type="url" name="url" id="url" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue font-mono" placeholder="https://..." required>
                </div>

                <div>
                    <label for="icon" class="block mb-1 text-slate-500">Lucide Icon name</label>
                    <input type="text" name="icon" id="icon" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue font-mono" placeholder="Linkedin, Github, Twitter" required>
                </div>

                <button type="submit" class="w-full py-2.5 bg-brand-blue text-white font-bold rounded-xl shadow hover:bg-opacity-95 transition-all flex items-center justify-center gap-1 cursor-pointer">
                    <i data-lucide="plus" class="w-4 h-4"></i> Add Connection
                </button>
            </form>
        </div>
    </div>

</div>

@endsection
