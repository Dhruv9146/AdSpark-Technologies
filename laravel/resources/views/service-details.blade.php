@extends('layouts.app')

@section('content')

<div class="py-12 max-w-5xl mx-auto px-4">
    <!-- Breadcrumb back button -->
    <a href="{{ route('home') }}#services" class="flex items-center gap-2 text-brand-blue font-semibold text-xs mb-8 hover:underline group">
        <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"></i>
        Back to All Services
    </a>

    <div class="grid md:grid-cols-12 gap-8 items-start">
        <!-- Main Visuals & Detailed Description -->
        <div class="md:col-span-8 space-y-6">
            <div class="bg-gradient-to-r from-brand-dark to-slate-900 p-8 rounded-2xl flex flex-col sm:flex-row items-center gap-6 text-white border border-slate-800 shadow">
                <div class="p-4 rounded-xl bg-brand-blue text-white shadow">
                    <i data-lucide="{{ strtolower($service->icon ?? 'cpu') }}" class="w-12 h-12"></i>
                </div>
                <div class="text-center sm:text-left space-y-1.5">
                    <span class="text-xs font-semibold bg-white/15 border border-white/10 text-slate-300 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {{ $service->category }}
                    </span>
                    <h1 class="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                        {{ $service->title }}
                    </h1>
                </div>
            </div>

            <div class="prose max-w-none text-slate-700 space-y-6 bg-white border border-slate-100 p-6 md:p-8 rounded-3xl">
                <h2 class="text-lg font-display font-bold text-slate-900 border-b pb-2">
                    Service Overview
                </h2>
                <p class="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                    {{ $service->description }}
                </p>
                
                <h3 class="text-base font-display font-bold text-slate-900 pt-4">
                    Key Deliverables & Outcomes
                </h3>
                <ul class="grid sm:grid-cols-2 gap-3 text-xs text-slate-600 font-semibold">
                    <li class="flex items-start gap-2">
                        <i data-lucide="check-circle-2" class="text-brand-blue w-4 h-4 shrink-0 mt-0.5"></i>
                        <span>Enterprise-grade security integrations</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i data-lucide="check-circle-2" class="text-brand-blue w-4 h-4 shrink-0 mt-0.5"></i>
                        <span>Highly accessible layout configurations</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i data-lucide="check-circle-2" class="text-brand-blue w-4 h-4 shrink-0 mt-0.5"></i>
                        <span>Custom database structure optimizations</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i data-lucide="check-circle-2" class="text-brand-blue w-4 h-4 shrink-0 mt-0.5"></i>
                        <span>Complete technical logic transfer documentation</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i data-lucide="check-circle-2" class="text-brand-blue w-4 h-4 shrink-0 mt-0.5"></i>
                        <span>Active status reports & transparency</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i data-lucide="check-circle-2" class="text-brand-blue w-4 h-4 shrink-0 mt-0.5"></i>
                        <span>Post-launch warranty checkup routines</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Consultation Request Sidebar -->
        <div class="md:col-span-4 space-y-6">
            <div class="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-6">
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Service Request</span>
                    <h4 class="text-base font-display font-bold text-slate-900 mt-1">Bespoke Consultation</h4>
                    <p class="text-slate-500 text-xs mt-2 leading-relaxed">
                        Tailored scopes and estimates are engineered dynamically based on your exact workload metrics and business specifications.
                    </p>
                </div>

                <div class="space-y-3">
                    <a href="{{ route('contact') }}?service={{ urlencode($service->title) }}" class="w-full py-3 px-4 rounded-xl bg-brand-blue text-white text-xs font-bold text-center hover:bg-opacity-95 shadow transition-all flex items-center justify-center gap-2">
                        <i data-lucide="phone-call" class="w-4 h-4"></i>
                        Book A Consultation
                    </a>
                    <a href="{{ route('home') }}#services" class="w-full py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold text-center hover:bg-slate-100 transition-all block">
                        Explore Other Services
                    </a>
                </div>

                <div class="border-t pt-4 space-y-3 text-xs font-semibold text-slate-600">
                    <h5 class="text-slate-900 font-bold">Why partner with AdSpark?</h5>
                    <div class="flex gap-3">
                        <i data-lucide="shield" class="text-brand-blue shrink-0"></i>
                        <span>100% intellectual property confidentiality guaranteed.</span>
                    </div>
                    <div class="flex gap-3">
                        <i data-lucide="cpu" class="text-brand-blue shrink-0"></i>
                        <span>Standardized design frameworks and test-proven layouts.</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection
