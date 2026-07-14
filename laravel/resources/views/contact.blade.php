@extends('layouts.app')

@section('content')

<!-- HEADER HERO BANNER -->
<section class="bg-brand-dark text-white py-12 border-b border-slate-800 text-center">
    <div class="max-w-4xl mx-auto px-4 space-y-3">
        <span class="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-950 border border-blue-900 px-3 py-1 rounded-full inline-block">
            Connect With Our Engineers
        </span>
        <h1 class="text-3xl md:text-4xl font-display font-bold tracking-tight">
            Book A Technical Scoping Consultation
        </h1>
        <p class="text-slate-400 text-xs md:text-sm max-w-xl mx-auto font-normal">
            Have a custom software workload or API system migration to discuss? Submit your requirements and our squad will analyze the metrics.
        </p>
    </div>
</section>

<!-- CONTACT CONTAINER -->
<section class="py-16 bg-white">
    <div class="max-w-6xl mx-auto px-4 grid md:grid-cols-12 gap-8 items-start">
        
        <!-- Physical Coordinates Column -->
        <div class="md:col-span-5 space-y-6">
            <h3 class="text-xl font-display font-bold text-slate-900">Our Corporate Offices</h3>
            <p class="text-slate-600 text-xs md:text-sm leading-relaxed font-normal">
                Submit an inquiry via our form, and our system administrators will queue and dispatch it to our appropriate regional team.
            </p>

            <div class="space-y-4 font-semibold text-xs text-slate-700">
                <div class="flex gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-xs">
                    <i data-lucide="mail" class="text-brand-blue shrink-0 w-5 h-5"></i>
                    <div>
                        <span class="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Email Inbox</span>
                        <span class="text-slate-900 block mt-1">{{ $settings['contact_email'] ?? 'adsparktechnologies01@gmail.com' }}</span>
                    </div>
                </div>

                <div class="flex gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-xs">
                    <i data-lucide="phone" class="text-brand-blue shrink-0 w-5 h-5"></i>
                    <div>
                        <span class="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Hotline Support</span>
                        <span class="text-slate-900 block mt-1">{{ $settings['contact_phone'] ?? '+1 (555) 019-2831' }}</span>
                    </div>
                </div>

                <div class="flex gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-xs">
                    <i data-lucide="map-pin" class="text-brand-blue shrink-0 w-5 h-5"></i>
                    <div>
                        <span class="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">HQ Office</span>
                        <span class="text-slate-900 block mt-1">{{ $settings['address'] ?? '100 Silicon Way, Suite 400, San Francisco, CA' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- FORM SUBMIT COLUMN -->
        <div class="md:col-span-7 bg-slate-50 border border-slate-150 p-6 md:p-8 rounded-3xl">
            @if(session('success'))
                <div class="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xs">
                    <i data-lucide="check-circle" class="w-5 h-5 shrink-0"></i>
                    <span>{{ session('success') }}</span>
                </div>
            @endif

            @if($errors->any())
                <div class="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold space-y-1">
                    <div class="flex items-center gap-1.5 font-bold mb-1">
                        <i data-lucide="alert-triangle" class="w-4 h-4"></i>
                        <span>Validation Errors:</span>
                    </div>
                    <ul class="list-disc pl-4 space-y-0.5">
                        @foreach($errors->all() as $err)
                            <li>{{ $err }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('contact.submit') }}" method="POST" class="space-y-4 text-xs font-semibold text-slate-700">
                @csrf
                
                <div class="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label for="name" class="block mb-1 text-slate-500">Your Full Name <span class="text-red-500">*</span></label>
                        <input type="text" name="name" id="name" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" value="{{ old('name') }}" required>
                    </div>
                    <div>
                        <label for="email" class="block mb-1 text-slate-500">Corporate Email Address <span class="text-red-500">*</span></label>
                        <input type="email" name="email" id="email" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" value="{{ old('email') }}" required>
                    </div>
                </div>

                <div>
                    <label for="subject" class="block mb-1 text-slate-500">Subject of Consultation</label>
                    <input type="text" name="subject" id="subject" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" value="{{ old('subject', request('service')) }}">
                </div>

                <div>
                    <label for="message" class="block mb-1 text-slate-500">Workload Specifications / Message <span class="text-red-500">*</span></label>
                    <textarea name="message" id="message" rows="5" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue resize-none" placeholder="Provide system metrics, database scaling needs, or general support query detail..." required>{{ old('message') }}</textarea>
                </div>

                <button type="submit" class="w-full py-3 bg-brand-blue text-white text-xs font-bold rounded-xl shadow-md hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <i data-lucide="send" class="w-4 h-4"></i>
                    Submit Scoping Request
                </button>
            </form>
        </div>

    </div>
</section>

@endsection
