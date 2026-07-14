@extends('layouts.app')

@section('content')

<!-- HERO CONTENT SLIDER -->
<section class="bg-gradient-to-r from-brand-dark via-slate-900 to-slate-950 text-white py-24 border-b border-slate-800">
    <div class="max-w-6xl mx-auto px-4 text-center space-y-8">
        <span class="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-950 border border-blue-900 px-3 py-1.5 rounded-full inline-block">
            Systems Engineering Hub
        </span>
        <h1 class="text-3xl md:text-5xl font-display font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {{ $hero->title }}
        </h1>
        <p class="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            {{ $hero->subtitle }}
        </p>
        <div class="flex flex-wrap justify-center gap-4 pt-4">
            <a href="{{ $hero->cta_link }}" class="px-6 py-3 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-opacity-95 shadow-lg transition-all flex items-center gap-2">
                <i data-lucide="phone-call" class="w-4 h-4"></i>
                {{ $hero->cta_text }}
            </a>
            <a href="#services" class="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold hover:text-white hover:border-slate-500 transition-all">
                Explore Services
            </a>
        </div>
    </div>
</section>

<!-- ABOUT SUMMARY SECTION -->
<section class="py-16 bg-white border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-12 gap-8 items-center">
        <div class="md:col-span-7 space-y-6">
            <span class="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Corporate Standards
            </span>
            <h2 class="text-3xl font-display font-bold text-slate-900 tracking-tight mt-1">
                Committed to Architectural Integrity
            </h2>
            <p class="text-slate-600 text-sm leading-relaxed font-normal">
                At {{ $settings['company_name'] ?? 'AdSpark Technologies' }}, our mission is to build software products that stand the test of high traffic, rigorous cybersecurity filters, and fast transactional loops. We reject "ready-made solutions" and write custom, modular algorithms for your business.
            </p>
            <div class="grid sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div class="flex items-center gap-2 text-slate-700">
                    <i data-lucide="shield-check" class="text-brand-blue"></i>
                    <span>Secure Proprietary Datastores</span>
                </div>
                <div class="flex items-center gap-2 text-slate-700">
                    <i data-lucide="clock" class="text-brand-blue"></i>
                    <span>Agile Design Sprints</span>
                </div>
                <div class="flex items-center gap-2 text-slate-700">
                    <i data-lucide="cpu" class="text-brand-blue"></i>
                    <span>Custom High-Throughput APIs</span>
                </div>
                <div class="flex items-center gap-2 text-slate-700">
                    <i data-lucide="git-pull-request" class="text-brand-blue"></i>
                    <span>Strict Version Controls</span>
                </div>
            </div>
        </div>

        <div class="md:col-span-5 bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
            <h4 class="font-display font-bold text-slate-900 text-sm">Our Core Core Commitments</h4>
            <div class="space-y-3 text-xs">
                <div class="bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
                    <h5 class="font-bold text-slate-900 mb-1">Architectural Consistency</h5>
                    <p class="text-slate-500 leading-relaxed font-normal">Clean code structures ensure codebases survive dynamic migrations and scaling spikes.</p>
                </div>
                <div class="bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
                    <h5 class="font-bold text-slate-900 mb-1">Confidentiality Guarantee</h5>
                    <p class="text-slate-500 leading-relaxed font-normal">All integrations and intellectual codes remain 100% proprietary to our client partners.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ICON-BASED SERVICES GRID -->
<section id="services" class="py-16 bg-slate-50 border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-4 space-y-12">
        <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full">
                What We Build
            </span>
            <h2 class="text-3xl font-display font-bold text-slate-900 tracking-tight">
                Our Tech Engineering Services
            </h2>
            <p class="text-slate-500 text-xs md:text-sm font-normal">
                Explore our dynamic scope of custom development procedures, system migrations, and automation layers.
            </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            @foreach($services as $svc)
                <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
                    <div class="space-y-4">
                        <div class="p-3 bg-blue-50 text-brand-blue rounded-xl w-fit group-hover:bg-brand-blue group-hover:text-white transition-all">
                            <!-- Dynamically loaded lucide icon -->
                            <i data-lucide="{{ strtolower($svc->icon ?? 'cpu') }}" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <span class="text-[9px] font-bold text-brand-blue uppercase tracking-wider block mb-1">
                                {{ $svc->category }}
                            </span>
                            <h3 class="font-display font-bold text-slate-900 text-sm leading-snug">
                                {{ $svc->title }}
                            </h3>
                            <p class="text-slate-500 text-xs leading-relaxed font-normal mt-2 line-clamp-3">
                                {{ $svc->short_desc }}
                            </p>
                        </div>
                    </div>
                    
                    <div class="pt-6 mt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold">
                        <span class="text-slate-400">Professional Scoping</span>
                        <a href="{{ route('service.details', $svc->id) }}" class="text-brand-blue hover:underline flex items-center gap-1">
                            Learn More
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</section>

<!-- CORPORATE STANDARDS GRID -->
<section class="py-16 bg-white">
    <div class="max-w-5xl mx-auto px-4 text-center space-y-10">
        <h3 class="text-xl font-display font-bold text-slate-900">Why Global Enterprises Partner With AdSpark</h3>
        <div class="grid sm:grid-cols-3 gap-6 text-left">
            <div class="p-5 border border-slate-100 bg-slate-50 rounded-2xl space-y-2">
                <span class="text-xs font-bold text-brand-blue">Standard 01</span>
                <h4 class="font-bold text-slate-900 text-sm">System Security First</h4>
                <p class="text-slate-500 text-xs font-normal leading-relaxed">From secure cookies configuration to database parameterized queries, your data is locked.</p>
            </div>
            <div class="p-5 border border-slate-100 bg-slate-50 rounded-2xl space-y-2">
                <span class="text-xs font-bold text-brand-blue">Standard 02</span>
                <h4 class="font-bold text-slate-900 text-sm">Constant Collaboration</h4>
                <p class="text-slate-500 text-xs font-normal leading-relaxed">No black boxes. Regular reports, active deployment reviews, and detailed technical specs.</p>
            </div>
            <div class="p-5 border border-slate-100 bg-slate-50 rounded-2xl space-y-2">
                <span class="text-xs font-bold text-brand-blue">Standard 03</span>
                <h4 class="font-bold text-slate-900 text-sm">Robust Dynamic Scaling</h4>
                <p class="text-slate-500 text-xs font-normal leading-relaxed">Architectures are optimized on Laravel and container instances to support heavy loads.</p>
            </div>
        </div>
    </div>
</section>

@endsection
