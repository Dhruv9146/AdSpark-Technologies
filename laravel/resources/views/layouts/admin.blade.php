<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AdSpark Technologies | Admin Panel</title>
    
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
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col md:flex-row">

    <!-- Sidebar navigation -->
    <aside class="w-full md:w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between shrink-0">
        <div class="space-y-6">
            
            <!-- Logo brand info -->
            <a href="{{ route('home') }}" class="flex items-center gap-2 px-2">
                <div class="p-2 bg-brand-blue text-white rounded-xl shadow-md">
                    <i data-lucide="sparkles" class="w-5 h-5"></i>
                </div>
                <div>
                    <span class="text-base font-display font-bold text-slate-900 block">AdSpark Admin</span>
                    <span class="text-[10px] text-brand-blue font-semibold uppercase tracking-wider block">Laravel 12 CMS</span>
                </div>
            </a>

            <!-- Navigation links -->
            <nav class="space-y-1">
                <a href="{{ route('admin.dashboard') }}" class="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 {{ Route::is('admin.dashboard') ? 'text-white bg-brand-blue shadow-lg' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' }}">
                    <i data-lucide="bar-chart-3" class="w-4 h-4"></i>
                    Analytics & Enquiries
                </a>
                <a href="{{ route('admin.home') }}" class="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 {{ Route::is('admin.home') ? 'text-white bg-brand-blue shadow-lg' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' }}">
                    <i data-lucide="home" class="w-4 h-4"></i>
                    Manage Home Page
                </a>
                <a href="{{ route('admin.services') }}" class="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 {{ Route::is('admin.services') ? 'text-white bg-brand-blue shadow-lg' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' }}">
                    <i data-lucide="cpu" class="w-4 h-4"></i>
                    Manage Services
                </a>
                <a href="{{ route('admin.contact') }}" class="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 {{ Route::is('admin.contact') ? 'text-white bg-brand-blue shadow-lg' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' }}">
                    <i data-lucide="mail-question" class="w-4 h-4"></i>
                    Contact Info & Socials
                </a>
                <a href="{{ route('admin.settings') }}" class="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 {{ Route::is('admin.settings') ? 'text-white bg-brand-blue shadow-lg' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' }}">
                    <i data-lucide="sliders" class="w-4 h-4"></i>
                    Website Settings
                </a>
                <a href="{{ route('admin.files') }}" class="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 {{ Route::is('admin.files') ? 'text-white bg-brand-blue shadow-lg' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' }}">
                    <i data-lucide="file-up" class="w-4 h-4"></i>
                    Upload / Delete Files
                </a>
            </nav>
        </div>

        <!-- Admin profile & logout -->
        <div class="pt-6 border-t border-slate-200 space-y-4">
            <div class="flex items-center gap-3 px-2">
                <div class="w-9 h-9 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs border border-brand-blue/20">
                    AD
                </div>
                <div>
                    <span class="text-xs font-bold text-slate-900 block">Administrator</span>
                    <span class="text-[10px] text-slate-500 block">adsparktechnologies01@gmail.com</span>
                </div>
            </div>
            
            <form action="{{ route('admin.logout') }}" method="POST">
                @csrf
                <button type="submit" class="w-full py-2.5 px-3 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                    Sign Out
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Panel Content -->
    <main class="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 bg-slate-50">
        
        <!-- HEADER BAR -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
            <div>
                <span class="text-[10px] text-brand-blue font-bold uppercase tracking-widest block">System Workspace</span>
                <h1 class="text-xl md:text-2xl font-display font-bold text-slate-900 tracking-tight mt-1 capitalize">
                    @yield('admin_title')
                </h1>
            </div>
            <span class="text-xs bg-white text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                Laravel System: <span class="text-green-600 font-bold flex items-center gap-1">● DYNAMIC</span>
            </span>
        </div>

        <!-- Content Area -->
        @yield('content')
    </main>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
