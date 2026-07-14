@extends('layouts.app')

@section('content')

<!-- HEADER HERO BANNER -->
<section class="bg-brand-dark text-white py-16 border-b border-slate-800 text-center">
    <div class="max-w-4xl mx-auto px-4 space-y-4">
        <span class="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-950 border border-blue-900 px-3 py-1 rounded-full inline-block">
            About Our Company
        </span>
        <h1 class="text-3xl md:text-4xl font-display font-bold tracking-tight">
            Systems Architects & Software Craftsmen
        </h1>
        <p class="text-slate-400 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto font-normal">
            We operate on a zero-shortcut philosophy, providing leading corporations with the reliable technology backbones required to handle global transactions seamlessly.
        </p>
    </div>
</section>

<!-- MAIN CONTENT TEXTS -->
<section class="py-16 bg-white">
    <div class="max-w-4xl mx-auto px-4 space-y-12">
        <div class="space-y-4 text-sm md:text-base text-slate-600 leading-relaxed font-normal">
            <h2 class="text-2xl font-display font-bold text-slate-900 tracking-tight">Our Core Philosophies</h2>
            <p>
                We believe that software engineering is a strict, mathematical discipline. Many agencies build fragile layouts on quick-fix templates that fall apart under pressure. At {{ $settings['company_name'] ?? 'AdSpark Technologies' }}, we design customized data structures, thoroughly test edge-case inputs, and ensure your system architecture remains robust for years.
            </p>
            <p>
                Our team is highly experienced in microservices configuration, high-concurrency databases optimization, custom payment gateway synchronization, and cognitive AI assistants pipelines integration. We manage complete systems setups on Laravel, Node, and AWS, and deliver pristine source code with exhaustive technical specifications.
            </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-6 pt-6">
            <div class="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-3">
                <div class="p-2.5 bg-blue-50 text-brand-blue rounded-lg w-fit">
                    <i data-lucide="shield" class="w-5 h-5"></i>
                </div>
                <h4 class="font-display font-bold text-slate-900 text-sm">Security-First Methodology</h4>
                <p class="text-slate-500 text-xs leading-relaxed font-normal">
                    We secure all ports, enforce strict OAuth logins, sanitize inputs to prevent injections, and write clean security rules to safeguard enterprise assets.
                </p>
            </div>

            <div class="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-3">
                <div class="p-2.5 bg-blue-50 text-brand-blue rounded-lg w-fit">
                    <i data-lucide="git-branch" class="w-5 h-5"></i>
                </div>
                <h4 class="font-display font-bold text-slate-900 text-sm">Git & Code Transparency</h4>
                <p class="text-slate-500 text-xs leading-relaxed font-normal">
                    We maintain absolute clarity over code branches, commit messages, and deployment pipelines. Our client partners always retain complete ownership.
                </p>
            </div>
        </div>
    </div>
</section>

@endsection
