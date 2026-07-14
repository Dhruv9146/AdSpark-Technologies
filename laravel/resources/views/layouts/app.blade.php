<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $settings['meta_title'] ?? 'AdSpark Technologies' }}</title>
    <meta name="description" content="{{ $settings['meta_description'] ?? '' }}">
    <meta name="keywords" content="{{ $settings['meta_keywords'] ?? '' }}">
    
    <!-- Typography & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            blue: '#2563eb',
                            dark: '#0f172a'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <!-- Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col justify-between">

    <!-- Header Navigation -->
    <header class="bg-brand-dark text-white border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="{{ route('home') }}" class="flex items-center gap-2">
                <div class="p-2 bg-brand-blue rounded-xl text-white">
                    <i data-lucide="sparkles" class="w-5 h-5"></i>
                </div>
                <div>
                    <span class="text-lg font-display font-bold tracking-tight block">{{ $settings['logo_text'] ?? 'AdSpark' }}</span>
                    <span class="text-[9px] text-brand-blue font-bold uppercase tracking-widest block">Technologies</span>
                </div>
            </a>
            
            <nav class="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <a href="{{ route('home') }}" class="hover:text-white transition-all {{ Route::is('home') ? 'text-brand-blue' : '' }}">Home</a>
                <a href="{{ route('about') }}" class="hover:text-white transition-all {{ Route::is('about') ? 'text-brand-blue' : '' }}">About</a>
                <a href="{{ route('home') }}#services" class="hover:text-white transition-all">Services</a>
                <a href="{{ route('contact') }}" class="hover:text-white transition-all {{ Route::is('contact') ? 'text-brand-blue' : '' }}">Contact</a>
            </nav>

            <div class="flex items-center gap-3">
                <a href="{{ route('contact') }}" class="bg-brand-blue text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-opacity-95 shadow transition-all">
                    Consultation
                </a>
                <a href="{{ route('admin.login') }}" class="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all">
                    Admin
                </a>
            </div>
        </div>
    </header>

    <!-- Public Viewport -->
    <main class="flex-grow">
        @yield('content')
    </main>

    <!-- Footer Content -->
    <footer class="bg-brand-dark text-white border-t border-slate-800 py-12">
        <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-12 gap-8 text-xs font-normal">
            <div class="md:col-span-5 space-y-4">
                <div class="flex items-center gap-2">
                    <div class="p-2 bg-brand-blue rounded-xl text-white">
                        <i data-lucide="sparkles" class="w-5 h-5"></i>
                    </div>
                    <span class="text-base font-display font-bold text-white">{{ $settings['company_name'] ?? 'AdSpark Technologies' }}</span>
                </div>
                <p class="text-slate-400 leading-relaxed max-w-sm">
                    Designing highly secure systems architectures, robust APIs, custom integrations, and optimized IT pipelines for global business networks.
                </p>
                <div class="flex gap-3 text-slate-400 pt-2">
                    @foreach($socials ?? [] as $social)
                        <a href="{{ $social->url }}" target="_blank" class="hover:text-brand-blue p-1 bg-slate-900 border border-slate-800 rounded-lg transition-all" title="{{ $social->platform }}">
                            <i data-lucide="{{ strtolower($social->icon) }}" class="w-4 h-4"></i>
                        </a>
                    @endforeach
                </div>
            </div>

            <div class="md:col-span-3 space-y-3">
                <h4 class="font-display font-bold text-sm text-white uppercase tracking-wider">Quick Links</h4>
                <ul class="space-y-2 text-slate-400">
                    <li><a href="{{ route('home') }}" class="hover:text-white">Home Landing</a></li>
                    <li><a href="{{ route('about') }}" class="hover:text-white">Corporate Standards</a></li>
                    <li><a href="{{ route('home') }}#services" class="hover:text-white">Dynamic Catalog</a></li>
                    <li><a href="{{ route('contact') }}" class="hover:text-white">Inquiries Inbox</a></li>
                </ul>
            </div>

            <div class="md:col-span-4 space-y-3">
                <h4 class="font-display font-bold text-sm text-white uppercase tracking-wider">Contact Coordinates</h4>
                <ul class="space-y-2 text-slate-400">
                    <li class="flex items-start gap-2">
                        <i data-lucide="mail" class="w-4 h-4 text-brand-blue shrink-0"></i>
                        <span>{{ $settings['contact_email'] ?? 'adsparktechnologies01@gmail.com' }}</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i data-lucide="phone" class="w-4 h-4 text-brand-blue shrink-0"></i>
                        <span>{{ $settings['contact_phone'] ?? '+1 (555) 019-2831' }}</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i data-lucide="map-pin" class="w-4 h-4 text-brand-blue shrink-0"></i>
                        <span>{{ $settings['address'] ?? '100 Silicon Way, Suite 400, San Francisco, CA' }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-[10px]">
            &copy; {{ date('Y') }} {{ $settings['company_name'] ?? 'AdSpark Technologies' }}. All rights reserved. Built with Laravel 12.
        </div>
    </footer>

    <!-- Initialize Lucide Icons -->
    <script>
        lucide.createIcons();
    </script>
</body>
</html>
